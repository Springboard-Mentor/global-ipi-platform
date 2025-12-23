package com.example.backend.controller;

import com.example.backend.model.Contact;
import com.example.backend.repository.ContactRepository;
import com.example.backend.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ContactController {
    
    private final ContactRepository contactRepository;
    private final EmailService emailService;
    
    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;
    
    /**
     * Submit contact form
     */
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitContact(@Valid @RequestBody Contact contact) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Save to database
            Contact savedContact = contactRepository.save(contact);
            log.info("Contact form saved to database with ID: {}", savedContact.getId());
            
            // Send emails (only if enabled)
            if (emailEnabled) {
                try {
                    // Send confirmation email to user
                    emailService.sendContactConfirmation(savedContact);
                    
                    // Send notification to admin
                    emailService.sendContactNotificationToAdmin(savedContact);
                    
                    // Update email sent status
                    savedContact.setEmailSent(true);
                    contactRepository.save(savedContact);
                    
                    log.info("Emails sent successfully for contact ID: {}", savedContact.getId());
                } catch (Exception e) {
                    log.error("Failed to send emails for contact ID: {}", savedContact.getId(), e);
                    // Continue even if email fails - data is already saved
                    response.put("emailWarning", "Contact saved but email notification failed");
                }
            } else {
                log.info("Email disabled - skipping email notification for contact ID: {}", savedContact.getId());
            }
            
            response.put("success", true);
            response.put("message", "Thank you for contacting us! We'll get back to you soon.");
            response.put("contactId", savedContact.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing contact form", e);
            response.put("success", false);
            response.put("message", "Failed to submit contact form. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get all contacts (Admin endpoint)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Contact>> getAllContacts() {
        try {
            List<Contact> contacts = contactRepository.findAll();
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            log.error("Error fetching contacts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get contact by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        return contactRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Delete contact by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteContact(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (contactRepository.existsById(id)) {
                contactRepository.deleteById(id);
                response.put("success", true);
                response.put("message", "Contact deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Contact not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            log.error("Error deleting contact", e);
            response.put("success", false);
            response.put("message", "Failed to delete contact");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
