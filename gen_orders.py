import random
import datetime
import csv

# Function to generate random dates
def random_date(start, end):
    return start + datetime.timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

# Setting the date range for order_date
start_date = datetime.date(2020, 1, 1)
end_date = datetime.date(2024, 12, 31)

# Generate data
data = []
for i in range(1, 10000):
    order_id = i
    order_date = random_date(start_date, end_date).strftime('%Y-%m-%d')
    product_id = random.randint(2, 10000)
    unitssold = random.randint(1, 100)  # assuming units sold between 1 and 100
    unitprice = round(random.uniform(10.0, 100.0), 2)  # assuming unit price between $10 and $100
    
    data.append([order_id, order_date, product_id, unitssold, unitprice])

# Writing to a CSV file
with open('orders_data.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['order_id', 'order_date', 'product_id', 'unitssold', 'unitprice'])
    writer.writerows(data)

print("Data generation complete. Check the 'orders_data.csv' file.")
