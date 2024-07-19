-- Add last_updated column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='orders' AND column_name='last_updated'
    ) THEN
        ALTER TABLE orders ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END
$$;

-- Create or replace the stored procedure to calculate sum total sales
CREATE OR REPLACE PROCEDURE calculate_sum_total_sales()
LANGUAGE plpgsql
AS $$
DECLARE
    total_sales NUMERIC;
BEGIN
    -- Calculate the sum of (unitssold * unitprice) from all orders
    SELECT SUM(unitssold * unitprice) INTO total_sales
    FROM orders;
    
    -- Output the total sales
    RAISE NOTICE 'Sum Total Sales: %', total_sales;
END;
$$;
