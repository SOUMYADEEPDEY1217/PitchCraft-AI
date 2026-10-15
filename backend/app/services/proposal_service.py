"""
Proposal service layer with strict multi-tenant user data isolation.
Handles database transactions, JSON field serialization, status transitions,
Ollama generation logging to ai_generation_history, and live user-isolated dashboard metrics.
Never leaks records or metrics across accounts.
"""

import time
from datetime import datetime
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.models.proposal import Proposal
from app.models.client import Client
from app.models.generation_history import AIGenerationHistory
from app.schemas.proposal import (
    ProposalCreate,
    ProposalUpdate,
    ProposalGenerateRequest,
    ProposalResponse,
)
from app.schemas.dashboard import DashboardStatsResponse, MonthlyRevenueItem
from app.core.exceptions import NotFoundError, ValidationError
from app.services.ollama_service import ollama_service
from app.config import settings
from app.core.logging import logger


class ProposalService:
    @staticmethod
    def _to_response(proposal: Proposal) -> ProposalResponse:
        content = proposal.content_json or {}
        pricing = proposal.pricing_json or {}
        client = proposal.client

        total_budget = pricing.get("totalBudget")
        if total_budget is None:
            total_budget = sum(
                p.get("total", 0.0) for p in pricing.get("pricingItems", [])
            )

        return ProposalResponse(
            id=proposal.id,
            clientId=proposal.client_id,
            title=proposal.project_title,
            brief=proposal.project_brief,
            serviceCategory=proposal.service_category,
            tone=proposal.tone,
            currency=proposal.currency,
            status=proposal.status,
            contentJson=content,
            pricingJson=pricing,
            createdAt=proposal.created_at,
            updatedAt=proposal.updated_at,
            # Flat presentation fields
            clientName=client.name if client else content.get("clientName", ""),
            clientCompany=client.company if client else content.get("clientCompany", ""),
            clientEmail=client.email if client else content.get("clientEmail", ""),
            industry=client.industry if client else content.get("industry", "General"),
            deadline=content.get("deadline", ""),
            totalBudget=float(total_budget or 0.0),
            executiveSummary=content.get("executiveSummary", ""),
            problemUnderstanding=content.get("problemUnderstanding", content.get("problem_understanding", "")),
            objectives=content.get("objectives", []),
            proposedSolution=content.get("proposedSolution", ""),
            deliverables=content.get("deliverables", []),
            scopeIncluded=content.get("scopeIncluded", []),
            scopeExcluded=content.get("scopeExcluded", []),
            assumptionsAndExclusions=content.get("assumptionsAndExclusions", content.get("assumptions_and_exclusions", [])),
            timelineSummary=content.get("timelineSummary", ""),
            estimatedTimeline=content.get("estimatedTimeline", content.get("estimated_timeline", content.get("timelineSummary", ""))),
            milestones=content.get("milestones", []),
            pricingItems=pricing.get("pricingItems", []),
            pricingNotes=pricing.get("pricingNotes", ""),
            pricingExplanation=pricing.get("pricingExplanation", pricing.get("pricing_explanation", "")),
            paymentTerms=pricing.get("paymentTerms", ""),
            clientResponsibilities=content.get("clientResponsibilities", []),
            termsAndConditions=content.get("termsAndConditions", ""),
            callToAction=content.get("callToAction", ""),
            viewCount=content.get("viewCount", 0),
        )

    @staticmethod
    def get_proposals(
        db: Session,
        user_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
        status: Optional[str] = None,
        service_category: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> Tuple[List[ProposalResponse], int]:
        query = db.query(Proposal).join(Client, isouter=True)

        if user_id:
            query = query.filter(Proposal.user_id == user_id)

        if search:
            search_filter = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Proposal.project_title.ilike(search_filter),
                    Proposal.project_brief.ilike(search_filter),
                    Client.name.ilike(search_filter),
                    Client.company.ilike(search_filter),
                )
            )

        if status and status != "all":
            query = query.filter(Proposal.status == status)

        if service_category and service_category != "all":
            query = query.filter(Proposal.service_category == service_category)

        total = query.count()

        sort_column = getattr(Proposal, sort_by, Proposal.created_at)
        if sort_order.lower() == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))

        items = query.offset(skip).limit(limit).all()
        return [ProposalService._to_response(p) for p in items], total

    @staticmethod
    def get_proposal_by_id(db: Session, proposal_id: str, user_id: Optional[str] = None) -> ProposalResponse:
        query = db.query(Proposal).filter(Proposal.id == proposal_id)
        if user_id:
            query = query.filter(Proposal.user_id == user_id)

        proposal = query.first()
        if not proposal:
            raise NotFoundError("Proposal", proposal_id)

        # Increment view count in content_json
        content = dict(proposal.content_json or {})
        content["viewCount"] = content.get("viewCount", 0) + 1
        content["lastViewedAt"] = datetime.utcnow().isoformat()
        proposal.content_json = content
        db.commit()
        db.refresh(proposal)

        return ProposalService._to_response(proposal)

    @staticmethod
    def get_proposal_model(db: Session, proposal_id: str, user_id: Optional[str] = None) -> Proposal:
        query = db.query(Proposal).filter(Proposal.id == proposal_id)
        if user_id:
            query = query.filter(Proposal.user_id == user_id)

        proposal = query.first()
        if not proposal:
            raise NotFoundError("Proposal", proposal_id)
        return proposal

    @staticmethod
    def create_proposal(db: Session, proposal_in: ProposalCreate, user_id: Optional[str] = None) -> ProposalResponse:
        # Match client or auto-provision, scoped to user
        client = None
        if proposal_in.client_id:
            c_query = db.query(Client).filter(Client.id == proposal_in.client_id)
            if user_id:
                c_query = c_query.filter(Client.user_id == user_id)
            client = c_query.first()
        elif proposal_in.client_email:
            c_query = db.query(Client).filter(Client.email == proposal_in.client_email)
            if user_id:
                c_query = c_query.filter(Client.user_id == user_id)
            client = c_query.first()

        if not client:
            if proposal_in.client_name:
                client = Client(
                    user_id=user_id,
                    name=proposal_in.client_name,
                    company=proposal_in.client_company or proposal_in.client_name,
                    email=proposal_in.client_email or f"{proposal_in.client_name.lower().replace(' ', '')}@example.com",
                    industry=proposal_in.service_category or "Technology",
                    status="lead",
                )
                db.add(client)
                db.commit()
                db.refresh(client)
            else:
                raise ValidationError("Proposal requires a valid client_id or client_name/email.")

        # Consolidate content_json
        content = dict(proposal_in.content_json or {})
        if proposal_in.executive_summary is not None:
            content["executiveSummary"] = proposal_in.executive_summary
        if proposal_in.objectives is not None:
            content["objectives"] = proposal_in.objectives
        if proposal_in.proposed_solution is not None:
            content["proposedSolution"] = proposal_in.proposed_solution
        if proposal_in.deliverables is not None:
            content["deliverables"] = proposal_in.deliverables
        if proposal_in.scope_included is not None:
            content["scopeIncluded"] = proposal_in.scope_included
        if proposal_in.scope_excluded is not None:
            content["scopeExcluded"] = proposal_in.scope_excluded
        if proposal_in.timeline_summary is not None:
            content["timelineSummary"] = proposal_in.timeline_summary
        if proposal_in.milestones is not None:
            content["milestones"] = [
                m if isinstance(m, dict) else m.model_dump()
                for m in proposal_in.milestones
            ]
        if proposal_in.client_responsibilities is not None:
            content["clientResponsibilities"] = proposal_in.client_responsibilities
        if proposal_in.terms_and_conditions is not None:
            content["termsAndConditions"] = proposal_in.terms_and_conditions
        if proposal_in.call_to_action is not None:
            content["callToAction"] = proposal_in.call_to_action
        if proposal_in.deadline is not None:
            content["deadline"] = proposal_in.deadline

        # Consolidate pricing_json
        pricing = dict(proposal_in.pricing_json or {})
        if proposal_in.pricing_items is not None:
            pricing["pricingItems"] = [
                p if isinstance(p, dict) else p.model_dump(by_alias=True)
                for p in proposal_in.pricing_items
            ]
        if proposal_in.total_budget is not None:
            pricing["totalBudget"] = proposal_in.total_budget
        elif "totalBudget" not in pricing and pricing.get("pricingItems"):
            pricing["totalBudget"] = sum(
                p.get("total", 0.0) for p in pricing.get("pricingItems", [])
            )
        if proposal_in.pricing_notes is not None:
            pricing["pricingNotes"] = proposal_in.pricing_notes
        if proposal_in.payment_terms is not None:
            pricing["paymentTerms"] = proposal_in.payment_terms

        project_title = proposal_in.project_title or "Client Project Proposal"
        project_brief = proposal_in.project_brief or content.get("executiveSummary", "")

        proposal = Proposal(
            id=proposal_in.id or f"prop-{datetime.utcnow().strftime('%y%m%d%H%M%S')}",
            user_id=user_id,
            client_id=client.id,
            project_title=project_title,
            project_brief=project_brief,
            service_category=proposal_in.service_category or "web_development",
            tone=proposal_in.tone or "consultative",
            currency=proposal_in.currency or "USD",
            content_json=content,
            pricing_json=pricing,
            status=proposal_in.status or "draft",
        )

        db.add(proposal)
        db.commit()
        db.refresh(proposal)

        logger.info(f"Created proposal {proposal.id} for user {user_id}")
        return ProposalService._to_response(proposal)

    @staticmethod
    def update_proposal(
        db: Session,
        proposal_id: str,
        proposal_in: ProposalUpdate,
        user_id: Optional[str] = None,
    ) -> ProposalResponse:
        query = db.query(Proposal).filter(Proposal.id == proposal_id)
        if user_id:
            query = query.filter(Proposal.user_id == user_id)

        proposal = query.first()
        if not proposal:
            raise NotFoundError("Proposal", proposal_id)

        if proposal_in.project_title is not None:
            proposal.project_title = proposal_in.project_title
        if proposal_in.project_brief is not None:
            proposal.project_brief = proposal_in.project_brief
        if proposal_in.service_category is not None:
            proposal.service_category = proposal_in.service_category
        if proposal_in.tone is not None:
            proposal.tone = proposal_in.tone
        if proposal_in.currency is not None:
            proposal.currency = proposal_in.currency
        if proposal_in.status is not None:
            proposal.status = proposal_in.status

        # Merge content updates
        content = dict(proposal.content_json or {})
        if proposal_in.content_json:
            content.update(proposal_in.content_json)
        if proposal_in.executive_summary is not None:
            content["executiveSummary"] = proposal_in.executive_summary
        if proposal_in.objectives is not None:
            content["objectives"] = proposal_in.objectives
        if proposal_in.proposed_solution is not None:
            content["proposedSolution"] = proposal_in.proposed_solution
        if proposal_in.deliverables is not None:
            content["deliverables"] = proposal_in.deliverables
        if proposal_in.scope_included is not None:
            content["scopeIncluded"] = proposal_in.scope_included
        if proposal_in.scope_excluded is not None:
            content["scopeExcluded"] = proposal_in.scope_excluded
        if proposal_in.timeline_summary is not None:
            content["timelineSummary"] = proposal_in.timeline_summary
        if proposal_in.milestones is not None:
            content["milestones"] = [
                m if isinstance(m, dict) else m.model_dump()
                for m in proposal_in.milestones
            ]
        if proposal_in.client_responsibilities is not None:
            content["clientResponsibilities"] = proposal_in.client_responsibilities
        if proposal_in.terms_and_conditions is not None:
            content["termsAndConditions"] = proposal_in.terms_and_conditions
        if proposal_in.call_to_action is not None:
            content["callToAction"] = proposal_in.call_to_action
        if proposal_in.deadline is not None:
            content["deadline"] = proposal_in.deadline
        proposal.content_json = content

        # Merge pricing updates
        pricing = dict(proposal.pricing_json or {})
        if proposal_in.pricing_json:
            pricing.update(proposal_in.pricing_json)
        if proposal_in.pricing_items is not None:
            pricing["pricingItems"] = [
                p if isinstance(p, dict) else p.model_dump(by_alias=True)
                for p in proposal_in.pricing_items
            ]
        if proposal_in.total_budget is not None:
            pricing["totalBudget"] = proposal_in.total_budget
        if proposal_in.pricing_notes is not None:
            pricing["pricingNotes"] = proposal_in.pricing_notes
        if proposal_in.payment_terms is not None:
            pricing["paymentTerms"] = proposal_in.payment_terms
        proposal.pricing_json = pricing

        proposal.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(proposal)

        return ProposalService._to_response(proposal)

    @staticmethod
    def update_status(db: Session, proposal_id: str, status: str, user_id: Optional[str] = None) -> ProposalResponse:
        query = db.query(Proposal).filter(Proposal.id == proposal_id)
        if user_id:
            query = query.filter(Proposal.user_id == user_id)

        proposal = query.first()
        if not proposal:
            raise NotFoundError("Proposal", proposal_id)

        proposal.status = status
        proposal.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(proposal)

        return ProposalService._to_response(proposal)

    @staticmethod
    def delete_proposal(db: Session, proposal_id: str, user_id: Optional[str] = None) -> bool:
        query = db.query(Proposal).filter(Proposal.id == proposal_id)
        if user_id:
            query = query.filter(Proposal.user_id == user_id)

        proposal = query.first()
        if not proposal:
            raise NotFoundError("Proposal", proposal_id)

        db.delete(proposal)
        db.commit()
        logger.info(f"Deleted proposal {proposal_id} for user {user_id}")
        return True

    @staticmethod
    async def generate_and_save_proposal(
        db: Session,
        req: ProposalGenerateRequest,
        user_id: Optional[str] = None,
    ) -> ProposalResponse:
        start_time = time.time()
        generation_status = "success"

        try:
            content_dict = await ollama_service.generate_proposal_content(req)
        except Exception as e:
            generation_status = "failed"
            logger.error(f"Error in Ollama generation: {e}")
            raise

        duration_ms = int((time.time() - start_time) * 1000)

        # Match or auto-create client in CRM
        client = None
        if req.client_id:
            c_q = db.query(Client).filter(Client.id == req.client_id)
            if user_id:
                c_q = c_q.filter(Client.user_id == user_id)
            client = c_q.first()
        elif req.client_email:
            c_q = db.query(Client).filter(Client.email == req.client_email)
            if user_id:
                c_q = c_q.filter(Client.user_id == user_id)
            client = c_q.first()

        if not client and req.client_name:
            client = Client(
                user_id=user_id,
                name=req.client_name,
                company=req.client_company or req.client_name,
                email=req.client_email or f"{req.client_name.lower().replace(' ', '')}@example.com",
                industry=req.industry,
                status="lead",
            )
            db.add(client)
            db.commit()
            db.refresh(client)

        content_json = {
            "executiveSummary": content_dict.get("executive_summary", ""),
            "problemUnderstanding": content_dict.get("problem_understanding", ""),
            "objectives": content_dict.get("objectives", []),
            "proposedSolution": content_dict.get("proposed_solution", ""),
            "deliverables": content_dict.get("deliverables", []),
            "scopeIncluded": content_dict.get("scope_included", []),
            "scopeExcluded": content_dict.get("scope_excluded", []),
            "assumptionsAndExclusions": content_dict.get("assumptions_and_exclusions", []),
            "timelineSummary": content_dict.get("timeline_summary", ""),
            "estimatedTimeline": content_dict.get("estimated_timeline", content_dict.get("timeline_summary", "")),
            "milestones": content_dict.get("milestones", []),
            "clientResponsibilities": content_dict.get("client_responsibilities", []),
            "termsAndConditions": content_dict.get("terms_and_conditions", ""),
            "callToAction": content_dict.get("call_to_action", ""),
            "deadline": req.deadline,
        }

        pricing_json = {
            "totalBudget": req.target_budget,
            "pricingItems": content_dict.get("pricing_items", []),
            "pricingNotes": content_dict.get("pricing_notes", ""),
            "pricingExplanation": content_dict.get("pricing_explanation", ""),
            "paymentTerms": content_dict.get("payment_terms", ""),
        }

        proposal = Proposal(
            id=f"prop-{datetime.utcnow().strftime('%y%m%d%H%M%S')}",
            user_id=user_id,
            client_id=client.id if client else "cli-default",
            project_title=req.project_title,
            project_brief=req.brief,
            service_category=req.service_category,
            tone=req.tone,
            currency=req.currency,
            content_json=content_json,
            pricing_json=pricing_json,
            status="draft",
        )
        db.add(proposal)
        db.commit()
        db.refresh(proposal)

        # Record AI Generation History Table
        history = AIGenerationHistory(
            user_id=user_id,
            proposal_id=proposal.id,
            model_name=req.model or settings.OLLAMA_MODEL,
            generation_type="proposal_full",
            duration_ms=duration_ms,
            status=generation_status,
        )
        db.add(history)
        db.commit()

        logger.info(f"AI generated proposal {proposal.id} for user {user_id}")
        return ProposalService._to_response(proposal)

    @staticmethod
    async def regenerate_proposal_section(
        db: Session,
        proposal_id: str,
        section_key: str,
        instructions: Optional[str] = None,
        model: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> ProposalResponse:
        start_time = time.time()
        query = db.query(Proposal).filter(Proposal.id == proposal_id)
        if user_id:
            query = query.filter(Proposal.user_id == user_id)

        proposal = query.first()
        if not proposal:
            raise NotFoundError("Proposal", proposal_id)

        content = dict(proposal.content_json or {})
        pricing = dict(proposal.pricing_json or {})
        client = proposal.client

        key_mapping = {
            "executive_summary": content.get("executiveSummary"),
            "problem_understanding": content.get("problemUnderstanding"),
            "proposed_solution": content.get("proposedSolution"),
            "deliverables": content.get("deliverables"),
            "scope_of_work": content.get("scopeIncluded"),
            "milestones": content.get("milestones"),
            "timeline_summary": content.get("timelineSummary"),
            "assumptions_and_exclusions": content.get("assumptionsAndExclusions"),
            "pricing_explanation": pricing.get("pricingExplanation"),
            "terms_and_conditions": content.get("termsAndConditions"),
            "call_to_action": content.get("callToAction"),
        }
        current_content = key_mapping.get(section_key)

        from app.schemas.ai import SectionRegenerateRequest
        req = SectionRegenerateRequest(
            sectionKey=section_key,
            proposalId=proposal.id,
            projectTitle=proposal.project_title,
            clientName=client.name if client else content.get("clientName", ""),
            clientCompany=client.company if client else content.get("clientCompany", ""),
            industry=client.industry if client else content.get("industry", "Technology"),
            tone=proposal.tone,
            brief=proposal.project_brief,
            targetBudget=pricing.get("totalBudget", 10000.0),
            currency=proposal.currency,
            deadline=content.get("deadline", ""),
            instructions=instructions,
            currentContent=current_content,
            model=model,
        )

        res = await ollama_service.regenerate_section(req)
        new_val = res.regenerated_content

        # Update only target section in proposal JSON
        if section_key == "executive_summary":
            content["executiveSummary"] = str(new_val)
        elif section_key == "problem_understanding":
            content["problemUnderstanding"] = str(new_val)
        elif section_key == "proposed_solution":
            content["proposedSolution"] = str(new_val)
        elif section_key == "deliverables":
            content["deliverables"] = new_val if isinstance(new_val, list) else [str(new_val)]
        elif section_key == "scope_of_work":
            content["scopeIncluded"] = new_val if isinstance(new_val, list) else [str(new_val)]
        elif section_key == "milestones":
            content["milestones"] = new_val if isinstance(new_val, list) else []
        elif section_key == "timeline_summary":
            content["timelineSummary"] = str(new_val)
            content["estimatedTimeline"] = str(new_val)
        elif section_key == "assumptions_and_exclusions":
            content["assumptionsAndExclusions"] = new_val if isinstance(new_val, list) else [str(new_val)]
        elif section_key == "pricing_explanation":
            pricing["pricingExplanation"] = str(new_val)
        elif section_key == "terms_and_conditions":
            content["termsAndConditions"] = str(new_val)
        elif section_key == "call_to_action":
            content["callToAction"] = str(new_val)
        else:
            content[section_key] = new_val

        proposal.content_json = content
        proposal.pricing_json = pricing
        proposal.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(proposal)

        duration_ms = int((time.time() - start_time) * 1000)
        history = AIGenerationHistory(
            user_id=user_id,
            proposal_id=proposal.id,
            model_name=res.model_used,
            generation_type=f"regenerate_{section_key}",
            duration_ms=duration_ms,
            status="success",
        )
        db.add(history)
        db.commit()

        logger.info(f"Regenerated section '{section_key}' for proposal {proposal.id} (user {user_id})")
        return ProposalService._to_response(proposal)

    @staticmethod
    def get_dashboard_stats(db: Session, user_id: Optional[str] = None) -> DashboardStatsResponse:
        """
        Computes genuine metrics directly from the authenticated user's records.
        For a new account with 0 records, returns exactly 0 proposals, 0 clients, 0 quoted, 0 won.
        Never returns synthetic demo numbers.
        """
        p_query = db.query(Proposal)
        c_query = db.query(Client)

        if user_id:
            p_query = p_query.filter(Proposal.user_id == user_id)
            c_query = c_query.filter(Client.user_id == user_id)

        proposals = p_query.all()
        clients_count = c_query.count()

        total = len(proposals)
        draft_count = sum(1 for p in proposals if p.status == "draft")
        sent_count = sum(1 for p in proposals if p.status == "sent")
        in_review_count = sum(1 for p in proposals if p.status == "in_review")
        accepted_count = sum(1 for p in proposals if p.status == "accepted")
        declined_count = sum(1 for p in proposals if p.status in ["declined", "rejected"])

        total_quoted = sum(
            float(p.pricing_json.get("totalBudget", 0.0)) for p in proposals
        )
        total_won = sum(
            float(p.pricing_json.get("totalBudget", 0.0))
            for p in proposals
            if p.status == "accepted"
        )
        win_rate = round((accepted_count / total * 100.0), 1) if total > 0 else 0.0

        # Compute genuine monthly aggregation from real proposals
        month_buckets: Dict[str, Dict[str, float]] = {}
        for p in proposals:
            m_label = p.created_at.strftime("%b") if p.created_at else "Current"
            if m_label not in month_buckets:
                month_buckets[m_label] = {"quoted": 0.0, "won": 0.0}
            b = float(p.pricing_json.get("totalBudget", 0.0))
            month_buckets[m_label]["quoted"] += b
            if p.status == "accepted":
                month_buckets[m_label]["won"] += b

        monthly_items = [
            MonthlyRevenueItem(month=k, quoted=round(v["quoted"], 2), won=round(v["won"], 2))
            for k, v in month_buckets.items()
        ]

        return DashboardStatsResponse(
            total_proposals=total,
            draft_count=draft_count,
            sent_count=sent_count,
            in_review_count=in_review_count,
            accepted_count=accepted_count,
            declined_count=declined_count,
            total_quoted_value=round(total_quoted, 2),
            total_won_value=round(total_won, 2),
            win_rate_percent=win_rate,
            active_pipeline_count=sent_count + in_review_count,
            clients_count=clients_count,
            monthly_data=monthly_items,
        )


proposal_service = ProposalService()
