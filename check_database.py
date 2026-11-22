from sqlalchemy import text
from database import engine

print("HOST:", engine.url.host)
print("DATABASE:", engine.url.database)

with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT
            current_database() AS database,
            current_schema() AS schema,
            current_setting('search_path') AS search_path,
            to_regclass('project_requests') AS visible_table,
            to_regclass('public.project_requests') AS public_table,
            to_regclass('public.contact_messages') AS contact_table
    """))

    print("\nDATABASE CHECK:")
    for key, value in result.mappings().one().items():
        print(f"{key}: {value}")