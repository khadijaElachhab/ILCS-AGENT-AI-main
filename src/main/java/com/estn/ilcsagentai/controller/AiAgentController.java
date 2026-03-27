package com.estn.ilcsagentai.controller;

import com.estn.ilcsagentai.agents.AiAgent;
import com.estn.ilcsagentai.rag.RagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;


@RestController
@CrossOrigin("*")
public class AiAgentController {
    @Autowired
    private AiAgent aiAgent;
    @Autowired
    private RagService indexor;


    @GetMapping(value = "/askAgent", produces = MediaType.TEXT_PLAIN_VALUE)
    public Flux<String> askAgent(@RequestParam(name = "question", defaultValue = "Bonjour") String question) {
        return aiAgent.onQuestion(question);
    }


    @PostMapping(value = "/loadFile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public  void loadFile(@RequestPart("file")MultipartFile file){

        indexor.loadFile(file);
    }
}
