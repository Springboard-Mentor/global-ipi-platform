package com.example.backend.service;

import com.example.backend.dto.ChatbotRequest;
import com.example.backend.dto.ChatbotResponse;
import com.example.backend.model.ChatbotConversation;
import com.example.backend.model.ChatbotKnowledgeBase;
import com.example.backend.model.PatentFiling;
import com.example.backend.repository.ChatbotConversationRepository;
import com.example.backend.repository.ChatbotKnowledgeBaseRepository;
import com.example.backend.repository.PatentFilingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {
    
    private final ChatbotKnowledgeBaseRepository knowledgeBaseRepository;
    private final ChatbotConversationRepository conversationRepository;
    private final PatentFilingRepository patentFilingRepository;
    
    // @Transactional // Temporarily removed for debugging
    public ChatbotResponse processMessage(ChatbotRequest request) {
        try {
            if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                ChatbotResponse errorResponse = new ChatbotResponse(
                    "I didn't receive a message. Please type something and try again."
                );
                errorResponse.setQueryType("error");
                return errorResponse;
            }
            
            String userMessage = request.getMessage().trim().toLowerCase();
            ChatbotResponse response;
            
            // Determine query type and generate response
            if (isPatentCountQuery(userMessage)) {
                response = handlePatentCountQuery(userMessage);
            } else if (isStatePatentQuery(userMessage)) {
                response = handleStatePatentQuery(userMessage);
            } else if (isCityPatentQuery(userMessage)) {
                response = handleCityPatentQuery(userMessage);
            } else if (isStatusQuery(userMessage)) {
                response = handleStatusQuery(userMessage);
            } else {
                response = handleGeneralQuery(userMessage);
            }
            
            // Ensure response is never null
            if (response == null) {
                response = new ChatbotResponse(
                    "I apologize, but I couldn't generate a response. Please try rephrasing your question."
                );
                response.setQueryType("error");
            }
            
            // Save conversation history (non-blocking)
            try {
                saveConversation(request, response);
            } catch (Exception e) {
                // Log error but don't fail the response
                System.err.println("Error saving conversation: " + e.getMessage());
            }
            
            return response;
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
            
            ChatbotResponse errorResponse = new ChatbotResponse(
                "I apologize, but I encountered an unexpected error. Please try again or contact support if the issue persists."
            );
            errorResponse.setQueryType("error");
            errorResponse.setSuggestions(Arrays.asList(
                "How many patents are there?",
                "Show subscription plans",
                "What features are available?"
            ));
            return errorResponse;
        }
    }
    
    private boolean isPatentCountQuery(String message) {
        return message.contains("how many patent") || 
               message.contains("total patent") ||
               message.contains("number of patent") ||
               message.contains("patent count");
    }
    
    private boolean isStatePatentQuery(String message) {
        return (message.contains("patent") && message.contains("state")) ||
               message.contains("state wise") ||
               message.contains("patents by state");
    }
    
    private boolean isCityPatentQuery(String message) {
        return (message.contains("patent") && message.contains("city")) ||
               message.contains("patents in") ||
               message.contains("patents by city");
    }
    
    private boolean isStatusQuery(String message) {
        return message.contains("patent status") ||
               message.contains("status") && message.contains("patent") ||
               message.contains("granted") ||
               message.contains("pending") ||
               message.contains("abandoned");
    }
    
    private ChatbotResponse handlePatentCountQuery(String message) {
        try {
            long totalPatents = patentFilingRepository.count();
            
            String responseMessage = String.format(
                "There are currently **%d patent filings** in the database. " +
                "This includes patents in all statuses (pending, granted, abandoned, etc.). " +
                "You can view detailed statistics on the dashboard.",
                totalPatents
            );
            
            Map<String, Object> data = new HashMap<>();
            data.put("totalPatents", totalPatents);
            data.put("timestamp", LocalDateTime.now());
            
            List<String> suggestions = Arrays.asList(
                "Show patents by state",
                "Show patent status distribution",
                "What features are available?"
            );
            
            ChatbotResponse response = new ChatbotResponse(
                responseMessage,
                "data",
                data
            );
            response.setSuggestions(suggestions);
            response.setQueryType("patent_count");
            
            return response;
        } catch (Exception e) {
            return new ChatbotResponse(
                "I encountered an error while fetching patent count. Please try again or contact support."
            );
        }
    }
    
    private ChatbotResponse handleStatePatentQuery(String message) {
        try {
            // Extract state name if mentioned
            String stateName = extractStateName(message);
            
            List<Object[]> statePatentCounts = patentFilingRepository.countPatentsByState();
            
            if (stateName != null && !stateName.isEmpty()) {
                // Find specific state count
                Optional<Object[]> stateData = statePatentCounts.stream()
                    .filter(data -> data[0] != null && 
                           data[0].toString().toLowerCase().contains(stateName.toLowerCase()))
                    .findFirst();
                
                if (stateData.isPresent()) {
                    String state = stateData.get()[0].toString();
                    Long count = ((Number) stateData.get()[1]).longValue();
                    
                    String responseMessage = String.format(
                        "**%s** has **%d patent filings**. " +
                        "You can view a detailed breakdown on the dashboard's State Patent Count panel.",
                        state, count
                    );
                    
                    Map<String, Object> data = new HashMap<>();
                    data.put("state", state);
                    data.put("count", count);
                    
                    ChatbotResponse response = new ChatbotResponse(responseMessage, "data", data);
                    response.setQueryType("state_patent_query");
                    return response;
                } else {
                    return new ChatbotResponse(
                        String.format("I couldn't find patent data for '%s'. Please check the state name and try again.", stateName)
                    );
                }
            } else {
                // Show all states summary
                Map<String, Long> stateMap = new HashMap<>();
                for (Object[] stateData : statePatentCounts) {
                    if (stateData[0] != null) {
                        stateMap.put(stateData[0].toString(), ((Number) stateData[1]).longValue());
                    }
                }
                
                // Get top 5 states
                List<Map.Entry<String, Long>> topStates = stateMap.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .collect(Collectors.toList());
                
                StringBuilder responseMsg = new StringBuilder("**Top 5 states by patent count:**\n\n");
                for (int i = 0; i < topStates.size(); i++) {
                    Map.Entry<String, Long> entry = topStates.get(i);
                    responseMsg.append(String.format("%d. **%s**: %d patents\n", 
                        i + 1, entry.getKey(), entry.getValue()));
                }
                responseMsg.append("\nView the complete list on the dashboard's India Patent Panel.");
                
                ChatbotResponse response = new ChatbotResponse(responseMsg.toString(), "data", stateMap);
                response.setQueryType("state_patent_summary");
                response.setSuggestions(Arrays.asList(
                    "Show patents in Maharashtra",
                    "Show patents in Karnataka",
                    "Show patents by city"
                ));
                return response;
            }
        } catch (Exception e) {
            return new ChatbotResponse(
                "I encountered an error while fetching state-wise patent data. Please try again."
            );
        }
    }
    
    private ChatbotResponse handleCityPatentQuery(String message) {
        try {
            String cityName = extractCityName(message);
            
            if (cityName != null && !cityName.isEmpty()) {
                // Search for patents in specific city
                List<PatentFiling> allPatents = patentFilingRepository.findAll();
                long cityPatentCount = allPatents.stream()
                    .filter(p -> p.getApplicantCity() != null && 
                           p.getApplicantCity().toLowerCase().contains(cityName.toLowerCase()))
                    .count();
                
                String responseMessage;
                if (cityPatentCount > 0) {
                    responseMessage = String.format(
                        "**%s** has **%d patent filings**. " +
                        "Use the dashboard filters to explore these patents in detail.",
                        cityName, cityPatentCount
                    );
                } else {
                    responseMessage = String.format(
                        "I couldn't find any patents for '%s'. " +
                        "Please check the city name or try searching by state.",
                        cityName
                    );
                }
                
                Map<String, Object> data = new HashMap<>();
                data.put("city", cityName);
                data.put("count", cityPatentCount);
                
                ChatbotResponse response = new ChatbotResponse(responseMessage, "data", data);
                response.setQueryType("city_patent_query");
                return response;
            } else {
                return new ChatbotResponse(
                    "Please specify a city name. For example: 'How many patents in Mumbai?' or 'Patents in Bangalore'"
                );
            }
        } catch (Exception e) {
            return new ChatbotResponse(
                "I encountered an error while fetching city patent data. Please try again."
            );
        }
    }
    
    private ChatbotResponse handleStatusQuery(String message) {
        try {
            // Count patents by status
            List<PatentFiling> allPatents = patentFilingRepository.findAll();
            
            Map<String, Long> statusCounts = allPatents.stream()
                .filter(p -> p.getStatus() != null)
                .collect(Collectors.groupingBy(
                    p -> p.getStatus(),
                    Collectors.counting()
                ));
            
            StringBuilder responseMessage = new StringBuilder("**Patent Status Distribution:**\n\n");
            
            statusCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .forEach(entry -> {
                    responseMessage.append(String.format("- **%s**: %d patents\n", 
                        entry.getKey(), entry.getValue()));
                });
            
            responseMessage.append("\nYou can filter by specific status on the dashboard.");
            
            ChatbotResponse response = new ChatbotResponse(
                responseMessage.toString(),
                "data",
                statusCounts
            );
            response.setQueryType("status_query");
            response.setSuggestions(Arrays.asList(
                "Show granted patents",
                "Show pending patents",
                "What are patent statuses?"
            ));
            
            return response;
        } catch (Exception e) {
            return new ChatbotResponse(
                "I encountered an error while fetching patent status data. Please try again."
            );
        }
    }
    
    private ChatbotResponse handleGeneralQuery(String message) {
        try {
            // Search knowledge base
            List<ChatbotKnowledgeBase> allKnowledge = knowledgeBaseRepository.findByIsActiveTrueOrderByPriorityDesc();
            
            // Find best match based on keywords
            ChatbotKnowledgeBase bestMatch = null;
            int highestScore = 0;
            
            for (ChatbotKnowledgeBase kb : allKnowledge) {
                int score = calculateMatchScore(message, kb);
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = kb;
                }
            }
            
            if (bestMatch != null && highestScore > 0) {
                ChatbotResponse response = new ChatbotResponse(bestMatch.getAnswer());
                response.setQueryType("knowledge_base");
                
                // Add related suggestions
                List<String> suggestions = getRelatedSuggestions(bestMatch.getCategory());
                if (suggestions != null && !suggestions.isEmpty()) {
                    response.setSuggestions(suggestions);
                }
                
                return response;
            } else {
                // Default response
                String defaultMessage = "I'm here to help! I can assist you with:\n\n" +
                    "- **Patent Information**: Total patents, patents by state/city\n" +
                    "- **Payment & Subscriptions**: Plans, pricing, payment methods\n" +
                    "- **Dashboard Features**: Charts, filters, analytics\n" +
                    "- **Patent Filing**: How to file, track status\n" +
                    "- **Platform Help**: Navigation, features, support\n\n" +
                    "What would you like to know?";
                
                ChatbotResponse response = new ChatbotResponse(defaultMessage);
                response.setQueryType("general_help");
                response.setSuggestions(Arrays.asList(
                    "How many patents are there?",
                    "Show subscription plans",
                    "How do I file a patent?",
                    "What features are available?"
                ));
                return response;
            }
        } catch (Exception e) {
            // Return default help message on any error
            String errorMessage = "I'm here to help! I can assist you with:\n\n" +
                "- **Patent Information**: Total patents, patents by state/city\n" +
                "- **Payment & Subscriptions**: Plans, pricing, payment methods\n" +
                "- **Dashboard Features**: Charts, filters, analytics\n" +
                "- **Patent Filing**: How to file, track status\n" +
                "- **Platform Help**: Navigation, features, support\n\n" +
                "What would you like to know?";
            
            ChatbotResponse response = new ChatbotResponse(errorMessage);
            response.setQueryType("general_help");
            response.setSuggestions(Arrays.asList(
                "How many patents are there?",
                "Show subscription plans",
                "How do I file a patent?"
            ));
            return response;
        }
    }
    
    private int calculateMatchScore(String message, ChatbotKnowledgeBase kb) {
        if (kb == null || message == null || message.isEmpty()) {
            return 0;
        }
        
        int score = 0;
        String lowerMessage = message.toLowerCase();
        
        // Check if question matches
        if (kb.getQuestion() != null && lowerMessage.contains(kb.getQuestion().toLowerCase())) {
            score += 50;
        }
        
        // Check keywords
        if (kb.getKeywords() != null && kb.getKeywords().length > 0) {
            for (String keyword : kb.getKeywords()) {
                if (keyword != null && !keyword.isEmpty() && lowerMessage.contains(keyword.toLowerCase())) {
                    score += 10;
                }
            }
        }
        
        // Boost score by priority
        score += (kb.getPriority() != null ? kb.getPriority() : 0);
        
        return score;
    }
    
    private List<String> getRelatedSuggestions(String category) {
        try {
            if (category == null || category.isEmpty()) {
                return new ArrayList<>();
            }
            
            List<ChatbotKnowledgeBase> relatedKb = knowledgeBaseRepository.findByCategoryAndIsActiveTrue(category);
            
            if (relatedKb == null || relatedKb.isEmpty()) {
                return new ArrayList<>();
            }
            
            return relatedKb.stream()
                .filter(kb -> kb != null && kb.getQuestion() != null)
                .limit(3)
                .map(ChatbotKnowledgeBase::getQuestion)
                .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    private String extractStateName(String message) {
        if (message == null || message.isEmpty()) {
            return null;
        }
        
        // Common Indian states with variations
        Map<String, String[]> stateVariations = new HashMap<>();
        stateVariations.put("Maharashtra", new String[]{"maharashtra", "mh"});
        stateVariations.put("Karnataka", new String[]{"karnataka", "ka"});
        stateVariations.put("Tamil Nadu", new String[]{"tamil nadu", "tamilnadu", "tn"});
        stateVariations.put("Delhi", new String[]{"delhi", "new delhi", "dl"});
        stateVariations.put("Gujarat", new String[]{"gujarat", "gj"});
        stateVariations.put("West Bengal", new String[]{"west bengal", "westbengal", "bengal", "wb"});
        stateVariations.put("Rajasthan", new String[]{"rajasthan", "rj"});
        stateVariations.put("Uttar Pradesh", new String[]{"uttar pradesh", "uttarpradesh", "up"});
        stateVariations.put("Kerala", new String[]{"kerala", "kl"});
        stateVariations.put("Telangana", new String[]{"telangana", "ts"});
        stateVariations.put("Andhra Pradesh", new String[]{"andhra pradesh", "andhrapradesh", "ap"});
        stateVariations.put("Madhya Pradesh", new String[]{"madhya pradesh", "madhyapradesh", "mp"});
        stateVariations.put("Haryana", new String[]{"haryana", "hr"});
        stateVariations.put("Punjab", new String[]{"punjab", "pb"});
        stateVariations.put("Goa", new String[]{"goa", "ga"});
        stateVariations.put("Odisha", new String[]{"odisha", "orissa", "or"});
        stateVariations.put("Bihar", new String[]{"bihar", "br"});
        stateVariations.put("Assam", new String[]{"assam", "as"});
        stateVariations.put("Jharkhand", new String[]{"jharkhand", "jh"});
        stateVariations.put("Chhattisgarh", new String[]{"chhattisgarh", "chattisgarh", "cg"});
        
        String lowerMessage = message.toLowerCase();
        
        for (Map.Entry<String, String[]> entry : stateVariations.entrySet()) {
            for (String variation : entry.getValue()) {
                if (lowerMessage.contains(variation)) {
                    return entry.getKey();
                }
            }
        }
        
        return null;
    }
    
    private String extractCityName(String message) {
        if (message == null || message.isEmpty()) {
            return null;
        }
        
        // Common Indian cities with variations
        Map<String, String[]> cityVariations = new HashMap<>();
        cityVariations.put("Mumbai", new String[]{"mumbai", "bombay"});
        cityVariations.put("Bangalore", new String[]{"bangalore", "bengaluru"});
        cityVariations.put("Delhi", new String[]{"delhi", "new delhi"});
        cityVariations.put("Hyderabad", new String[]{"hyderabad", "hyd"});
        cityVariations.put("Chennai", new String[]{"chennai", "madras"});
        cityVariations.put("Kolkata", new String[]{"kolkata", "calcutta"});
        cityVariations.put("Pune", new String[]{"pune", "poona"});
        cityVariations.put("Ahmedabad", new String[]{"ahmedabad", "amdavad"});
        cityVariations.put("Surat", new String[]{"surat"});
        cityVariations.put("Jaipur", new String[]{"jaipur"});
        cityVariations.put("Lucknow", new String[]{"lucknow"});
        cityVariations.put("Kanpur", new String[]{"kanpur", "cawnpore"});
        cityVariations.put("Nagpur", new String[]{"nagpur"});
        cityVariations.put("Indore", new String[]{"indore"});
        cityVariations.put("Thane", new String[]{"thane"});
        cityVariations.put("Bhopal", new String[]{"bhopal"});
        cityVariations.put("Visakhapatnam", new String[]{"visakhapatnam", "vizag", "vishakhapatnam"});
        cityVariations.put("Kochi", new String[]{"kochi", "cochin"});
        cityVariations.put("Gurgaon", new String[]{"gurgaon", "gurugram"});
        cityVariations.put("Noida", new String[]{"noida"});
        
        String lowerMessage = message.toLowerCase();
        
        for (Map.Entry<String, String[]> entry : cityVariations.entrySet()) {
            for (String variation : entry.getValue()) {
                if (lowerMessage.contains(variation)) {
                    return entry.getKey();
                }
            }
        }
        
        return null;
    }
    
    private void saveConversation(ChatbotRequest request, ChatbotResponse response) {
        try {
            ChatbotConversation conversation = new ChatbotConversation();
            conversation.setUserId(request.getUserId());
            conversation.setSessionId(request.getSessionId());
            conversation.setUserMessage(request.getMessage());
            conversation.setBotResponse(response.getMessage());
            conversation.setQueryType(response.getQueryType());
            
            // Save metadata as JSON string if data is present
            if (response.getData() != null) {
                // Simple JSON conversion (you can use Jackson or Gson for complex objects)
                conversation.setMetadata(response.getData().toString());
            }
            
            conversationRepository.save(conversation);
        } catch (Exception e) {
            // Log error but don't fail the response
            System.err.println("Error saving conversation: " + e.getMessage());
        }
    }
    
    public List<ChatbotConversation> getConversationHistory(String userId) {
        return conversationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<ChatbotConversation> getSessionHistory(String sessionId) {
        return conversationRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }
}
