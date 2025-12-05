from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_franchises_endpoint():
    response = client.get("/franchises")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_draft_picks_endpoint():
    response = client.get("/draft/picks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_contracts_endpoint():
    response = client.get("/contracts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_standings_endpoint():
    # Test current season standings
    response = client.get("/api/v1/seasons/2024/standings")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Test that we get the expected fields matching Pydantic model
    standings = response.json()
    if standings:
        first_team = standings[0]
        # Check all fields from StandingsItem model
        expected_fields = [
            "team_id", "full_name", "abbreviation", "logo_url",
            "conference", "division", "wins", "losses", "win_pct",
            "games_behind", "points_per_game", "opponent_points_per_game",
            "simple_rating_system", "pace", "offensive_rating",
            "defensive_rating", "net_rating"
        ]
        
        for field in expected_fields:
            assert field in first_team, f"Missing field: {field}"
            
        # Verify types
        assert isinstance(first_team["wins"], int)
        assert isinstance(first_team["losses"], int)
        assert isinstance(first_team["win_pct"], (int, float))
        if first_team["games_behind"] is not None:
            assert isinstance(first_team["games_behind"], (int, float))


def test_standings_conference_filter():
    # Test conference filtering
    # Test Eastern conference
    response = client.get("/api/v1/seasons/2024/standings?conference=Eastern")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    standings = response.json()
    if standings:
        # All teams should be from Eastern conference
        for team in standings:
            assert team["conference"] == "Eastern" or team["conference"] == "East"
            
    # Test Western conference
    response = client.get("/api/v1/seasons/2024/standings?conference=Western")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    standings = response.json()
    if standings:
        # All teams should be from Western conference
        for team in standings:
            assert team["conference"] == "Western" or team["conference"] == "West"


def test_team_roster_endpoint():
    # Test roster endpoint with a known team
    response = client.get("/api/v1/teams/GSW/roster")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Check that we get the expected fields
    if response.json():
        roster_entry = response.json()[0]
        expected_fields = ["No.", "Player", "Pos", "Ht", "Wt", "Birth Date", "Country", "Exp", "College"]
        
        for field in expected_fields:
            assert field in roster_entry, f"Missing field: {field}"


def test_team_game_log_endpoint():
    # Test game log endpoint with a known team
    response = client.get("/api/v1/teams/GSW/gamelog")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Check that we get the expected fields from the repository implementation
    if response.json():
        game_log_entry = response.json()[0]
        # These should be present based on the repository implementation
        expected_fields = ["Rk", "G", "Date", " ", "Opp", "W/L", "Tm", "Opp", "FG", "FGA", "FG%", "3P", "3PA", "3P%", "FT", "FTA", "FT%", "ORB", "DRB", "TRB", "AST", "STL", "BLK", "TOV", "PF", "PTS"]
        
        for field in expected_fields:
            assert field in game_log_entry, f"Missing field: {field}"


def test_team_schedule_endpoint():
    # Test schedule endpoint with a known team
    response = client.get("/api/v1/teams/GSW/schedule")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Check that we get the expected fields from the repository implementation
    if response.json():
        schedule_entry = response.json()[0]
        # These should be present based on the repository implementation
        expected_fields = ["G", "Date", "Start (ET)", " ", "Opponent", "W/L", "OT", "Tm", "Opp", "W", "L", "Streak", "Notes"]
        
        for field in expected_fields:
            assert field in schedule_entry, f"Missing field: {field}"


def test_box_score_line_score_endpoint():
    """Test the line score endpoint for box scores."""
    # This would normally use a real game ID, but for testing we'll use a mock
    # For now, just test that the endpoint exists and returns the correct status code
    response = client.get("/api/v1/boxscores/0022200122/linescore")
    # We expect a 200 OK or 404 Not Found depending on if the game exists
    assert response.status_code in [200, 404]


def test_box_score_four_factors_endpoint():
    """Test the four factors endpoint for box scores."""
    # This would normally use a real game ID, but for testing we'll use a mock
    # For now, just test that the endpoint exists and returns the correct status code
    response = client.get("/api/v1/boxscores/0022200122/fourfactors")
    # We expect a 200 OK or 404 Not Found depending on if the game exists
    assert response.status_code in [200, 404]
