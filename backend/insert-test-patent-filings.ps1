# PowerShell script to insert test patent filings with granted/rejected statuses
# Run this script to quickly add sample data to your database

Write-Host "Inserting test patent filings into PostgreSQL database..." -ForegroundColor Cyan

# PostgreSQL connection details
$env:PGPASSWORD = "vikas"
$dbName = "my_project_db"
$dbUser = "postgres"
$dbHost = "localhost"
$dbPort = "5432"

# SQL to insert sample data
$sql = @"
-- Insert sample granted patent filing
INSERT INTO patent_filings (
    user_id, user_email, user_name,
    applicant_name, applicant_email, applicant_phone,
    applicant_address, applicant_city, applicant_state, applicant_pincode, applicant_country,
    applicant_type, application_date,
    invention_title, invention_field, invention_description,
    technical_problem, proposed_solution, advantages,
    patent_type, filing_type, number_of_claims,
    description_file_url, claims_file_url, abstract_file_url,
    payment_amount, payment_currency, payment_id, payment_status,
    status, patent_number, granted_patent_person_name, location,
    created_at, updated_at, filing_date
) VALUES (
    'test-user-1', 'test1@example.com', 'Test User 1',
    'Innovator Smith', 'innovator@example.com', '+91-9876543210',
    '123 Tech Street', 'Bangalore', 'Karnataka', '560001', 'India',
    'individual', CURRENT_DATE,
    'Smart IoT Home Automation System', 'Internet of Things', 'An integrated IoT system for comprehensive home automation with AI-powered energy optimization.',
    'Current home automation systems lack intelligent energy management', 'AI-based predictive algorithm for energy consumption', 'Reduces energy consumption by 35%, saves costs, eco-friendly',
    'utility', 'complete', 20,
    'https://example.com/desc1.pdf', 'https://example.com/claims1.pdf', 'https://example.com/abstract1.pdf',
    25000.00, 'INR', 'pay_test_granted_1', 'success',
    'granted', 'IN2024051234', 'Dr. Rajesh Kumar', 'Bangalore Patent Office',
    NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- Insert sample rejected patent filing
INSERT INTO patent_filings (
    user_id, user_email, user_name,
    applicant_name, applicant_email, applicant_phone,
    applicant_address, applicant_city, applicant_state, applicant_pincode, applicant_country,
    applicant_type, application_date,
    invention_title, invention_field, invention_description,
    technical_problem, proposed_solution, advantages,
    patent_type, filing_type, number_of_claims,
    description_file_url, claims_file_url, abstract_file_url,
    payment_amount, payment_currency, payment_id, payment_status,
    status, rejected_patent_number, rejected_patent_person_name, location,
    created_at, updated_at, filing_date
) VALUES (
    'test-user-2', 'test2@example.com', 'Test User 2',
    'John Inventor', 'john@example.com', '+91-9876543211',
    '456 Innovation Park', 'Mumbai', 'Maharashtra', '400001', 'India',
    'individual', CURRENT_DATE,
    'Simple Wheel Mechanism', 'Mechanical', 'A circular device that rotates around an axle.',
    'Need for circular motion', 'Make it round', 'It rolls',
    'utility', 'provisional', 5,
    'https://example.com/desc2.pdf', 'https://example.com/claims2.pdf', 'https://example.com/abstract2.pdf',
    25000.00, 'INR', 'pay_test_rejected_2', 'success',
    'rejected', 'REJ-2024-1234', 'Dr. Priya Sharma', 'Mumbai Patent Office',
    NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- Insert another granted patent filing
INSERT INTO patent_filings (
    user_id, user_email, user_name,
    applicant_name, applicant_email, applicant_phone,
    applicant_address, applicant_city, applicant_state, applicant_pincode, applicant_country,
    applicant_type, application_date,
    invention_title, invention_field, invention_description,
    technical_problem, proposed_solution, advantages,
    patent_type, filing_type, number_of_claims,
    description_file_url, claims_file_url, abstract_file_url,
    payment_amount, payment_currency, payment_id, payment_status,
    status, patent_number, granted_patent_person_name, location,
    created_at, updated_at, filing_date
) VALUES (
    'test-user-3', 'test3@example.com', 'Test User 3',
    'Dr. Amit Patel', 'amit@example.com', '+91-9876543212',
    '789 Research Center', 'Pune', 'Maharashtra', '411001', 'India',
    'individual', CURRENT_DATE,
    'Quantum Computing Algorithm for Cryptography', 'Computer Science', 'A novel quantum algorithm that enhances encryption security using quantum entanglement principles.',
    'Current encryption vulnerable to quantum attacks', 'Quantum-resistant encryption using entanglement', 'Unbreakable encryption, future-proof security',
    'utility', 'complete', 30,
    'https://example.com/desc3.pdf', 'https://example.com/claims3.pdf', 'https://example.com/abstract3.pdf',
    25000.00, 'INR', 'pay_test_granted_3', 'success',
    'granted', 'IN2024052345', 'Dr. Sunita Verma', 'Delhi Patent Office',
    NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

SELECT COUNT(*) as total_granted_rejected FROM patent_filings WHERE status IN ('granted', 'rejected');
"@

# Execute the SQL
try {
    $sql | & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h $dbHost -p $dbPort -U $dbUser -d $dbName
    Write-Host "`n✅ Successfully inserted test patent filings!" -ForegroundColor Green
    Write-Host "You should now see granted and rejected patent filings in your search results." -ForegroundColor Green
} catch {
    Write-Host "`n❌ Error inserting data: $_" -ForegroundColor Red
    Write-Host "Make sure PostgreSQL is running and accessible." -ForegroundColor Yellow
}

# Clear the password environment variable
$env:PGPASSWORD = ""
