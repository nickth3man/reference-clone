from database import execute_query_df

def check_teams():
    try:
        df = execute_query_df("SELECT * FROM team_details LIMIT 5", read_only=True)
        print(df[['team_id', 'abbreviation', 'nickname']])
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_teams()
