package com.estn.ilcsagentai.rag;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.util.List;


@Component
public class RagService {

    @Value("store.json")
    private String fileStore;
    @Autowired
    private  SimpleVectorStore vectorStore;

    public void loadFile (MultipartFile pdfFile) {
        Path path = Path.of("src", "main", "resources", "store");
            File file = new File(path.toFile(), fileStore);

            if (file.exists() && file.length() > 0) {
                vectorStore.load(file);
            }
            PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(pdfFile.getResource());
            List<Document> documents = pdfReader.get();
            TextSplitter textSplitter = new TokenTextSplitter();
            List<Document> chunks = textSplitter.apply(documents);
            vectorStore.add(chunks);
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            vectorStore.save(file);

    }
}
