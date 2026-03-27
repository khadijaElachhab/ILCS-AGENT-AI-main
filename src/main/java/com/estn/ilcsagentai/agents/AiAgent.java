package com.estn.ilcsagentai.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class AiAgent {
    private ChatClient chatClient;

    public AiAgent(ChatClient.Builder chatClient,
                   ChatMemory memory,
                   SimpleVectorStore vectorStore) {
        this.chatClient = chatClient
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(memory).build())
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .defaultAdvisors(QuestionAnswerAdvisor.builder(vectorStore).build())
                .build();
    }


    public Flux<String> onQuestion(String question) {
        return chatClient.prompt()
                .user(question)
                .stream()
                .content();

    }
}
