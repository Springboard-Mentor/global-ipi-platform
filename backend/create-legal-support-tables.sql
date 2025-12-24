-- Create FAQ table
CREATE TABLE IF NOT EXISTS faq (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Terms and Conditions table
CREATE TABLE IF NOT EXISTS terms_conditions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Privacy Policy table
CREATE TABLE IF NOT EXISTS privacy_policy (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample FAQ data
INSERT INTO faq (question, answer, category, display_order) VALUES
('What is the Global IP Intelligence Platform?', 'The Global IP Intelligence Platform is a comprehensive tool for searching, analyzing, and managing intellectual property assets worldwide. It provides real-time patent data, trademark information, and IP analytics.', 'General', 1),
('How do I search for patents?', 'You can search for patents using the search bar on the dashboard. Enter keywords, patent numbers, or company names. Use filters to refine your search by date, region, or technology category.', 'Search', 2),
('What subscription plans are available?', 'We offer three plans: Basic (Free) with 5 searches/month, Professional ($29/month) with 50 searches/month and advanced analytics, and Enterprise ($99/month) with unlimited searches and priority support.', 'Subscription', 3),
('How do I upgrade my subscription?', 'Go to Settings > Subscription and click the "Upgrade Plan" button. Choose your desired plan and complete the payment process. Your account will be upgraded immediately.', 'Subscription', 4),
('Can I export search results?', 'Yes, Professional and Enterprise users can export search results in PDF, CSV, or Excel formats. Click the export button on the search results page.', 'Features', 5),
('How do I reset my password?', 'Click on "Forgot Password" on the login page, or go to Settings > Security and click "Change Password". You will receive a password reset email.', 'Account', 6),
('Is my data secure?', 'Yes, we use industry-standard encryption for all data transmission and storage. Your personal information and search history are protected with advanced security measures.', 'Security', 7),
('Can I cancel my subscription anytime?', 'Yes, you can cancel your subscription at any time from Settings > Subscription. Your access will continue until the end of your current billing period.', 'Subscription', 8),
('How do I contact support?', 'You can contact support by clicking on Settings > Legal & Support > Contact Support, or email us at support@globalip.com. Enterprise users have access to priority support.', 'Support', 9),
('What file formats are supported for upload?', 'We support PDF, DOCX, and TXT files for patent document uploads. Maximum file size is 10MB for Basic users and 50MB for Professional and Enterprise users.', 'Features', 10);

-- Insert Terms and Conditions
INSERT INTO terms_conditions (title, content, version, effective_date) VALUES
('Terms and Conditions of Use', '
<h2>1. Acceptance of Terms</h2>
<p>By accessing and using the Global IP Intelligence Platform, you accept and agree to be bound by the terms and provisions of this agreement.</p>

<h2>2. Use License</h2>
<p>Permission is granted to temporarily access the materials on Global IP Intelligence Platform for personal, non-commercial transitory viewing only.</p>

<h2>3. Account Responsibilities</h2>
<p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.</p>

<h2>4. Subscription and Payment</h2>
<p>Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.</p>

<h2>5. Intellectual Property Rights</h2>
<p>The service and its original content, features, and functionality are owned by Global IP Intelligence Platform and are protected by international copyright, trademark, and other intellectual property laws.</p>

<h2>6. User Content</h2>
<p>You retain all rights to any content you submit, post, or display on or through the service. By submitting content, you grant us a worldwide, non-exclusive license to use, reproduce, and distribute your content.</p>

<h2>7. Prohibited Uses</h2>
<p>You may not use the service for any illegal purpose or to violate any laws. You may not attempt to gain unauthorized access to any portion of the service or any other systems or networks.</p>

<h2>8. Limitation of Liability</h2>
<p>In no event shall Global IP Intelligence Platform be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>

<h2>9. Termination</h2>
<p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms.</p>

<h2>10. Changes to Terms</h2>
<p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification.</p>

<h2>11. Governing Law</h2>
<p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate.</p>

<h2>12. Contact Information</h2>
<p>For questions about these Terms, please contact us at legal@globalip.com</p>
', '1.0', '2025-01-01');

-- Insert Privacy Policy
INSERT INTO privacy_policy (title, content, version, effective_date) VALUES
('Privacy Policy', '
<h2>1. Information We Collect</h2>
<p>We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:</p>
<ul>
  <li>Name and contact information (email address, phone number)</li>
  <li>Account credentials (username, password)</li>
  <li>Payment information</li>
  <li>Search queries and usage data</li>
  <li>Communications with our support team</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
  <li>Provide, maintain, and improve our services</li>
  <li>Process transactions and send related information</li>
  <li>Send technical notices, updates, and support messages</li>
  <li>Respond to your comments and questions</li>
  <li>Analyze usage patterns and improve user experience</li>
  <li>Protect against fraudulent or illegal activity</li>
</ul>

<h2>3. Information Sharing and Disclosure</h2>
<p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
<ul>
  <li>With your consent</li>
  <li>To comply with legal obligations</li>
  <li>To protect our rights and prevent fraud</li>
  <li>With service providers who assist in our operations</li>
  <li>In connection with a merger, sale, or acquisition</li>
</ul>

<h2>4. Data Security</h2>
<p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
<ul>
  <li>Encryption of data in transit and at rest</li>
  <li>Regular security assessments</li>
  <li>Access controls and authentication</li>
  <li>Secure data centers and infrastructure</li>
</ul>

<h2>5. Data Retention</h2>
<p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and data at any time.</p>

<h2>6. Your Rights</h2>
<p>You have the right to:</p>
<ul>
  <li>Access your personal information</li>
  <li>Correct inaccurate data</li>
  <li>Request deletion of your data</li>
  <li>Object to processing of your data</li>
  <li>Export your data</li>
  <li>Withdraw consent at any time</li>
</ul>

<h2>7. Cookies and Tracking Technologies</h2>
<p>We use cookies and similar technologies to collect usage information, improve our services, and provide personalized experiences. You can control cookies through your browser settings.</p>

<h2>8. Third-Party Services</h2>
<p>Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.</p>

<h2>9. Children''s Privacy</h2>
<p>Our service is not intended for children under 13. We do not knowingly collect information from children under 13.</p>

<h2>10. International Data Transfers</h2>
<p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>

<h2>11. Changes to Privacy Policy</h2>
<p>We may update this privacy policy from time to time. We will notify you of any material changes via email or platform notification.</p>

<h2>12. Contact Us</h2>
<p>For questions about this Privacy Policy or our privacy practices, please contact us at privacy@globalip.com</p>
', '1.0', '2025-01-01');
