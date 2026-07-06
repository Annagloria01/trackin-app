🚀 TrackIn: Candidature Tracking App

TrackIn è un'applicazione web full-stack sviluppata per gestire e monitorare in modo efficiente il proprio percorso di ricerca lavorativa. Il progetto nasce con l'obiettivo di centralizzare il tracking delle candidature, permettendo di organizzare ogni step del processo di selezione.

🛠️ Tecnologie Utilizzate
Il progetto segue un'architettura Monorepo per mantenere sincronizzati il front-end e il back-end.

Backend
Java 17+

Spring Boot: per la creazione delle API REST.

Spring Data JPA: per la gestione della persistenza dei dati.

H2 Database: database relazionale in-file per la persistenza dei dati in locale.

Frontend
React

Vite: per un ambiente di sviluppo rapido e leggero.

CSS3: per uno stile pulito e moderno.

🏗️ Struttura del Progetto
Plaintext
trackin-app/
├── backend/       # API REST con Spring Boot
└── frontend/      # Interfaccia utente con React
🚀 Come avviare il progetto
Per far girare l'applicazione in locale, segui questi passaggi:

1. Prerequisiti
Assicurati di avere installato Java JDK 17+.

Assicurati di avere installato Node.js e npm.

2. Avvio Backend
Spostati nella cartella backend: cd backend

Avvia l'applicazione: ./mvnw spring-boot:run

Il server sarà disponibile su http://localhost:8080.

3. Avvio Frontend
Apri un nuovo terminale e spostati in frontend: cd frontend

Installa le dipendenze: npm install

Avvia il server di sviluppo: npm run dev

L'app sarà disponibile su http://localhost:5173.

🚧 Stato del Progetto
Il progetto è attualmente in fase di sviluppo attivo.

[x] Configurazione base Architettura Monorepo.

[x] Setup Backend API & Database.

[ ] Completamento UI Frontend.

[ ] Integrazione feature di filtraggio candidature.

💡 Contatti
Progetto sviluppato da Annagloria. Se hai suggerimenti o vuoi contribuire, sentiti libero di aprire una Issue o una Pull Request!
