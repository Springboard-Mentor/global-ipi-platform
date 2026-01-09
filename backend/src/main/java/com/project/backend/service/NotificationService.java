package com.project.backend.service;

import com.project.backend.entity.Notification;
import com.project.backend.entity.User;
import com.project.backend.entity.IPAsset;
import com.project.backend.repository.NotificationRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.repository.IPAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// ✅ Required Imports for Email
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private IPAssetRepository ipAssetRepository;
    
    // ✅ Inject Mail Sender
    @Autowired private JavaMailSender mailSender;

    // ✅ Inject the sender email from application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * ✅ GET NOTIFICATIONS
     * Logic: Returns ALL Unread notifications + Read notifications from the last 2 days.
     * This prevents read notifications from disappearing immediately.
     */
    public List<Notification> getUserNotifications(Integer userId) {
        LocalDateTime twoDaysAgo = LocalDateTime.now().minusDays(2);
        // Uses the custom query we fixed in the Repository
        return notificationRepository.findRecentNotifications(userId, twoDaysAgo);
    }

    /**
     * ✅ MARK AS READ
     * Updates the status in the DB. They will disappear 2 days after this action.
     */
    @Transactional
    public void markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true); 
        notificationRepository.save(notification);
    }

    /**
     * ✅ SEND ALERT (To User)
     * Called when Admin updates a filing status.
     * 1. Saves to DB (for Dashboard Bell).
     * 2. Sends Email.
     */
    @Transactional
    public void sendAlert(Integer userId, Integer assetId, String message, String type) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        IPAsset asset = (assetId != null) ? ipAssetRepository.findById(assetId).orElse(null) : null;

        // 1. Save to Database
        Notification note = new Notification();
        note.setUser(user);
        note.setIpAsset(asset);
        note.setMessage(message);
        note.setType(type);
        note.setIsRead(false); 
        notificationRepository.save(note);

        // 2. Send Email
        sendEmailToUser(user.getEmail(), "IP Filing Update: " + type, message);
    }

    /**
     * ✅ SEND ADMIN ALERT (To Admin)
     * Called when a User requests alerts on the filing tracker.
     */
    @Transactional
    public void sendAdminAlert(String userEmail, String filingId, String triggers) {
        // Find Admin by specific email
        User admin = userRepository.findByEmail("bhuvananagarajan0728@gmail.com")
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // 1. Save to Database
        Notification note = new Notification();
        note.setUser(admin);
        note.setType("User Alert Request");
        note.setMessage("User " + userEmail + " requested alerts [" + triggers + "] for filing " + filingId);
        note.setIsRead(false);
        notificationRepository.save(note);

        // 2. Send Email
        String emailBody = "User " + userEmail + " has requested the following alerts for Filing ID " + filingId + ":\n\n" + triggers;
        sendEmailToUser(admin.getEmail(), "New Alert Request from User", emailBody);
    }

    // ✅ HELPER: Safe Email Sending Logic
    private void sendEmailToUser(String toEmail, String subject, String body) {
        try {
            if (toEmail != null && !toEmail.isEmpty()) {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setFrom(fromEmail);
                mailMessage.setTo(toEmail);
                mailMessage.setSubject(subject);
                mailMessage.setText(body + "\n\n- Global IP Intelligence Team");
                
                mailSender.send(mailMessage);
                System.out.println("✅ Email sent successfully to " + toEmail);
            } else {
                System.err.println("⚠️ User has no email address, skipping email.");
            }
        } catch (Exception e) {
            // Log error but don't crash the application
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}