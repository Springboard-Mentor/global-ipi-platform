-- Check all tables in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- View all patents data
SELECT patent_id, id, title, assignee, status, filing_date, api_source 
FROM patents 
ORDER BY patent_id;

-- Count total patents
SELECT COUNT(*) as total_patents FROM patents;

-- View all users data
SELECT id, email, first_name, last_name, organization, is_verified, created_at 
FROM users 
ORDER BY id;

-- Count total users
SELECT COUNT(*) as total_users FROM users;
