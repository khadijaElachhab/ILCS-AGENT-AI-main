import {Component, NgZone} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpDownloadProgressEvent, HttpEventType, HttpProgressEvent} from '@angular/common/http';
import {MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    MarkdownComponent
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  question: string="";
  reponse : any;
  progress:boolean=false;
  
  isRecording: boolean = false;
  recognition: any;
  isSpeaking: boolean = false;
  currentUtterance: any = null;

  constructor(private http: HttpClient, private zone: NgZone) {
    this.initSpeechRecognition();
  }

  mediaRecorder: any;
  audioChunks: any[] = [];

  // --- Implémentation Audio (Client-side Web Speech API) ---
  initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fr-FR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.zone.run(() => {
          this.isRecording = true;
          this.question = "";
        });
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.zone.run(() => {
          this.question = transcript;
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        this.zone.run(() => {
          this.isRecording = false;
        });
      };

      this.recognition.onend = () => {
        this.zone.run(() => {
          this.isRecording = false;
        });
      };
    } else {
      console.warn("L'API Web Speech (SpeechRecognition) n'est pas supportée par ce navigateur.");
    }
  }

  async startSpeechRecognition() {
    if (!this.recognition) {
       alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
       return;
    }
    
    if (this.isRecording) {
      this.recognition.stop();
      return;
    }

    try {
      this.recognition.start();
    } catch (err) {
      console.error('Erreur au démarrage de la reconnaissance:', err);
    }
  }

  speakResponse() {
    if (!('speechSynthesis' in window) || !this.reponse) {
      console.warn("Speech Synthesis n'est pas supporté ou il n'y a pas de texte à lire.");
      return;
    }

    // Si déjà en cours de lecture, arrêter
    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.zone.run(() => {
        this.isSpeaking = false;
        this.currentUtterance = null;
      });
      console.log('Lecture vocale arrêtée');
      return;
    }

    // Démarrer la lecture
    try {
      // Nettoyer partiellement le markdown pour que la voix lise du texte brut
      let cleanText = this.reponse.replace(/#+\s/g, '').replace(/\*\*/g, '').replace(/`/g, '');
      
      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance.lang = 'fr-FR';
      
      // Gérer les événements
      this.currentUtterance.onstart = () => {
        this.zone.run(() => {
          this.isSpeaking = true;
        });
        console.log('Début de la lecture vocale');
      };
      
      this.currentUtterance.onend = () => {
        this.zone.run(() => {
          this.isSpeaking = false;
          this.currentUtterance = null;
        });
        console.log('Fin de la lecture vocale');
      };
      
      this.currentUtterance.onerror = (event: any) => {
        console.error('Erreur lors de la lecture vocale:', event.error);
        this.zone.run(() => {
          this.isSpeaking = false;
          this.currentUtterance = null;
        });
      };
      
      window.speechSynthesis.speak(this.currentUtterance);
    } catch (error) {
      console.error('Erreur lors de la préparation de la lecture vocale:', error);
      this.zone.run(() => {
        this.isSpeaking = false;
        this.currentUtterance = null;
      });
    }
  }
  askAgent() {
    this.reponse="";
    this.progress=true;
    this.http
      .get("http://localhost:8080/askAgent?question="+this.question
      ,{responseType:'text',
        observe:"events",reportProgress:true})
      .subscribe({
        next:resp=>{
          if(resp.type=== HttpEventType.DownloadProgress){
            this.reponse=(resp as HttpDownloadProgressEvent).partialText;
          }

        },
        error:err => {
          console.log(err);
        },
        complete:()=>{
          this.progress=false;
        }
      })
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const formData = new FormData();
    if(input.files && input.files[0]){
      formData.append('file', input.files[0]);
      this.progress=true;
      this.http
        .post("http://localhost:8080/loadFile",formData).subscribe(
        {
          next : () =>console.log("Fichier charger avec success"),
          error : err => console.log(err),
          complete : () => {
            this.progress=false;
          }
        }
      )
    }
  }
}
