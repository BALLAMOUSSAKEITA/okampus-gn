"""Tests pour /health."""


class TestHealth:
    async def test_health_check(self, client):
        resp = await client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] in ("ok", "degraded")
        assert "version" in data
        assert "database" in data
        assert "openai" in data
        assert "uptime_seconds" in data
        assert isinstance(data["uptime_seconds"], int)

    async def test_health_version(self, client):
        resp = await client.get("/health")
        assert resp.json()["version"] == "1.0.0"

    async def test_health_has_openai_status(self, client):
        resp = await client.get("/health")
        assert resp.json()["openai"] in ("configured", "not configured")
