"""
PitchCraft AI — Standalone Database Demo Seed Script
Populates SQLite or PostgreSQL database with realistic synthetic freelancers,
clients, proposals, milestones, pricing breakdowns, and AI generation history.

Usage:
    python seed.py
    python seed.py --clear
"""

import sys
import os
import argparse
from datetime import datetime, timedelta

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import engine, Base, SessionLocal
from app.models.client import Client
from app.models.proposal import Proposal
from app.models.generation_history import AIGenerationHistory
from app.core.logging import logger


def seed_database(clear_existing: bool = False):
    print("=" * 60)
    print("PitchCraft AI — Synthetic Data Seeder")
    print("=" * 60)

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if clear_existing:
            print("[INFO] Clearing existing records...")
            db.query(AIGenerationHistory).delete()
            db.query(Proposal).delete()
            db.query(Client).delete()
            db.commit()
            print("[INFO] Database cleared.")

        existing_clients = db.query(Client).count()
        if existing_clients > 0 and not clear_existing:
            print(f"[INFO] Database already contains {existing_clients} client(s).")
            print("[INFO] Use `python seed.py --clear` if you want to replace existing data.")
            return

        print("[INFO] Seeding clients...")

        c1 = Client(
            id="cli-001",
            name="Marcus Vance",
            company="Apex BioLogics",
            email="marcus@apexbiologics.io",
            phone="+1 (415) 890-2134",
            website="https://apexbiologics.io",
            industry="Biotechnology & HealthTech",
            status="active",
            notes="Series A clinical trials data platform. Needs HIPAA-compliant clinical registry web application.",
        )

        c2 = Client(
            id="cli-002",
            name="Elena Rostova",
            company="Nordic Roast Co.",
            email="elena@nordicroast.com",
            phone="+44 20 7946 0912",
            website="https://nordicroast.com",
            industry="E-Commerce & Specialty Retail",
            status="active",
            notes="Direct-to-consumer coffee brand migrating to headless Shopify Plus with sub-second page loads.",
        )

        c3 = Client(
            id="cli-003",
            name="Devon Hughes",
            company="Krypton Logistics",
            email="devon@kryptonlogistics.net",
            phone="+1 (512) 402-8819",
            website="https://kryptonlogistics.net",
            industry="Freight & Supply Chain",
            status="lead",
            notes="Fleet tracking dispatch dashboard and real-time route telemetry for 180 vehicles.",
        )

        c4 = Client(
            id="cli-004",
            name="Dr. Sarah Jenkins",
            company="NeuroPulse Dynamics",
            email="sarah.jenkins@neuropulse.ai",
            phone="+1 (617) 555-0182",
            website="https://neuropulse.ai",
            industry="AI & Neural Interfaces",
            status="active",
            notes="EEG EEG telemetry visualization studio. Looking for real-time WebGL waveform canvas.",
        )

        c5 = Client(
            id="cli-005",
            name="Carlos Mendez",
            company="Solara Clean Energy",
            email="carlos@solaraenergy.org",
            phone="+1 (303) 492-7100",
            website="https://solaraenergy.org",
            industry="CleanTech & Solar",
            status="lead",
            notes="Commercial solar ROI quotation estimator and interactive customer portal.",
        )

        db.add_all([c1, c2, c3, c4, c5])
        db.commit()
        print(f"[OK] Seeded 5 clients.")

        print("[INFO] Seeding proposals...")

        # Proposal 1: Accepted full-stack clinical portal
        p1 = Proposal(
            id="prop-101",
            client_id="cli-001",
            project_title="Clinical Data Portal Redesign & React Migration",
            project_brief="Apex BioLogics requires a modernized, HIPAA-compliant patient cohort explorer to replace legacy spreadsheets and accelerate investigator data extraction.",
            service_category="full_stack",
            tone="executive",
            currency="USD",
            status="accepted",
            content_json={
                "clientName": "Marcus Vance",
                "clientCompany": "Apex BioLogics",
                "clientEmail": "marcus@apexbiologics.io",
                "industry": "Biotechnology & HealthTech",
                "deadline": "2026-11-20",
                "executiveSummary": "Apex BioLogics requires a modernized, HIPAA-compliant patient cohort explorer to replace legacy spreadsheets and accelerate investigator data extraction by 65%.",
                "objectives": [
                    "Reduce clinical researcher query time from 14 minutes to under 45 seconds",
                    "Deliver WCAG 2.1 AA accessible high-density data tables with tabular figures",
                    "Implement role-based row-level obfuscation for unblinded trial phases",
                ],
                "proposedSolution": "We will engineer a modular React 19 single-page application communicating with your existing FastAPI backend, featuring virtualized scrolling and instant client filtering.",
                "deliverables": [
                    "Interactive Figma design system & component specification",
                    "Production-ready React 19 + TypeScript codebase with strict typing",
                    "High-performance virtualized trial dataset grid with Excel/CSV export",
                ],
                "scopeIncluded": [
                    "User journey mapping and high-fidelity prototypes for 6 core screens",
                    "Frontend client-side caching architecture with optimistic mutations",
                    "Two rounds of revisions per milestone",
                ],
                "scopeExcluded": [
                    "Modifications to core Python database microservices",
                    "Ongoing 24/7 server infrastructure operations",
                ],
                "timelineSummary": "6-Week Phased Rollout with bi-weekly staging deployments.",
                "milestones": [
                    {"id": "m1", "title": "Phase 1: Architecture & UX Blueprint", "duration": "Weeks 1–2", "amount": 5500.0, "deliverables": ["Figma Prototype", "Schema Review"]},
                    {"id": "m2", "title": "Phase 2: Core Cohort Grid & SSO Auth", "duration": "Weeks 3–4", "amount": 7500.0, "deliverables": ["Virtual Grid", "SSO Middleware"]},
                    {"id": "m3", "title": "Phase 3: QA & Staging Cutover", "duration": "Weeks 5–6", "amount": 5500.0, "deliverables": ["HIPAA Audit Check", "Production Deploy"]},
                ],
                "clientResponsibilities": [
                    "Provide sandbox API keys and sample pseudonymized datasets",
                    "Provide sign-off within 3 business days of milestone completion",
                ],
                "termsAndConditions": "All intellectual property rights transfer unconditionally upon receipt of final settlement.",
                "callToAction": "To proceed with this timeline and secure our sprint kick-off, please countersign below.",
                "viewCount": 9,
            },
            pricing_json={
                "totalBudget": 18500.0,
                "pricingItems": [
                    {"id": "p1", "description": "UX Audit & High-Density UI Design System", "hoursOrUnits": 35.0, "rate": 120.0, "total": 4200.0},
                    {"id": "p2", "description": "React 19 Virtualized Data Grid & State Management", "hoursOrUnits": 65.0, "rate": 120.0, "total": 7800.0},
                    {"id": "p3", "description": "SSO Auth & RBAC Security Layer", "hoursOrUnits": 25.0, "rate": 120.0, "total": 3000.0},
                    {"id": "p4", "description": "Export Engine & End-to-End QA Testing", "hoursOrUnits": 25.0, "rate": 120.0, "total": 3000.0},
                    {"id": "p5", "description": "Infrastructure Consultation", "hoursOrUnits": 5.0, "rate": 100.0, "total": 500.0},
                ],
                "paymentTerms": "30% upon signing, 40% upon Phase 2 delivery, 30% upon final acceptance. Net 15 via wire or ACH.",
                "pricingNotes": "Fixed price quotation based on agreed scope. Additional requests billed at $120/hr.",
            },
        )

        # Proposal 2: Accepted headless e-commerce store
        p2 = Proposal(
            id="prop-102",
            client_id="cli-002",
            project_title="Headless Shopify Direct-to-Consumer Flagship Store",
            project_brief="Nordic Roast Co. requires a bespoke headless digital flagship using Shopify Storefront API and Next.js.",
            service_category="web_development",
            tone="bold",
            currency="GBP",
            status="accepted",
            content_json={
                "clientName": "Elena Rostova",
                "clientCompany": "Nordic Roast Co.",
                "clientEmail": "elena@nordicroast.com",
                "industry": "E-Commerce & Specialty Retail",
                "deadline": "2026-10-31",
                "executiveSummary": "Nordic Roast Co. requires a bespoke headless digital flagship using Shopify Storefront API to accelerate subscription conversions.",
                "objectives": [
                    "Achieve 95+ Core Web Vitals score across all mobile product views",
                    "Implement custom 3-step coffee subscription box builder with live roast selector",
                ],
                "proposedSolution": "A decoupled headless storefront delivering sub-second product transitions with edge-rendered caching.",
                "deliverables": [
                    "Headless storefront frontend",
                    "Custom subscription box wizard",
                    "Automated Klaviyo abandonment trigger webhooks",
                ],
                "scopeIncluded": ["Responsive theme development", "Shopify Storefront API integration", "Stripe billing sync"],
                "scopeExcluded": ["Product photography", "Paid advertising campaigns"],
                "timelineSummary": "5-Week intensive sprint.",
                "milestones": [
                    {"id": "m1", "title": "Phase 1: Brand System & Wireframes", "duration": "Week 1", "amount": 4200.0, "deliverables": ["Figma Design", "Typography Hierarchy"]},
                    {"id": "m2", "title": "Phase 2: Storefront Engine & Subscription Box", "duration": "Weeks 2–3", "amount": 6000.0, "deliverables": ["Cart Engine", "Shopify API"]},
                    {"id": "m3", "title": "Phase 3: Migration & Production Cutover", "duration": "Weeks 4–5", "amount": 4000.0, "deliverables": ["Speed Audit", "DNS Cutover"]},
                ],
                "clientResponsibilities": ["Provide high-res product photos and Shopify app access"],
                "termsAndConditions": "All custom source code belongs to Nordic Roast Co. upon payment.",
                "callToAction": "Accept this proposal to secure our Q4 sprint reservation.",
                "viewCount": 14,
            },
            pricing_json={
                "totalBudget": 14200.0,
                "pricingItems": [
                    {"id": "p1", "description": "Headless Frontend Engineering", "hoursOrUnits": 60.0, "rate": 110.0, "total": 6600.0},
                    {"id": "p2", "description": "Custom Subscription Builder Logic", "hoursOrUnits": 30.0, "rate": 110.0, "total": 3300.0},
                    {"id": "p3", "description": "Shopify API Integration", "hoursOrUnits": 25.0, "rate": 110.0, "total": 2750.0},
                    {"id": "p4", "description": "DNS Cutover & Optimization", "hoursOrUnits": 15.0, "rate": 100.0, "total": 1550.0},
                ],
                "paymentTerms": "40% advance, 35% on staging demo, 25% on domain cutover.",
                "pricingNotes": "Includes 30 days post-launch hypercare.",
            },
        )

        # Proposal 3: In Review freight logistics console
        p3 = Proposal(
            id="prop-103",
            client_id="cli-003",
            project_title="Fleet Logistics Dispatch Platform & Route Telemetry",
            project_brief="Real-time operational dispatch console for 180 regional freight vehicles with GPS telemetry tracking.",
            service_category="full_stack",
            tone="technical",
            currency="USD",
            status="in_review",
            content_json={
                "clientName": "Devon Hughes",
                "clientCompany": "Krypton Logistics",
                "clientEmail": "devon@kryptonlogistics.net",
                "industry": "Freight & Supply Chain",
                "deadline": "2026-12-15",
                "executiveSummary": "Real-time operational dispatch console for 180 regional freight vehicles to reduce fuel routing variances by 18%.",
                "objectives": [
                    "Centralize live map dispatch with sub-second position pings",
                    "Automate driver rest hour compliance tracking (DOT regulations)",
                ],
                "proposedSolution": "Single-page web console with vector tiles, real-time WebSockets, and virtualized vehicle rosters.",
                "deliverables": [
                    "Interactive vector map with geofencing triggers",
                    "Driver roster console with compliance alerts",
                    "SMS dispatch trigger panel for dispatchers",
                ],
                "scopeIncluded": ["UI/UX dual monitor layouts", "Real-time telemetry pipeline integration"],
                "scopeExcluded": ["In-cab hardware provision", "Native mobile tablet builds"],
                "timelineSummary": "8-Week phased delivery.",
                "milestones": [
                    {"id": "m1", "title": "Phase 1: Architecture & UI Wireframes", "duration": "Weeks 1–2", "amount": 6500.0, "deliverables": ["UX Spec", "Map Engine Proof"]},
                    {"id": "m2", "title": "Phase 2: Live Map & Telemetry Pipeline", "duration": "Weeks 3–4", "amount": 7500.0, "deliverables": ["Vector Map", "WebSocket Client"]},
                    {"id": "m3", "title": "Phase 3: Dispatch Workflow", "duration": "Weeks 5–6", "amount": 7000.0, "deliverables": ["Roster Logic", "SMS Gateway"]},
                    {"id": "m4", "title": "Phase 4: Load Testing & Handover", "duration": "Weeks 7–8", "amount": 5000.0, "deliverables": ["Simulated Load Test", "Documentation"]},
                ],
                "clientResponsibilities": ["Provide test vehicle telemetry stream credentials"],
                "termsAndConditions": "Exclusive enterprise license to Krypton Logistics upon settlement.",
                "callToAction": "Confirm approval to lock in engineering availability.",
                "viewCount": 5,
            },
            pricing_json={
                "totalBudget": 26000.0,
                "pricingItems": [
                    {"id": "p1", "description": "Dispatch Console Architecture", "hoursOrUnits": 45.0, "rate": 130.0, "total": 5850.0},
                    {"id": "p2", "description": "Live Fleet Map Integration", "hoursOrUnits": 65.0, "rate": 130.0, "total": 8450.0},
                    {"id": "p3", "description": "Driver Compliance Engine", "hoursOrUnits": 55.0, "rate": 130.0, "total": 7150.0},
                    {"id": "p4", "description": "Telemetry Testing & Deploy", "hoursOrUnits": 35.0, "rate": 130.0, "total": 4550.0},
                ],
                "paymentTerms": "25% advance, 25% Phase 2, 25% Phase 3, 25% go-live acceptance.",
                "pricingNotes": "Enterprise SLA available upon deployment.",
            },
        )

        # Proposal 4: Sent proposal for AI neural interface
        p4 = Proposal(
            id="prop-104",
            client_id="cli-004",
            project_title="Neural Telemetry WebGL Visualization Studio",
            project_brief="High-frequency 60fps multichannel EEG signal recording and brainwave playback dashboard.",
            service_category="ui_ux_design",
            tone="consultative",
            currency="USD",
            status="sent",
            content_json={
                "clientName": "Dr. Sarah Jenkins",
                "clientCompany": "NeuroPulse Dynamics",
                "clientEmail": "sarah.jenkins@neuropulse.ai",
                "industry": "AI & Neural Interfaces",
                "deadline": "2026-11-30",
                "executiveSummary": "Interactive 3D electrode topography and real-time EEG channel waterfall viewer built for neuroscientists.",
                "objectives": [
                    "Render 64 synchronous EEG channels at 60fps without browser frame drops",
                    "Design scientific dark-mode interface with millisecond time markers",
                ],
                "proposedSolution": "WebGL shader pipeline coupled with React 19 UI controls for signal filtering and artifact removal.",
                "deliverables": [
                    "Figma design system for neurological visualization",
                    "Three.js/WebGL waveform rendering component",
                    "Frequency spectrum FFT analyzer widget",
                ],
                "scopeIncluded": ["Design system & UI engineering", "WebGL signal canvas"],
                "scopeExcluded": ["Raw machine learning model training"],
                "timelineSummary": "4-Week accelerated sprint.",
                "milestones": [
                    {"id": "m1", "title": "Milestone 1: Scientific UI System", "duration": "Weeks 1–2", "amount": 6000.0, "deliverables": ["Figma Library", "Theme Setup"]},
                    {"id": "m2", "title": "Milestone 2: WebGL Waveform Component", "duration": "Weeks 3–4", "amount": 9000.0, "deliverables": ["Shader Pipeline", "Performance Test"]},
                ],
                "clientResponsibilities": ["Provide EDF / BDF sample bio-telemetry file recordings"],
                "termsAndConditions": "Full IP assignment upon completion.",
                "callToAction": "Click Accept to confirm commencement on Monday.",
                "viewCount": 2,
            },
            pricing_json={
                "totalBudget": 15000.0,
                "pricingItems": [
                    {"id": "p1", "description": "Neuro UI & Ergonomics Design", "hoursOrUnits": 40.0, "rate": 125.0, "total": 5000.0},
                    {"id": "p2", "description": "WebGL 60FPS Shader Implementation", "hoursOrUnits": 60.0, "rate": 125.0, "total": 7500.0},
                    {"id": "p3", "description": "Signal Filtering & Controls", "hoursOrUnits": 20.0, "rate": 125.0, "total": 2500.0},
                ],
                "paymentTerms": "50% upfront, 50% upon final sign-off.",
                "pricingNotes": "Subject to 2 rounds of design revisions.",
            },
        )

        # Proposal 5: Draft proposal
        p5 = Proposal(
            id="prop-105",
            client_id="cli-005",
            project_title="Clean Energy ROI Estimator & Customer Portal",
            project_brief="Interactive financial calculator for residential and commercial solar installations.",
            service_category="web_development",
            tone="consultative",
            currency="USD",
            status="draft",
            content_json={
                "clientName": "Carlos Mendez",
                "clientCompany": "Solara Clean Energy",
                "clientEmail": "carlos@solaraenergy.org",
                "industry": "CleanTech & Solar",
                "deadline": "2026-12-01",
                "executiveSummary": "Interactive multi-step quotation calculator enabling prospective solar buyers to estimate 25-year energy savings.",
                "objectives": ["Increase online lead completion rate by 40%"],
                "proposedSolution": "Dynamic step wizard with geo-located sun hours calculation and instant PDF quotation generation.",
                "deliverables": ["Interactive calculator widget", "HubSpot CRM webhook integration"],
                "scopeIncluded": ["Frontend calculator widget", "CRM integration"],
                "scopeExcluded": ["Native iOS/Android apps"],
                "timelineSummary": "3-Week build.",
                "milestones": [
                    {"id": "m1", "title": "Milestone 1: Calculator Engine", "duration": "Weeks 1–2", "amount": 5000.0, "deliverables": ["Formula Engine", "Step Form"]},
                    {"id": "m2", "title": "Milestone 2: CRM & PDF Export", "duration": "Week 3", "amount": 4200.0, "deliverables": ["HubSpot Webhook", "PDF Generator"]},
                ],
                "clientResponsibilities": ["Provide solar irradiance lookup tables and tariff data"],
                "termsAndConditions": "Standard consulting terms apply.",
                "callToAction": "Review draft and send feedback.",
                "viewCount": 1,
            },
            pricing_json={
                "totalBudget": 9200.0,
                "pricingItems": [
                    {"id": "p1", "description": "Solar ROI Mathematical Modeling", "hoursOrUnits": 25.0, "rate": 115.0, "total": 2875.0},
                    {"id": "p2", "description": "Interactive Step Wizard UI", "hoursOrUnits": 35.0, "rate": 115.0, "total": 4025.0},
                    {"id": "p3", "description": "CRM & Email Integration", "hoursOrUnits": 20.0, "rate": 115.0, "total": 2300.0},
                ],
                "paymentTerms": "50% deposit, 50% on delivery.",
                "pricingNotes": "Initial estimate.",
            },
        )

        db.add_all([p1, p2, p3, p4, p5])
        db.commit()
        print(f"[OK] Seeded 5 proposals across statuses (draft, sent, in_review, accepted).")

        print("[INFO] Seeding AI Generation History...")
        h1 = AIGenerationHistory(
            id="gen-001",
            proposal_id="prop-101",
            model_name="llama3.2",
            generation_type="proposal_full",
            duration_ms=4120,
            status="success",
            created_at=datetime.utcnow() - timedelta(days=5),
        )
        h2 = AIGenerationHistory(
            id="gen-002",
            proposal_id="prop-102",
            model_name="llama3.2",
            generation_type="cover_letter",
            duration_ms=2310,
            status="success",
            created_at=datetime.utcnow() - timedelta(days=4),
        )
        h3 = AIGenerationHistory(
            id="gen-003",
            proposal_id="prop-103",
            model_name="deepseek-r1",
            generation_type="proposal_full",
            duration_ms=5890,
            status="success",
            created_at=datetime.utcnow() - timedelta(days=3),
        )
        h4 = AIGenerationHistory(
            id="gen-004",
            proposal_id="prop-104",
            model_name="llama3.2",
            generation_type="follow_up",
            duration_ms=1890,
            status="success",
            created_at=datetime.utcnow() - timedelta(days=1),
        )

        db.add_all([h1, h2, h3, h4])
        db.commit()
        print(f"[OK] Seeded 4 AI generation history records.")

        print("=" * 60)
        print("Database seed completed successfully!")
        print("Total Clients:   ", db.query(Client).count())
        print("Total Proposals: ", db.query(Proposal).count())
        print("AI Generations:  ", db.query(AIGenerationHistory).count())
        print("=" * 60)

    except Exception as exc:
        db.rollback()
        print(f"[ERROR] Seeding failed: {exc}", file=sys.stderr)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed PitchCraft AI database with demo data.")
    parser.add_argument("--clear", action="store_true", help="Clear existing data before seeding")
    args = parser.parse_args()
    seed_database(clear_existing=args.clear)
