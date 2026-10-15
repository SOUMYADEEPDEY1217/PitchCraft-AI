"""
PDF generation service for proposals using ReportLab.
Includes graceful fallback if ReportLab binary libraries are missing in local dev.
"""

import io
import html
from typing import Any
from app.models.proposal import Proposal
from app.core.logging import logger

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False


def _clean_text(val: Any) -> str:
    """Escapes XML entities and strips unprintable characters for safe PDF typography."""
    if val is None:
        return ""
    text = str(val)
    # Clean standard XML chars for ReportLab Paragraph flowable
    text = html.escape(text, quote=False)
    # Replace non-breaking spaces
    text = text.replace('\xa0', ' ')
    return text


def _draw_page_footer(canvas: Any, doc: Any) -> None:
    """Draws consistent running footer with page numbers and confidentiality notice."""
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#94a3b8'))
    canvas.setStrokeColor(colors.HexColor('#cbd5e1'))
    canvas.setLineWidth(0.5)
    canvas.line(40, 30, 572, 30)
    canvas.drawString(40, 18, "Confidential Business Proposal · Prepared via PitchCraft AI")
    canvas.drawRightString(572, 18, f"Page {doc.page}")
    canvas.restoreState()


class PdfService:
    @staticmethod
    def generate_proposal_pdf(proposal: Proposal) -> bytes:
        """
        Generates an executive-grade PDF proposal document.
        """
        buffer = io.BytesIO()

        if REPORTLAB_AVAILABLE:
            try:
                doc = SimpleDocTemplate(
                    buffer,
                    pagesize=letter,
                    rightMargin=40,
                    leftMargin=40,
                    topMargin=40,
                    bottomMargin=40,
                )
                styles = getSampleStyleSheet()

                # Custom typographic styles
                title_style = ParagraphStyle(
                    "DocTitle",
                    parent=styles["Normal"],
                    fontName="Helvetica-Bold",
                    fontSize=20,
                    leading=24,
                    textColor=colors.HexColor("#0f172a"),
                )
                subtitle_style = ParagraphStyle(
                    "DocSubtitle",
                    parent=styles["Normal"],
                    fontName="Helvetica",
                    fontSize=10,
                    leading=14,
                    textColor=colors.HexColor("#64748b"),
                )
                h2_style = ParagraphStyle(
                    "Heading2Custom",
                    parent=styles["Heading2"],
                    fontName="Helvetica-Bold",
                    fontSize=12,
                    leading=16,
                    textColor=colors.HexColor("#1e293b"),
                    spaceBefore=14,
                    spaceAfter=6,
                )
                body_style = ParagraphStyle(
                    "BodyCustom",
                    parent=styles["Normal"],
                    fontName="Helvetica",
                    fontSize=9,
                    leading=13,
                    textColor=colors.HexColor("#334155"),
                )
                bullet_style = ParagraphStyle(
                    "BulletCustom",
                    parent=styles["Normal"],
                    fontName="Helvetica",
                    fontSize=8.5,
                    leading=12,
                    textColor=colors.HexColor("#334155"),
                    leftIndent=12,
                )

                elements = []

                # Header Brand & Proposal Title
                elements.append(Paragraph("PITCHCRAFT AI · BUSINESS PROPOSAL SPECIFICATION", subtitle_style))
                elements.append(Spacer(1, 4))
                prop_title = getattr(proposal, "title", None) or getattr(proposal, "project_title", "Business Proposal")
                elements.append(Paragraph(_clean_text(str(prop_title)), title_style))
                elements.append(Spacer(1, 6))

                client_company = getattr(proposal, "client_company", None) or getattr(proposal, "client_name", "Valued Client")
                header_meta = f"Client: <b>{client_company}</b> ({proposal.client_name}) · Date: {proposal.created_at.strftime('%B %d, %Y')} · Status: <b>{proposal.status.upper()}</b>"
                elements.append(Paragraph(header_meta, subtitle_style))
                elements.append(Spacer(1, 10))
                elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=4, spaceAfter=14))

                # Executive Summary
                elements.append(Paragraph("01. Executive Summary", h2_style))
                elements.append(Paragraph(_clean_text(proposal.executive_summary or "N/A"), body_style))
                elements.append(Spacer(1, 10))

                # Problem Understanding (if present)
                problem_und = None
                if hasattr(proposal, "content_json") and isinstance(proposal.content_json, dict):
                    problem_und = proposal.content_json.get("problemUnderstanding") or proposal.content_json.get("problem_understanding")
                if not problem_und and hasattr(proposal, "problem_understanding"):
                    problem_und = proposal.problem_understanding

                if problem_und:
                    elements.append(Paragraph("02. Problem Understanding & Analysis", h2_style))
                    elements.append(Paragraph(_clean_text(problem_und), body_style))
                    elements.append(Spacer(1, 10))

                # Strategic Objectives
                if proposal.objectives:
                    elements.append(Paragraph("03. Strategic Objectives", h2_style))
                    for obj in proposal.objectives:
                        elements.append(Paragraph(f"• {_clean_text(obj)}", bullet_style))
                    elements.append(Spacer(1, 10))

                # Proposed Solution
                if proposal.proposed_solution:
                    elements.append(Paragraph("04. Proposed Solution & Methodology", h2_style))
                    elements.append(Paragraph(_clean_text(proposal.proposed_solution), body_style))
                    elements.append(Spacer(1, 10))

                # Deliverables
                if proposal.deliverables:
                    elements.append(Paragraph("05. Key Deliverables Specification", h2_style))
                    for deliv in proposal.deliverables:
                        elements.append(Paragraph(f"• {_clean_text(deliv)}", bullet_style))
                    elements.append(Spacer(1, 10))

                # Assumptions and Exclusions
                assumptions = []
                if hasattr(proposal, "content_json") and isinstance(proposal.content_json, dict):
                    assumptions = proposal.content_json.get("assumptionsAndExclusions") or proposal.content_json.get("assumptions_and_exclusions") or []
                if not assumptions and hasattr(proposal, "assumptions_and_exclusions"):
                    assumptions = proposal.assumptions_and_exclusions or []

                if assumptions:
                    elements.append(Paragraph("06. Assumptions & Exclusions", h2_style))
                    for item in assumptions:
                        elements.append(Paragraph(f"• {_clean_text(item)}", bullet_style))
                    elements.append(Spacer(1, 10))

                # Milestones Table
                if proposal.milestones:
                    elements.append(Paragraph("07. Phased Milestones & Timeline", h2_style))
                    table_data = [["Milestone Phase", "Timeline", "Settlement Amount"]]
                    for m in proposal.milestones:
                        amount_str = f"{proposal.currency} {m.get('amount', 0):,.2f}"
                        table_data.append([_clean_text(m.get("title", "")), _clean_text(m.get("duration", "")), amount_str])

                    milestone_table = Table(table_data, colWidths=[260, 130, 140])
                    milestone_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                        ('TOPPADDING', (0, 0), (-1, -1), 6),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
                    ]))
                    elements.append(milestone_table)
                    elements.append(Spacer(1, 14))

                # Pricing Table
                elements.append(Paragraph("08. Quotation Breakdown & Investment Schedule", h2_style))
                pricing_data = [["Deliverable Item", "Hours / Units", "Rate", "Total"]]
                for p in (proposal.pricing_items or []):
                    item_desc = _clean_text(p.get("description", ""))
                    hrs = str(p.get("hoursOrUnits", 1))
                    rate_str = f"{proposal.currency} {p.get('rate', 0):,.2f}"
                    tot_str = f"{proposal.currency} {p.get('total', 0):,.2f}"
                    pricing_data.append([item_desc, hrs, rate_str, tot_str])

                pricing_data.append([
                    "Grand Total Fixed Engagement",
                    "",
                    "",
                    f"{proposal.currency} {proposal.total_budget:,.2f}"
                ])

                pricing_table = Table(pricing_data, colWidths=[270, 70, 90, 100])
                pricing_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 8.5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                    ('TOPPADDING', (0, 0), (-1, -1), 5),
                    ('GRID', (0, 0), (-1, -2), 0.5, colors.HexColor('#e2e8f0')),
                    ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
                    ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f8fafc')),
                ]))
                elements.append(pricing_table)
                elements.append(Spacer(1, 14))

                # Payment Terms
                if proposal.payment_terms:
                    elements.append(Paragraph("09. Payment Terms & Milestone Invoicing", h2_style))
                    elements.append(Paragraph(_clean_text(proposal.payment_terms), body_style))
                    elements.append(Spacer(1, 10))

                # Terms & Signoff
                if proposal.terms_and_conditions:
                    elements.append(Paragraph("10. Terms & Conditions / IP Ownership", h2_style))
                    elements.append(Paragraph(_clean_text(proposal.terms_and_conditions), body_style))
                    elements.append(Spacer(1, 14))

                # Authorization Sign-off
                elements.append(Paragraph("11. Authorization & Digital Sign-off", h2_style))
                elements.append(Paragraph(_clean_text(proposal.call_to_action or "Countersign to authorize this proposal."), body_style))
                elements.append(Spacer(1, 20))

                sign_data = [
                    ["Authorized Client Signature", "Consultant Acceptance"],
                    ["\n_______________________________", "\n_______________________________"],
                    [f"Date: ________________________", f"Date: ________________________"]
                ]
                sign_table = Table(sign_data, colWidths=[265, 265])
                sign_table.setStyle(TableStyle([
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 8.5),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#475569')),
                ]))
                elements.append(sign_table)

                # Build document with page footer callback
                doc.build(elements, onFirstPage=_draw_page_footer, onLaterPages=_draw_page_footer)
                return buffer.getvalue()
            except Exception as e:
                logger.error(f"Error compiling ReportLab PDF: {e}", exc_info=True)

        # Fallback raw PDF generation if ReportLab is not available
        return PdfService._build_fallback_pdf(proposal)

    @staticmethod
    def _build_fallback_pdf(proposal: Proposal) -> bytes:
        """Constructs a basic valid PDF document binary stream."""
        p_title = getattr(proposal, "title", None) or getattr(proposal, "project_title", "Business Proposal")
        p_client = getattr(proposal, "client_name", "Valued Client")
        p_currency = getattr(proposal, "currency", "USD")
        p_budget = getattr(proposal, "total_budget", 0)
        p_status = getattr(proposal, "status", "draft")
        content = (
            f"%PDF-1.4\n"
            f"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            f"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
            f"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n"
            f"4 0 obj << /Length 200 >> stream\n"
            f"BT\n/F1 18 Tf\n50 720 Td\n({p_title}) Tj\n"
            f"/F1 12 Tf\n0 -30 Td\n(Client: {p_client}) Tj\n"
            f"0 -20 Td\n(Total Budget: {p_currency} {p_budget}) Tj\n"
            f"0 -20 Td\n(Status: {p_status}) Tj\n"
            f"ET\nendstream\nendobj\n"
            f"5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n"
            f"xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000244 00000 n \n0000000494 00000 n \n"
            f"trailer << /Size 6 /Root 1 0 R >>\nstartxref\n565\n%%EOF"
        )
        return content.encode("utf-8")


pdf_service = PdfService()
