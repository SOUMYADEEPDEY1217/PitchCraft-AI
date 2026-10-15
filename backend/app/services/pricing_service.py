"""
Pricing and quotation calculation service.
"""

from app.schemas.pricing import (
    PricingCalculateRequest,
    PricingCalculateResponse,
    MilestoneSplit,
)


class PricingService:
    @staticmethod
    def calculate(request: PricingCalculateRequest) -> PricingCalculateResponse:
        total_hours = (
            request.hours_by_phase.discovery
            + request.hours_by_phase.design
            + request.hours_by_phase.development
            + request.hours_by_phase.qa
            + request.hours_by_phase.deployment
        )
        base_labor_cost = total_hours * request.hourly_rate
        total_expenses = sum(item.amount for item in request.expenses)
        subtotal = base_labor_cost + total_expenses

        contingency_amount = round(subtotal * (request.contingency_percent / 100.0), 2)
        subtotal_with_contingency = subtotal + contingency_amount
        margin_amount = round(subtotal_with_contingency * (request.margin_percent / 100.0), 2)
        grand_total = round(subtotal_with_contingency + margin_amount, 2)

        effective_rate = round(grand_total / total_hours, 2) if total_hours > 0 else request.hourly_rate

        deposit = round(grand_total * 0.40, 2)
        midway = round(grand_total * 0.35, 2)
        final = round(grand_total - deposit - midway, 2)

        return PricingCalculateResponse(
            total_hours=round(total_hours, 1),
            base_labor_cost=round(base_labor_cost, 2),
            total_expenses=round(total_expenses, 2),
            subtotal=round(subtotal, 2),
            contingency_amount=contingency_amount,
            margin_amount=margin_amount,
            grand_total=grand_total,
            effective_rate_per_hour=effective_rate,
            milestone_split=MilestoneSplit(
                deposit=deposit,
                midway=midway,
                final=final,
            ),
        )


pricing_service = PricingService()
