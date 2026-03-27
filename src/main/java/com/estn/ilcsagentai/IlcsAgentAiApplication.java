package com.estn.ilcsagentai;

import org.springframework.ai.mistralai.MistralAiEmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;

@SpringBootApplication
public class IlcsAgentAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(IlcsAgentAiApplication.class, args);
    }


    @Bean
    public SimpleVectorStore getVectorStore (MistralAiEmbeddingModel embeddingModel){
        SimpleVectorStore vectorStore = SimpleVectorStore.builder(embeddingModel).build();
        return vectorStore;
    }

    @Bean
    public ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .maxMessages(10)
                .build();
    }
}
