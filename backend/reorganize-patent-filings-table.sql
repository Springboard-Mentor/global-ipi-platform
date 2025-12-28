-- Recreate patent_filings table with proper column order matching form sequence
-- Backup existing data first
CREATE TABLE IF NOT EXISTS patent_filings_backup AS SELECT * FROM patent_filings;

-- Drop and recreate with correct column order
DROP TABLE IF EXISTS patent_filings CASCADE;

CREATE TABLE patent_filings (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- STEP 1: User Information
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    
    -- STEP 2: Applicant Information  
    applicant_type VARCHAR(50) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    organization_name VARCHAR(255),
    applicant_address TEXT NOT NULL,
    applicant_city VARCHAR(100) NOT NULL,
    applicant_state VARCHAR(100) NOT NULL,
    applicant_pincode VARCHAR(10) NOT NULL,
    applicant_country VARCHAR(100) NOT NULL,
    
    -- STEP 3: Invention Details
    invention_title VARCHAR(500) NOT NULL,
    invention_field VARCHAR(255) NOT NULL,
    invention_description TEXT NOT NULL,
    technical_problem TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    advantages TEXT NOT NULL,
    prior_art TEXT,
    
    -- STEP 4: Patent Details
    patent_type VARCHAR(50) NOT NULL,
    filing_type VARCHAR(50) NOT NULL,
    number_of_claims INTEGER NOT NULL,
    number_of_drawings INTEGER,
    priority_date DATE,
    priority_number VARCHAR(100),
    claims_priority BOOLEAN,
    
    -- STEP 5: Documents (Cloud URLs)
    description_file_url TEXT NOT NULL,
    claims_file_url TEXT NOT NULL,
    abstract_file_url TEXT NOT NULL,
    drawings_file_url TEXT,
    
    -- Payment Information
    payment_amount NUMERIC(10,2) NOT NULL,
    payment_currency VARCHAR(3),
    payment_id VARCHAR(255) NOT NULL,
    payment_order_id VARCHAR(255),
    payment_signature VARCHAR(255),
    payment_status VARCHAR(50) NOT NULL,
    payment_timestamp TIMESTAMP,
    
    -- Status & Timestamps
    status VARCHAR(50),
    filing_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Restore data if backup exists
INSERT INTO patent_filings 
SELECT * FROM patent_filings_backup WHERE EXISTS (SELECT 1 FROM patent_filings_backup LIMIT 1);

-- Drop backup table
DROP TABLE IF EXISTS patent_filings_backup;

-- Create indexes
CREATE INDEX idx_patent_filings_user_id ON patent_filings(user_id);
CREATE INDEX idx_patent_filings_status ON patent_filings(status);
CREATE INDEX idx_patent_filings_payment_status ON patent_filings(payment_status);
CREATE INDEX idx_patent_filings_created_at ON patent_filings(created_at);

SELECT 'Patent filings table recreated with proper column order!' AS status;
