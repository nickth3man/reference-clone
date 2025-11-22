from app.database import execute_query_df


def check_players() -> None:
    try:
        print("Curry in common_player_info:")
        print(
            execute_query_df(
                "SELECT person_id, display_first_last FROM common_player_info "
                "WHERE display_first_last LIKE '%Curry%'",
                read_only=True,
            )
        )
        print("\nJordan in common_player_info:")
        print(
            execute_query_df(
                "SELECT person_id, display_first_last FROM common_player_info "
                "WHERE display_first_last LIKE '%Jordan%'",
                read_only=True,
            )
        )
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Error: {e}")


if __name__ == "__main__":
    check_players()
