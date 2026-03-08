import sqlite3
from pathlib import Path
import textwrap


def main() -> None:
    path = Path("finance_app.db")
    print(f"Path: {path.resolve()}")
    print(f"Exists: {path.exists()}")
    if not path.exists():
        return

    print(f"Size: {path.stat().st_size} bytes\n")

    conn = sqlite3.connect(path)
    try:
        cur = conn.cursor()
        print("-- .schema output --")
        cur.execute(
            "SELECT sql FROM sqlite_master "
            "WHERE type IN ('table','index','trigger','view') "
            "AND sql NOT NULL ORDER BY type, name;"
        )
        rows = cur.fetchall()
        for (sql,) in rows:
            print(textwrap.dedent(sql).strip())
            print()
    finally:
        conn.close()


if __name__ == "__main__":
    main()

