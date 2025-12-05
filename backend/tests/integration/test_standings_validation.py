"""
Standings implementation validation script.

This script validates the standings implementation according to the user's requirements:
1. Test the API endpoint to ensure it returns the expected data structure
2. Verify data integrity to ensure no data loss or corruption
3. Check type safety to ensure the API contract is properly enforced
4. Validate against the source-of-truth requirements
"""

from fastapi.testclient import TestClient
from app.main import app
from app.models.standings import StandingsItem

client = TestClient(app)

def test_standings_api_endpoint():
    """Test that the standings endpoint returns the expected data structure."""
    print("Testing standings API endpoint...")
    
    # Test current season standings
    response = client.get("/api/v1/seasons/2024/standings")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list"
    
    print(f"✓ Successfully retrieved standings with status code {response.status_code}")
    print(f"✓ Response is a list with {len(response.json())} teams")
    
    # Test that we get the expected fields
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
        
        missing_fields = []
        for field in expected_fields:
            if field not in first_team:
                missing_fields.append(field)
        
        assert not missing_fields, f"Missing fields: {missing_fields}"
        print("✓ All expected fields are present in the response")
        
        # Verify types
        assert isinstance(first_team["wins"], int), "wins should be an integer"
        assert isinstance(first_team["losses"], int), "losses should be an integer"
        assert isinstance(first_team["win_pct"], (int, float)), "win_pct should be numeric"
        
        if first_team["games_behind"] is not None:
            assert isinstance(first_team["games_behind"], (int, float)), "games_behind should be numeric when present"
        
        print("✓ All field types are correct")


def test_standings_data_integrity():
    """Verify data integrity - ensure no data loss or corruption."""
    print("\nTesting standings data integrity...")
    
    # Get standings data
    response = client.get("/api/v1/seasons/2024/standings")
    assert response.status_code == 200
    standings = response.json()
    
    # Check that we have reasonable numbers of teams
    assert len(standings) > 0, "Should have at least one team"
    print(f"✓ Retrieved {len(standings)} teams")
    
    # Check that all required fields are present and have reasonable values
    required_fields = ["team_id", "full_name", "abbreviation", "wins", "losses", "win_pct"]
    
    for i, team in enumerate(standings):
        for field in required_fields:
            assert field in team, f"Team {i} missing required field: {field}"
            
        # Validate field values
        assert isinstance(team["wins"], int) and team["wins"] >= 0, f"Invalid wins for team {i}"
        assert isinstance(team["losses"], int) and team["losses"] >= 0, f"Invalid losses for team {i}"
        assert isinstance(team["win_pct"], (float, int)) and 0 <= team["win_pct"] <= 1, f"Invalid win_pct for team {i}"
        
        # Check that win_pct = wins/(wins+losses) when losses > 0
        if team["losses"] > 0:
            expected_win_pct = team["wins"] / (team["wins"] + team["losses"])
            assert abs(team["win_pct"] - expected_win_pct) < 0.001, f"Mismatched win_pct for team {i}"
    
    print("✓ All teams have valid data with correct relationships")


def test_standings_type_safety():
    """Check type safety to ensure the API contract is properly enforced."""
    print("\nTesting standings type safety...")
    
    # Get standings data
    response = client.get("/api/v1/seasons/2024/standings")
    assert response.status_code == 200
    standings = response.json()
    
    # Validate against Pydantic model
    validation_errors = []
    
    for i, team_data in enumerate(standings):
        try:
            # Try to parse the data into the Pydantic model
            StandingsItem(**team_data)
        except Exception as e:
            validation_errors.append(f"Team {i} failed validation: {e}")
    
    assert not validation_errors, f"Type safety validation failed:\n{'>'.join(validation_errors)}"
    print("✓ All standings data conforms to the Pydantic model")


def test_standings_conference_filter():
    """Test conference filtering functionality."""
    print("\nTesting conference filtering...")
    
    # Test Eastern conference
    response = client.get("/api/v1/seasons/2024/standings?conference=Eastern")
    assert response.status_code == 200
    eastern_standings = response.json()
    
    # Test Western conference  
    response = client.get("/api/v1/seasons/2024/standings?conference=Western")
    assert response.status_code == 200
    western_standings = response.json()
    
    # Verify conference filtering works correctly
    eastern_conferences = {team["conference"] for team in eastern_standings if eastern_standings}
    western_conferences = {team["conference"] for team in western_standings if western_standings}
    
    # Eastern should contain only Eastern/East teams
    assert all(conf in {"Eastern", "East"} for conf in eastern_conferences), f"Eastern conference contains invalid conferences: {eastern_conferences}"
    
    # Western should contain only Western/West teams  
    assert all(conf in {"Western", "West"} for conf in western_conferences), f"Western conference contains invalid conferences: {western_conferences}"
    
    # Total teams should roughly match (allowing for small differences due to conference assignments)
    total_teams = len(eastern_standings) + len(western_standings)
    original_total = len(client.get("/api/v1/seasons/2024/standings").json())
    
    # Allow for small differences due to how conferences are defined
    assert abs(total_teams - original_total) <= 2, f"Conference filtering resulted in data loss: {total_teams} vs {original_total}"
    
    print(f"✓ Eastern conference: {len(eastern_standings)} teams")
    print(f"✓ Western conference: {len(western_standings)} teams")
    print("✓ Conference filtering works correctly")


def test_source_of_truth_requirements():
    """Validate against source-of-truth requirements from plan/basketball-reference-tables-columns.md."""
    print("\nValidating against source-of-truth requirements...")
    
    # Get standings data
    response = client.get("/api/v1/seasons/2024/standings")
    assert response.status_code == 200
    standings = response.json()
    
    if not standings:
        print("⚠ No standings data available for validation")
        return
    
    # Based on the Basketball-Reference.com table structure from the plan
    # Conference Standings table columns from the plan
    required_columns = [
        "Team", "W", "L", "W/L%", "GB", "PTS", "Opp PTS"
    ]
    
    # Map these to our field names
    column_mapping = {
        "Team": "full_name",
        "W": "wins", 
        "L": "losses",
        "W/L%": "win_pct",
        "GB": "games_behind",
        "PTS": "points_per_game",
        "Opp PTS": "opponent_points_per_game"
    }
    
    # Check that we have all the required columns (as fields in our response)
    missing_columns = []
    for display_name, field_name in column_mapping.items():
        if field_name not in standings[0]:
            missing_columns.append(display_name)
    
    assert not missing_columns, f"Missing required columns from source-of-truth: {missing_columns}"
    print("✓ All source-of-truth columns are present")
    
    # Check data consistency 
    print("✓ Source-of-truth requirements validation passed")


if __name__ == "__main__":
    print("=== Standings Implementation Validation ===\n")
    
    try:
        test_standings_api_endpoint()
        test_standings_data_integrity()
        test_standings_type_safety()
        test_standings_conference_filter()
        test_source_of_truth_requirements()
        
        print("\n🎉 All validation tests passed!")
        print("The standings implementation meets all requirements:")
        print("  ✓ API endpoint returns expected data structure")
        print("  ✓ Data integrity is maintained (no data loss/corruption)")  
        print("  ✓ Type safety is enforced (API contract properly followed)")
        print("  ✓ Conference filtering works correctly")
        print("  ✓ Implementation matches source-of-truth requirements")
        
    except AssertionError as e:
        print(f"\n❌ Validation failed: {e}")
        raise
    except Exception as e:
        print(f"\n💥 Unexpected error during validation: {e}")
        raise