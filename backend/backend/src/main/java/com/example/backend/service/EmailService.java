package com.example.backend.service;

import com.example.backend.model.Contact;
import com.example.backend.model.Feedback;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.admin.email:vikaskumaryadav068@gmail.com}")
    private String adminEmail;
    
    /**
     * Send confirmation email to user who submitted contact form
     */
    public void sendContactConfirmation(Contact contact) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(contact.getEmail());
        helper.setSubject("Thank you for contacting us - " + contact.getSubject());
        
        String htmlContent = buildContactConfirmationEmail(contact);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
        log.info("Contact confirmation email sent to: {}", contact.getEmail());
    }
    
    /**
     * Send notification to admin about new contact form submission
     */
    public void sendContactNotificationToAdmin(Contact contact) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(adminEmail);
        helper.setSubject("New Contact Form Submission - " + contact.getSubject());
        
        String htmlContent = buildContactNotificationEmail(contact);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
        log.info("Contact notification email sent to admin");
    }
    
    /**
     * Send confirmation email to user who submitted feedback
     */
    public void sendFeedbackConfirmation(Feedback feedback) throws MessagingException {
        if (feedback.getUserEmail() == null || feedback.getUserEmail().isEmpty()) {
            log.warn("No email address for feedback, skipping confirmation email");
            return;
        }
        
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(feedback.getUserEmail());
        helper.setSubject("Thank you for your valuable feedback!");
        
        String htmlContent = buildFeedbackConfirmationEmail(feedback);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
        log.info("Feedback confirmation email sent to: {}", feedback.getUserEmail());
    }
    
    /**
     * Send notification to admin about new feedback submission
     */
    public void sendFeedbackNotificationToAdmin(Feedback feedback) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(adminEmail);
        helper.setSubject("New Feedback Received - Average Rating: " + String.format("%.2f", feedback.getAverageRating()));
        
        String htmlContent = buildFeedbackNotificationEmail(feedback);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
        log.info("Feedback notification email sent to admin");
    }
    
    private String buildContactConfirmationEmail(Contact contact) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You for Contacting Us!</h1>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>We have received your message and appreciate you taking the time to reach out to us.</p>
                        
                        <div class="info-box">
                            <h3>Your Message Details:</h3>
                            <p><strong>Subject:</strong> %s</p>
                            <p><strong>Message:</strong><br>%s</p>
                        </div>
                        
                        <p>Our team will review your message and get back to you as soon as possible.</p>
                        <p>If you have any urgent questions, feel free to reply to this email.</p>
                        
                        <p>Best regards,<br>
                        <strong>Global IPI Platform Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated confirmation email. Please do not reply to this message.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(contact.getName(), contact.getSubject(), contact.getMessage());
    }
    
    private String buildContactNotificationEmail(Contact contact) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #ddd; }
                    .info-label { font-weight: bold; width: 120px; }
                    .info-value { flex: 1; }
                    .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🔔 New Contact Form Submission</h2>
                    </div>
                    <div class="content">
                        <div class="info-row">
                            <div class="info-label">Name:</div>
                            <div class="info-value">%s</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Email:</div>
                            <div class="info-value">%s</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Phone:</div>
                            <div class="info-value">%s</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Subject:</div>
                            <div class="info-value">%s</div>
                        </div>
                        
                        <div class="message-box">
                            <h4>Message:</h4>
                            <p>%s</p>
                        </div>
                        
                        <p><small>Submitted at: %s</small></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                contact.getName(),
                contact.getEmail(),
                contact.getPhone() != null ? contact.getPhone() : "Not provided",
                contact.getSubject(),
                contact.getMessage(),
                contact.getCreatedAt()
            );
    }
    
    private String buildFeedbackConfirmationEmail(Feedback feedback) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .rating-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
                    .stars { color: #ffd700; font-size: 24px; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You for Your Feedback! ⭐</h1>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>We truly appreciate you taking the time to share your feedback with us!</p>
                        
                        <div class="rating-box">
                            <h3>Your Average Rating</h3>
                            <div class="stars">%s</div>
                            <p><strong>%.2f out of 5.0</strong></p>
                        </div>
                        
                        <p>Your insights help us improve our platform and provide better service to all our users.</p>
                        <p>We're constantly working to enhance your experience based on valuable feedback like yours.</p>
                        
                        <p>Thank you for being a valued member of our community!</p>
                        
                        <p>Best regards,<br>
                        <strong>Global IPI Platform Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated confirmation email.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                feedback.getUserName() != null ? feedback.getUserName() : "Valued User",
                generateStars(feedback.getAverageRating()),
                feedback.getAverageRating()
            );
    }
    
    private String buildFeedbackNotificationEmail(Feedback feedback) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .rating-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                    .rating-item { background: white; padding: 15px; border-radius: 5px; text-align: center; }
                    .rating-label { font-size: 12px; color: #666; }
                    .rating-value { font-size: 24px; font-weight: bold; color: #667eea; }
                    .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>⭐ New Feedback Received</h2>
                    </div>
                    <div class="content">
                        <p><strong>User:</strong> %s</p>
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>User ID:</strong> %s</p>
                        
                        <h3>Ratings:</h3>
                        <div class="rating-grid">
                            <div class="rating-item">
                                <div class="rating-label">UI Design</div>
                                <div class="rating-value">%d/5</div>
                            </div>
                            <div class="rating-item">
                                <div class="rating-label">Performance</div>
                                <div class="rating-value">%d/5</div>
                            </div>
                            <div class="rating-item">
                                <div class="rating-label">Features</div>
                                <div class="rating-value">%d/5</div>
                            </div>
                            <div class="rating-item">
                                <div class="rating-label">Support</div>
                                <div class="rating-value">%d/5</div>
                            </div>
                            <div class="rating-item">
                                <div class="rating-label">Overall</div>
                                <div class="rating-value">%d/5</div>
                            </div>
                            <div class="rating-item">
                                <div class="rating-label">Average</div>
                                <div class="rating-value">%.2f/5</div>
                            </div>
                        </div>
                        
                        <div class="message-box">
                            <h4>Additional Comments:</h4>
                            <p>%s</p>
                        </div>
                        
                        <p><small>Submitted at: %s</small></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                feedback.getUserName() != null ? feedback.getUserName() : "Anonymous",
                feedback.getUserEmail() != null ? feedback.getUserEmail() : "Not provided",
                feedback.getUserId() != null ? feedback.getUserId() : "N/A",
                feedback.getUserInterfaceRating(),
                feedback.getPerformanceRating(),
                feedback.getFeaturesRating(),
                feedback.getSupportRating(),
                feedback.getOverallRating(),
                feedback.getAverageRating(),
                feedback.getFeedbackMessage() != null ? feedback.getFeedbackMessage() : "No additional comments",
                feedback.getCreatedAt()
            );
    }
    
    private String generateStars(Double rating) {
        int fullStars = (int) Math.floor(rating);
        StringBuilder stars = new StringBuilder();
        for (int i = 0; i < fullStars; i++) {
            stars.append("⭐");
        }
        return stars.toString();
    }
}
