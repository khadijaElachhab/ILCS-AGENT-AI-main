# ILCS-AGENT-AI : Assistant Intelligent Hybride

Ce projet est un assistant intelligent capable de traiter des documents PDF via le RAG (Retrieval-Augmented Generation) et d'interagir par la voix.

## Architecture Technique

### 1. Gestion des Documents (RAG - Retrieval-Augmented Generation)
La fonctionnalité de lecture et d'interrogation de fichiers PDF est implémentée dans le **Backend (Spring Boot)** :
*   **Spring AI** : Framework principal pour l'intégration de l'intelligence artificielle.
*   **Modèle LLM** : Utilisation de **Mistral AI** pour le chat et la génération de réponses.
*   **Vector Store** : Utilisation d'un `SimpleVectorStore` local (stocké dans `store.json`) pour l'indexation.
*   **Ingestion des fichiers** : 
    *   `PagePdfDocumentReader` : Pour lire le contenu des fichiers PDF page par page.
    *   `TokenTextSplitter` : Pour découper le texte en segments (chunks) optimisés pour le prompt.
    *   `QuestionAnswerAdvisor` : Intercepteur de ChatClient qui récupère automatiquement les segments pertinents du Vector Store avant d'envoyer la question au LLM.

### 2. Fonctionnalités Audio (Speech-to-Text & Text-to-Speech)
Les options "Parler" et "Écouter" sont gérées entièrement dans le **Frontend (Angular)** via les API natives du Web :
*   **Parler (Reconnaissance Vocale)** : Utilisation de l'interface `SpeechRecognition` de l'**API Web Speech**. Elle transforme la voix captée par le micro en texte directement dans le navigateur.
*   **Écouter (Synthèse Vocale)** : Utilisation de l'interface `SpeechSynthesis` de l'**API Web Speech**. Elle lit la réponse texte de l'IA à haute voix, après un nettoyage des caractères Markdown pour une prononciation plus naturelle.

## Technologies Utilisées
*   **Backend** : Spring Boot 3.5.11, Spring AI, Mistral AI, JPA/H2 (pour la structure), Maven.
*   **Frontend** : Angular (version 19), HttpClient (Streaming pour le chat), Web Speech API.
