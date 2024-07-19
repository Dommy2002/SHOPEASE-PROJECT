import psycopg2
from faker import Faker
import random

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="sales_data",
    user="postgres",
    password="Postgresql@22",
    port="5434"
)

# Create a cursor object using the connection
cur = conn.cursor()

# Drop product table if it exists
try:
    cur.execute("DROP TABLE IF EXISTS product")
    conn.commit()
    print("Product table dropped successfully.")

except psycopg2.Error as e:
    print(f"Error dropping product table: {e}")
    conn.rollback()  # Rollback changes if an error occurs

# Create product table
try:
    cur.execute("""
        CREATE TABLE product (
            product_id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL
        )
    """)
    conn.commit()
    print("Product table created successfully.")

except psycopg2.Error as e:
    print(f"Error creating product table: {e}")
    conn.rollback()  # Rollback changes if an error occurs

# Generate and insert product names by category
try:
    fake = Faker()

    product_categories = ["cars", "cups", "dresses", "toys", "accessories", "utensils", "guns"]
    num_products = 10000

    for _ in range(num_products):
        category = random.choice(product_categories)
        product_name = fake.word() + " " + category  # Generate a realistic product name with a category suffix
        
        cur.execute("INSERT INTO product (product_name) VALUES (%s)", (product_name,))
    
    conn.commit()  # Commit the transaction
    print(f"{num_products} product names inserted successfully.")

except psycopg2.Error as e:
    print(f"Error inserting product names: {e}")
    conn.rollback()  # Rollback changes if an error occurs

finally:
    # Close cursor and connection
    cur.close()
    conn.close()
