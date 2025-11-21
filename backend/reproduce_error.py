from database import execute_query_df
from models import Team
import pandas as pd

def reproduce():
    query = "SELECT * FROM team_details"
    try:
        df = execute_query_df(query, read_only=True)
        df = df.where(df.notnull(), None)
        records = df.to_dict(orient="records")
        
        print(f"Found {len(records)} records.")
        
        for i, record in enumerate(records):
            try:
                Team(**record)
            except Exception as e:
                print(f"Error at record {i}: {record}")
                print(f"Error details: {e}")
                break
        else:
            print("All records validated successfully!")
            
    except Exception as e:
        print(f"Global Error: {e}")

if __name__ == "__main__":
    reproduce()
