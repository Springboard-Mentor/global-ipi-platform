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
        
        // Save conversation history
        saveConversation(request, response);
        
        return response;
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
            String stateName = extractStateName(message);
            
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
            response.setSuggestions(suggestions);
            
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
            response.setSuggestions(Arrays.asList(
                "How many patents are there?",
                "Show subscription plans",
                "How do I file a patent?",
                "What features are available?"
            ));
            return response;
        }
    }
    
    private int calculateMatchScore(String message, ChatbotKnowledgeBase kb) {
        int score = 0;
        String lowerMessage = message.toLowerCase();
        
        // Check if question matches
        if (lowerMessage.contains(kb.getQuestion().toLowerCase())) {
            score += 50;
        }
        
        // Check keywords
        if (kb.getKeywords() != null) {
            for (String keyword : kb.getKeywords()) {
                if (lowerMessage.contains(keyword.toLowerCase())) {
                    score += 10;
                }
            }
        }
        
        // Boost score by priority
        score += (kb.getPriority() != null ? kb.getPriority() : 0);
        
        return score;
    }
    
    private List<String> getRelatedSuggestions(String category) {
        List<ChatbotKnowledgeBase> relatedKb = knowledgeBaseRepository.findByCategoryAndIsActiveTrue(category);
        
        return relatedKb.stream()
            .limit(3)
            .map(ChatbotKnowledgeBase::getQuestion)
            .collect(Collectors.toList());
    }
    
    private String extractStateName(String message) {
        // Common Indian states
        String[] states = {
            "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", 
            "West Bengal", "Rajasthan", "Uttar Pradesh", "Kerala", "Telangana",
            "Andhra Pradesh", "Madhya Pradesh", "Haryana", "Punjab", "Goa"
        };
        
        for (String state : states) {
            if (message.toLowerCase().contains(state.toLowerCase())) {
                return state;
            }
        }
        return null;
    }
    
    private String extractCityName(String message) {
        // Common Indian cities
        String[] cities = {
            "Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai", "Kolkata",
            "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur",
            "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Kochi"
        };
        
        for (String city : cities) {
            if (message.toLowerCase().contains(city.toLowerCase())) {
                return city;
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
