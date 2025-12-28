-- Drop existing table and recreate with updated schema
DROP TABLE IF EXISTS patent_filings CASCADE;

-- Create patent_filings table in my_project_db with all new fields
CREATE TABLE patent_filings (
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
    applicant_type VARCHAR(50) NOT NULL DEFAULT 'individual',
    
    -- Personal Details (NEW)
    date_of_birth DATE,
    age INTEGER,
    gender VARCHAR(20),
    occupation VARCHAR(100),
    educational_qualification VARCHAR(200),
    designation VARCHAR(100),
    application_date DATE NOT NULL,
    
    -- Additional Contact Details (NEW)
    alternate_phone VARCHAR(20),
    alternate_email VARCHAR(255),
    
    -- Government ID Details (NEW)
    govt_id_type VARCHAR(50),
    govt_id_number VARCHAR(50),
    passport_country VARCHAR(100),
    driving_license_state VARCHAR(100),
    
    -- Tax Details
    gstin VARCHAR(15),
    aadhaar_number VARCHAR(12),
    pan_number VARCHAR(10),
    
    -- Correspondence Address
    correspondence_address TEXT,
    correspondence_city VARCHAR(100),
    correspondence_state VARCHAR(100),
    correspondence_pincode VARCHAR(10),
    same_as_applicant_address BOOLEAN DEFAULT TRUE,
    
    -- Invention Information
    invention_title VARCHAR(500) NOT NULL,
    invention_field VARCHAR(255) NOT NULL,
    invention_description TEXT NOT NULL,
    technical_problem TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    advantages TEXT NOT NULL,
    
    -- Additional Invention Details (NEW)
    keywords VARCHAR(500),
    target_industry VARCHAR(200),
    commercial_application TEXT,
    prior_art TEXT,
    
    -- Patent Details
    patent_type VARCHAR(50) NOT NULL DEFAULT 'provisional',
    filing_type VARCHAR(50) NOT NULL DEFAULT 'national',
    number_of_claims INTEGER NOT NULL,
    number_of_drawings INTEGER,
    
    -- Priority Details
    claims_priority BOOLEAN DEFAULT FALSE,
    priority_date DATE,
    priority_number VARCHAR(100),
    
    -- Document URLs (Cloud Storage)
    description_file_url TEXT NOT NULL,
    claims_file_url TEXT NOT NULL,
    abstract_file_url TEXT NOT NULL,
    drawings_file_url TEXT,
    
    -- Payment Information
    payment_amount DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    payment_currency VARCHAR(3) DEFAULT 'INR',
    payment_id VARCHAR(255) NOT NULL,
    payment_order_id VARCHAR(255),
    payment_signature VARCHAR(500),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_timestamp TIMESTAMP,
    
    -- Agreement
    agreed_to_terms BOOLEAN DEFAULT FALSE,
    
    -- Status and Metadata
    status VARCHAR(50) DEFAULT 'submitted',
    filing_date TIMESTAMP,
    filing_status VARCHAR(50) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    
    -- Admin Notes
    notes TEXT,
    admin_notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_patent_filings_user_id ON patent_filings(user_id);
CREATE INDEX idx_patent_filings_user_email ON patent_filings(user_email);
CREATE INDEX idx_patent_filings_status ON patent_filings(status);
CREATE INDEX idx_patent_filings_payment_status ON patent_filings(payment_status);
CREATE INDEX idx_patent_filings_filing_status ON patent_filings(filing_status);
CREATE INDEX idx_patent_filings_created_at ON patent_filings(created_at);
CREATE INDEX idx_patent_filings_application_date ON patent_filings(application_date);

-- Display confirmation
SELECT 'patent_filings table dropped and recreated successfully with updated schema!' AS status;
SELECT COUNT(*) AS total_columns 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'patent_filings';
