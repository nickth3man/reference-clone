# Data Notes

## Player Tables Discrepancy

We observed a discrepancy between the `player` table and the `common_player_info` table:

- **`player` Table**: Contains ~5100 rows. Appears to be the master list of all players, including
  basic information (`id`, `full_name`, `is_active`).
- **`common_player_info` Table**: Contains ~3600 rows. Contains detailed information (`height`,
  `weight`, `birthdate`, `school`, etc.).

**Key Finding:** Some prominent players, such as **LeBron James (ID 2544)**, are present in the
`player` table but **missing** from `common_player_info`. Other legends like Michael Jordan and
active stars like Stephen Curry are present in both.

**Implication:** The application uses a fallback mechanism:

1.  Try to fetch detailed info from `common_player_info`.
2.  If not found, fall back to basic info from the `player` table.
3.  This ensures all players are accessible, even if some details are missing.
