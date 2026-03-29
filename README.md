# DaBubble – Real-Time Chat Platform

DaBubble is a professional real-time chat platform (similar to Slack) with **channel-based communication** and **direct messaging**. This project was developed as part of a personal/academic project, focusing on clean code, modular architecture, and real-time interaction using Firebase.

---

🚀 **Core Features**

**Channel-Based Communication**
- **Public & Private Channels:** Join or create topic-based channels for group discussions.
- **Real-Time Messaging:** Messages appear instantly for all channel participants.
- **Channel Management:** Edit channel names, manage members, and organize conversations.

**Direct Messaging**
- **One-to-One Chat:** Send private messages to other users.
- **Real-Time Sync:** Messages update instantly across all devices and sessions.

**User & Profile Management**
- **Authentication:** Secure user registration and login using Firebase Auth.
- **Profile Management:** Update username, avatar, and status in real time.

**API Integration**
- **Message & Profile API:** Centralized API to handle sending, editing, and deleting messages, as well as profile updates.

---

🛠️ **Tech Stack**
- **Frontend:** Angular | TypeScript | HTML | CSS
- **Backend & Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Version Control:** Git & GitHub

---

👨‍💻 **My Technical Contribution**
As the lead developer, I focused on the **real-time chat engine** and application architecture:

- **Real-Time Messaging Logic:** Integrated Firebase listeners for instant updates across channels and direct messages.
- **Channel Management:** Developed the logic for creating, joining, and updating channels with permission control.
- **API Implementation:** Designed endpoints and services for message CRUD operations and profile management.
- **Responsive UI:** Built an Angular SPA optimized for desktop and mobile devices.

---

👥 **Development Team**
- **Hanbit Chang:** Implemented the **channel system and direct messaging**, ensuring users can create, join, and communicate in real time.  
- **Saskia Richter:** Developed **profile management**, allowing users to update their username, avatar, and status seamlessly.  
- **Jörg Habermann:** Handled **administration features**, including user roles, permissions, and managing channel settings.

---

⚙️ **Installation & Usage**
1. **Clone the repository:**

git clone https://github.com/YOUR_USERNAME/dabubble.git

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
