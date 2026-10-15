"""
Tests for Pricing Calculator calculation endpoint.
"""

def test_calculate_pricing(client):
    payload = {
        "hourlyRate": 120.0,
        "hoursByPhase": {
            "discovery": 20.0,
            "design": 30.0,
            "development": 50.0,
            "qa": 15.0,
            "deployment": 5.0,
        },
        "expenses": [
            {"id": "1", "name": "Cloud Staging Host", "amount": 100.0},
            {"id": "2", "name": "Font Licenses", "amount": 200.0},
        ],
        "contingencyPercent": 10.0,
        "marginPercent": 20.0,
    }

    response = client.post("/api/pricing/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Total hours: 20 + 30 + 50 + 15 + 5 = 120
    assert data["total_hours"] == 120.0
    # Base labor: 120 * 120 = 14400.0
    assert data["base_labor_cost"] == 14400.0
    # Expenses: 300.0
    assert data["total_expenses"] == 300.0
    # Subtotal: 14700.0
    assert data["subtotal"] == 14700.0
    # Contingency (10% of 14700): 1470.0
    assert data["contingency_amount"] == 1470.0
    # Subtotal + contingency: 16170.0
    # Margin (20% of 16170): 3234.0
    assert data["margin_amount"] == 3234.0
    # Grand Total: 16170 + 3234 = 19404.0
    assert data["grand_total"] == 19404.0

    # Milestone split check
    assert "deposit" in data["milestone_split"]
    assert "midway" in data["milestone_split"]
    assert "final" in data["milestone_split"]
    total_split = (
        data["milestone_split"]["deposit"]
        + data["milestone_split"]["midway"]
        + data["milestone_split"]["final"]
    )
    assert round(total_split, 2) == round(data["grand_total"], 2)
