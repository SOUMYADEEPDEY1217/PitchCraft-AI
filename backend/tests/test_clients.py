"""
Tests for Clients CRM API endpoints.
"""

def test_list_clients(client, sample_client):
    response = client.get("/api/clients")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["id"] == sample_client.id
    assert data[0]["name"] == sample_client.name


def test_create_client(client):
    payload = {
        "name": "Jordan Lee",
        "company": "Horizon Media",
        "email": "jordan@horizonmedia.com",
        "phone": "+1 555-9876",
        "website": "https://horizonmedia.com",
        "industry": "Media & Creative",
        "status": "lead",
        "notes": "Interested in redesign proposal",
    }
    response = client.post("/api/clients", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert data["id"].startswith("cli-")


def test_create_duplicate_client_email(client, sample_client):
    payload = {
        "name": "Duplicate Person",
        "company": "Another Co",
        "email": sample_client.email,
    }
    response = client.post("/api/clients", json=payload)
    assert response.status_code == 409
    data = response.json()
    assert data["success"] is False
    assert "already exists" in data["error"]["message"]


def test_get_client_by_id(client, sample_client):
    response = client.get(f"/api/clients/{sample_client.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_client.id
    assert data["company"] == sample_client.company


def test_get_nonexistent_client(client):
    response = client.get("/api/clients/cli-nonexistent")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False


def test_update_client(client, sample_client):
    update_payload = {
        "company": "Smith Global Ventures",
        "status": "active",
        "notes": "Upgraded relationship to active",
    }
    response = client.put(f"/api/clients/{sample_client.id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["company"] == "Smith Global Ventures"
    assert data["status"] == "active"


def test_delete_client(client, sample_client):
    response = client.delete(f"/api/clients/{sample_client.id}")
    assert response.status_code == 204

    # Verify client is deleted
    get_res = client.get(f"/api/clients/{sample_client.id}")
    assert get_res.status_code == 404


def test_safe_delete_client_blocked_with_proposals(client, sample_client, sample_proposal):
    # Deleting without force=true should be blocked with 409 Conflict
    response = client.delete(f"/api/clients/{sample_client.id}")
    assert response.status_code == 409
    data = response.json()
    assert data["success"] is False
    assert "proposal(s) are linked" in data["error"]["message"]

    # Deleting with force=true should succeed
    force_response = client.delete(f"/api/clients/{sample_client.id}?force=true")
    assert force_response.status_code == 204

    # Verify both client and linked proposals are cleanly cleaned up
    get_client = client.get(f"/api/clients/{sample_client.id}")
    assert get_client.status_code == 404

