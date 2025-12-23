-- Contact and Feedback Tables Creation Script
-- Database: my_project_db
-- PostgreSQL

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- Create Contacts Table
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email_sent BOOLEAN DEFAULT FALSE
);

-- Create Feedbacks Table
CREATE TABLE feedbacks (
    id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_id VARCHAR(255),
    ui_rating INTEGER CHECK (ui_rating >= 0 AND ui_rating <= 5),
    performance_rating INTEGER CHECK (performance_rating >= 0 AND performance_rating <= 5),
    features_rating INTEGER CHECK (features_rating >= 0 AND features_rating <= 5),
    support_rating INTEGER CHECK (support_rating >= 0 AND support_rating <= 5),
    overall_rating INTEGER CHECK (overall_rating >= 0 AND overall_rating <= 5),
    average_rating DECIMAL(3,2),
    feedback_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email_sent BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_email_sent ON contacts(email_sent);

CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_feedbacks_user_email ON feedbacks(user_email);
CREATE INDEX idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX idx_feedbacks_email_sent ON feedbacks(email_sent);
CREATE INDEX idx_feedbacks_average_rating ON feedbacks(average_rating DESC);

-- Insert sample data for testing (optional)
-- Contact Form Sample
INSERT INTO contacts (name, email, phone, subject, message, email_sent) 
VALUES 
    ('John Doe', 'john@example.com', '+1234567890', 'Product Inquiry', 'I would like to know more about your products.', true),
    ('Jane Smith', 'jane@example.com', '+0987654321', 'Technical Support', 'I am facing issues with the platform.', true);

-- Feedback Form Sample
INSERT INTO feedbacks (user_name, user_email, user_id, ui_rating, performance_rating, features_rating, support_rating, overall_rating, average_rating, feedback_message, email_sent) 
VALUES 
    ('John Doe', 'john@example.com', 'user123', 5, 4, 5, 4, 5, 4.6, 'Great platform! Very user-friendly.', true),
    ('Jane Smith', 'jane@example.com', 'user456', 4, 5, 4, 5, 4, 4.4, 'Excellent performance and support.', true);

-- View to check all contacts with latest first
CREATE OR REPLACE VIEW v_latest_contacts AS
SELECT 
    id,
    name,
    email,
    phone,
    subject,
    LEFT(message, 100) as message_preview,
    created_at,
    email_sent
FROM contacts
ORDER BY created_at DESC;

-- View to check feedback statistics
CREATE OR REPLACE VIEW v_feedback_stats AS
SELECT 
    COUNT(*) as total_feedbacks,
    ROUND(AVG(ui_rating)::numeric, 2) as avg_ui_rating,
    ROUND(AVG(performance_rating)::numeric, 2) as avg_performance_rating,
    ROUND(AVG(features_rating)::numeric, 2) as avg_features_rating,
    ROUND(AVG(support_rating)::numeric, 2) as avg_support_rating,
    ROUND(AVG(overall_rating)::numeric, 2) as avg_overall_rating,
    ROUND(AVG(average_rating)::numeric, 2) as overall_avg_rating,
    COUNT(CASE WHEN average_rating >= 4.0 THEN 1 END) as positive_feedbacks,
    COUNT(CASE WHEN average_rating < 3.0 THEN 1 END) as negative_feedbacks
FROM feedbacks;

-- View to check all feedbacks with latest first
CREATE OR REPLACE VIEW v_latest_feedbacks AS
SELECT 
    id,
    user_name,
    user_email,
    ui_rating,
    performance_rating,
    features_rating,
    support_rating,
    overall_rating,
    average_rating,
    LEFT(feedback_message, 100) as feedback_preview,
    created_at,
    email_sent
FROM feedbacks
ORDER BY created_at DESC;

-- Function to get feedback summary for a user
CREATE OR REPLACE FUNCTION get_user_feedback_summary(p_user_id VARCHAR)
RETURNS TABLE (
    total_feedbacks BIGINT,
    avg_rating DECIMAL,
    latest_feedback_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT,
        ROUND(AVG(average_rating)::numeric, 2),
        MAX(created_at)
    FROM feedbacks
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Usage examples:
-- SELECT * FROM v_latest_contacts;
-- SELECT * FROM v_latest_feedbacks;
-- SELECT * FROM v_feedback_stats;
-- SELECT * FROM get_user_feedback_summary('user123');

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON TABLE contacts TO your_user;
-- GRANT ALL PRIVILEGES ON TABLE feedbacks TO your_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;

COMMIT;
