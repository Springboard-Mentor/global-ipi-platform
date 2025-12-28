-- Create patent_filings table in my_project_db
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
    
    -- Invention Information
    invention_title VARCHAR(500) NOT NULL,
    invention_description TEXT NOT NULL,
    technical_field VARCHAR(255) NOT NULL,
    background_art TEXT,
    problem_solved TEXT,
    solution_provided TEXT,
    advantages TEXT,
    
    -- Technical Details
    detailed_description TEXT,
    drawings_description TEXT,
    best_mode TEXT,
    industrial_applicability TEXT,
    
    -- Claims
    claims TEXT NOT NULL,
    independent_claims_count INTEGER,
    dependent_claims_count INTEGER,
    
    -- Prior Art
    prior_art_search_conducted BOOLEAN DEFAULT FALSE,
    prior_art_references TEXT,
    novelty_statement TEXT,
    inventive_step_statement TEXT,
    
    -- Documents (Cloud URLs)
    specification_document_url VARCHAR(500),
    drawings_document_url VARCHAR(500),
    abstract_document_url VARCHAR(500),
    claims_document_url VARCHAR(500),
    
    -- Inventors JSON
    inventors_json TEXT,
    
    -- Priority Details
    priority_claimed BOOLEAN DEFAULT FALSE,
    priority_application_number VARCHAR(100),
    priority_date DATE,
    priority_country VARCHAR(100),
    
    -- Filing Details
    filing_type VARCHAR(50) NOT NULL,
    patent_type VARCHAR(50),
    filing_status VARCHAR(50) DEFAULT 'pending',
    
    -- Payment Information
    payment_amount DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    payment_date TIMESTAMP,
    
    -- Additional Information
    keywords VARCHAR(500),
    abstract TEXT,
    commercial_potential TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    
    -- Metadata
    notes TEXT,
    admin_notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patent_filings_user_id ON patent_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_patent_filings_status ON patent_filings(filing_status);
CREATE INDEX IF NOT EXISTS idx_patent_filings_payment_status ON patent_filings(payment_status);
CREATE INDEX IF NOT EXISTS idx_patent_filings_created_at ON patent_filings(created_at);

-- Display confirmation
SELECT 'patent_filings table created successfully!' AS status;
SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patent_filings';
