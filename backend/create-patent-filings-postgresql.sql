-- Create Patent Filings Table in PostgreSQL
-- Database: my_project_db

CREATE TABLE IF NOT EXISTS patent_filings (
    id BIGSERIAL PRIMARY KEY,
    
    -- User Information
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    
    -- Applicant Information
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_address TEXT NOT NULL,
    applicant_city VARCHAR(100) NOT NULL,
    applicant_state VARCHAR(100) NOT NULL,
    applicant_pincode VARCHAR(10) NOT NULL,
    applicant_country VARCHAR(100) NOT NULL,
    organization_name VARCHAR(255),
    applicant_type VARCHAR(50) NOT NULL,
    
    -- Invention Details
    invention_title VARCHAR(500) NOT NULL,
    invention_field VARCHAR(255) NOT NULL,
    invention_description TEXT NOT NULL,
    technical_problem TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    advantages TEXT NOT NULL,
    prior_art TEXT,
    
    -- Patent Details
    patent_type VARCHAR(50) NOT NULL,
    filing_type VARCHAR(50) NOT NULL,
    priority_date DATE,
    priority_number VARCHAR(100),
    claims_priority BOOLEAN DEFAULT FALSE,
    number_of_claims INTEGER NOT NULL,
    number_of_drawings INTEGER,
    
    -- Document URLs (Cloud Storage Links)
    description_file_url TEXT NOT NULL,
    claims_file_url TEXT NOT NULL,
    abstract_file_url TEXT NOT NULL,
    drawings_file_url TEXT,
    
    -- Payment Information
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_currency VARCHAR(3) DEFAULT 'INR',
    payment_id VARCHAR(255) NOT NULL,
    payment_order_id VARCHAR(255),
    payment_signature VARCHAR(255),
    payment_status VARCHAR(50) NOT NULL,
    payment_timestamp TIMESTAMP,
    
    -- Status and Timestamps
    status VARCHAR(50) DEFAULT 'submitted',
    filing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    CONSTRAINT pk_patent_filings PRIMARY KEY (id)
);

-- Create indexes for better query performance
CREATE INDEX idx_patent_filings_user_id ON patent_filings(user_id);
CREATE INDEX idx_patent_filings_status ON patent_filings(status);
CREATE INDEX idx_patent_filings_filing_date ON patent_filings(filing_date DESC);
CREATE INDEX idx_patent_filings_user_status ON patent_filings(user_id, status, filing_date DESC);
CREATE INDEX idx_patent_filings_user_email ON patent_filings(user_email);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patent_filings_updated_at 
    BEFORE UPDATE ON patent_filings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to table and columns
COMMENT ON TABLE patent_filings IS 'Stores all patent filing applications submitted by users';
COMMENT ON COLUMN patent_filings.user_id IS 'Firebase Auth UID or user identifier';
COMMENT ON COLUMN patent_filings.status IS 'Filing status: submitted, under-review, approved, rejected';
COMMENT ON COLUMN patent_filings.payment_status IS 'Payment status: completed, pending, failed';
