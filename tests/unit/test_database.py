"""
Unit tests for database utilities.
"""

from unittest.mock import MagicMock, Mock, patch

import pandas as pd
import pytest

from app.database import execute_query, execute_query_df, get_db_connection


class TestDatabaseConnection:
    """Tests for database connection functionality."""

    @patch("app.database.duckdb.connect")
    def test_get_db_connection_read_only(self, mock_connect: Mock) -> None:
        """Test getting a read-only database connection."""
        get_db_connection(read_only=True)
        mock_connect.assert_called_once()
        args = mock_connect.call_args
        assert args[1]["read_only"] is True

    @patch("app.database.duckdb.connect")
    def test_get_db_connection_read_write(self, mock_connect: Mock) -> None:
        """Test getting a read-write database connection."""
        get_db_connection(read_only=False)
        mock_connect.assert_called_once()
        args = mock_connect.call_args
        assert args[1]["read_only"] is False


class TestExecuteQuery:
    """Tests for execute_query function."""

    @patch("app.database.get_db_connection")
    def test_execute_query_without_params(self, mock_get_conn: Mock) -> None:
        """Test executing a query without parameters."""
        mock_conn = MagicMock()
        mock_conn.execute.return_value.fetchall.return_value = [("result1",), ("result2",)]
        mock_get_conn.return_value = mock_conn

        result = execute_query("SELECT * FROM test")

        assert result == [("result1",), ("result2",)]
        mock_conn.execute.assert_called_once_with("SELECT * FROM test")
        mock_conn.close.assert_called_once()

    @patch("app.database.get_db_connection")
    def test_execute_query_with_params(self, mock_get_conn: Mock) -> None:
        """Test executing a query with parameters."""
        mock_conn = MagicMock()
        mock_conn.execute.return_value.fetchall.return_value = [("result",)]
        mock_get_conn.return_value = mock_conn

        result = execute_query("SELECT * FROM test WHERE id = ?", ["123"])

        assert result == [("result",)]
        mock_conn.execute.assert_called_once_with("SELECT * FROM test WHERE id = ?", ["123"])
        mock_conn.close.assert_called_once()

    @patch("app.database.get_db_connection")
    def test_execute_query_closes_connection_on_error(self, mock_get_conn: Mock) -> None:
        """Test that connection is closed even when query fails."""
        mock_conn = MagicMock()
        mock_conn.execute.side_effect = Exception("Query error")
        mock_get_conn.return_value = mock_conn

        with pytest.raises(Exception, match="Query error"):
            execute_query("INVALID SQL")

        mock_conn.close.assert_called_once()


class TestExecuteQueryDf:
    """Tests for execute_query_df function."""

    @patch("app.database.get_db_connection")
    def test_execute_query_df_returns_dataframe(self, mock_get_conn: Mock) -> None:
        """Test that execute_query_df returns a pandas DataFrame."""
        mock_conn = MagicMock()
        expected_df = pd.DataFrame({"col1": [1, 2], "col2": ["a", "b"]})
        mock_conn.execute.return_value.df.return_value = expected_df
        mock_get_conn.return_value = mock_conn

        result = execute_query_df("SELECT * FROM test")

        assert isinstance(result, pd.DataFrame)
        pd.testing.assert_frame_equal(result, expected_df)
        mock_conn.close.assert_called_once()

    @patch("app.database.get_db_connection")
    def test_execute_query_df_with_params(self, mock_get_conn: Mock) -> None:
        """Test execute_query_df with query parameters."""
        mock_conn = MagicMock()
        expected_df = pd.DataFrame({"id": [123]})
        mock_conn.execute.return_value.df.return_value = expected_df
        mock_get_conn.return_value = mock_conn

        result = execute_query_df("SELECT * FROM test WHERE id = ?", ["123"])

        assert isinstance(result, pd.DataFrame)
        mock_conn.execute.assert_called_once_with("SELECT * FROM test WHERE id = ?", ["123"])
        mock_conn.close.assert_called_once()
