-- View Patent Filings Data in Proper Sequence
-- Run this query to see data in the same order as the form

SELECT 
    -- ID
    id AS "Filing ID",
    
    -- User Information
    user_id AS "User ID",
    user_email AS "User Email",
    user_name AS "User Name",
    
    -- Applicant Information
    applicant_type AS "Applicant Type",
    applicant_name AS "Applicant Name",
    applicant_email AS "Applicant Email",
    applicant_phone AS "Applicant Phone",
    organization_name AS "Organization",
    applicant_address AS "Address",
    applicant_city AS "City",
    applicant_state AS "State",
    applicant_pincode AS "Pincode",
    applicant_country AS "Country",
    
    -- Invention Details
    invention_title AS "Invention Title",
    invention_field AS "Field",
    LEFT(invention_description, 50) || '...' AS "Description",
    LEFT(technical_problem, 30) || '...' AS "Problem",
    LEFT(proposed_solution, 30) || '...' AS "Solution",
    LEFT(advantages, 30) || '...' AS "Advantages",
    
    -- Patent Details
    patent_type AS "Patent Type",
    filing_type AS "Filing Type",
    number_of_claims AS "Claims",
    number_of_drawings AS "Drawings",
    
    -- Payment
    payment_amount AS "Amount",
    payment_status AS "Payment Status",
    payment_id AS "Payment ID",
    
    -- Status
    status AS "Filing Status",
    created_at AS "Submitted At"
    
FROM patent_filings
ORDER BY created_at DESC;
