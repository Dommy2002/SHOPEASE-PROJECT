import psycopg2
import random
from datetime import datetime, timedelta

def generate_random_data():
    """Generate random data for the required fields."""
    def random_date(start_date, end_date):
        return start_date + timedelta(days=random.randint(0, (end_date - start_date).days))

    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 12, 31)
    
    return {
        'order_date': random_date(start_date, end_date).strftime('%Y-%m-%d'),
        'unitssold': random.randint(1, 100),
        'unitprice': round(random.uniform(10.0, 500.0), 2)
    }

def update_table():
    conn = None
    cursor = None
    try:
        # Connect to your PostgreSQL DB
        conn = psycopg2.connect(
            dbname='sales_data', 
            user='postgres', 
            host='localhost', 
            password='Postgresql@22',
            port='5434'
        )
        
        # Create a cursor object
        cursor = conn.cursor()

        # 1. Delete rows where product_id is 1515
        delete_query = """
        DELETE FROM orders
        WHERE product_id = 1515;
        """
        cursor.execute(delete_query)
        print("Deleted rows where product_id is 1515.")

        # 2. Insert new rows with product_id values starting from 2 to 10,002, skipping 300
        new_product_ids = list(range(2, 300)) + list(range(301, 10003))
        current_max_order_id_query = "SELECT COALESCE(MAX(order_id), 0) FROM orders;"
        cursor.execute(current_max_order_id_query)
        current_max_order_id = cursor.fetchone()[0]

        insert_query = """
        INSERT INTO orders (order_id, order_date, product_id, unitssold, unitprice)
        VALUES (%s, %s, %s, %s, %s);
        """
        
        start_index = 0
        batch_size = 1000  # Number of rows to insert per batch for performance

        while start_index < len(new_product_ids):
            for i in range(start_index, min(start_index + batch_size, len(new_product_ids))):
                product_id = new_product_ids[i]
                current_max_order_id += 1
                data = generate_random_data()
                cursor.execute(insert_query, (
                    current_max_order_id,
                    data['order_date'],
                    product_id,
                    data['unitssold'],
                    data['unitprice']
                ))
            start_index += batch_size
        
        print("Inserted new rows with product_id values from 2 to 10,002, skipping 300.")

        # Commit changes
        conn.commit()
    
    except Exception as e:
        if conn is not None:
            conn.rollback()  # Rollback the transaction on error
        print(f"Error performing operations: {e}")
    
    finally:
        if cursor is not None:
            cursor.close()  # Close the cursor
        if conn is not None:
            conn.close()  # Close the connection

# Update the table with data
update_table()
