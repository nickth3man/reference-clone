from app.core.database import execute_query, execute_query_df


def create_contracts_table() -> None:
    """Create the contracts table if it doesn't exist."""
    create_sequence_sql = "CREATE SEQUENCE IF NOT EXISTS contracts_id_seq;"
    execute_query(create_sequence_sql, read_only=False)

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS contracts (
        contract_id INTEGER PRIMARY KEY DEFAULT nextval('contracts_id_seq'),
        player_id VARCHAR,
        team_id VARCHAR,
        contract_type VARCHAR,
        signing_date DATE,
        total_value DOUBLE,
        years INTEGER,
        year_1_salary DOUBLE,
        year_2_salary DOUBLE,
        year_3_salary DOUBLE,
        year_4_salary DOUBLE,
        year_5_salary DOUBLE,
        year_6_salary DOUBLE,
        guaranteed_money DOUBLE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    execute_query(create_table_sql, read_only=False)
    print("Contracts table created (if not exists).")


def load_sample_contracts() -> None:
    """Load some sample contract data for testing."""
    # Check if contracts exist
    df = execute_query_df("SELECT count(*) as count FROM contracts")
    if df.iloc[0]["count"] > 0:
        print("Contracts already populated.")
        return

    # Sample Data (Trae Young, etc.)
    contracts_data = [
        (
            "youngtr01",
            "ATL",
            "Extension",
            "2021-08-06",
            215159700,
            5,
            37096500,
            40064220,
            43031940,
            45999660,
            48967380,
            None,
            215159700,
            True,
        ),
        (
            "curryst01",
            "GSW",
            "Extension",
            "2021-08-03",
            215353664,
            4,
            48070014,
            51915615,
            55761216,
            59606817,
            None,
            None,
            215353664,
            True,
        ),
    ]

    insert_sql = """
    INSERT INTO contracts (
        player_id, team_id, contract_type, signing_date, total_value, years,
        year_1_salary, year_2_salary, year_3_salary, year_4_salary, year_5_salary, year_6_salary,
        guaranteed_money, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    for contract in contracts_data:
        execute_query(insert_sql, list(contract), read_only=False)

    print(f"Loaded {len(contracts_data)} sample contracts.")


if __name__ == "__main__":
    create_contracts_table()
    load_sample_contracts()
