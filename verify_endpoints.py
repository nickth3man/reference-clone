import sys

import requests  # type: ignore[import]

BASE_URL = "http://localhost:8001"
HTTP_OK = 200


def test_endpoint(endpoint: str, description: str):
    url = f"{BASE_URL}{endpoint}"
    print(f"Testing {description} ({url})...", end=" ")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == HTTP_OK:
            print("✅ OK")
            return response.json()

        print(f"❌ Failed (Status: {response.status_code})")
        print(response.text)
        return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection Refused (Is the backend running?)")
        return None


def main():
    print("Starting API Verification...")

    # 1. Test Teams
    teams = test_endpoint("/teams", "Teams List")
    if not teams:
        sys.exit(1)
    print(f"   Found {len(teams)} teams.")

    # 2. Test Players (limit 10)
    players = test_endpoint("/players?limit=10", "Players List")
    if not players:
        sys.exit(1)
    print(f"   Found {len(players)} players.")

    # 3. Test Games (limit 5)
    games = test_endpoint("/games?limit=5", "Games List")
    if not games:
        sys.exit(1)
    print(f"   Found {len(games)} games.")

    if games:
        game_id = games[0]["game_id"]

        # 4. Test Single Game
        # We assign to _ to avoid unused variable warning, or just call it.
        _ = test_endpoint(f"/games/{game_id}", f"Single Game ({game_id})")

        # 5. Test Game Stats
        stats = test_endpoint(f"/games/{game_id}/stats", f"Game Stats ({game_id})")
        if stats:
            print("   Stats keys:", list(stats.keys())[:5], "...")

    print("\nVerification Complete.")


if __name__ == "__main__":
    main()
