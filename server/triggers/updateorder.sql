-- Create or replace the trigger function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger to call update_last_updated before update on orders
CREATE TRIGGER trg_update_last_updated
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_last_updated();