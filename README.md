# Memento Mori 🏛️🛡️

> **National-Level Top Performer Winner** — *NEOFUTURE Hackathon 2026 (Open Innovation Track, technically sponsored by IEEE Maharashtra Section).*

Memento Mori is an automated, decentralized digital estate and inheritance protocol. It bridges fragmented digital assets—including cloud storage (Google Drive), financial credentials, and private data—into a secure, zero-trust framework that safely transfers ownership or purges sensitive data post-mortem.

---

## ⚡ Core Architecture & Features

* **Cryptographic Dead Man's Switch:** Uses a sliding-window heartbeat monitor. If a user check-in lapses, the protocol safely transitions into a Critical Verification State.
* **$k$-out-$n$ Consensus Trust Model:** Eliminates single points of failure by requiring a verified $2/3$ majority cryptographic signature from pre-designated "Trustees" before execution triggers.
* **Automated Asset Triage & Privacy Purge:** Leverages scoped OAuth 2.0 API integrations to execute dual-action workflows—handing over whitelisted legacy assets while executing a high-speed secure batch-delete for sensitive "Void" folders.
* **Client-Side Zero-Knowledge Philosophy:** Metadata handling ensures raw user secrets remain private and protected from central server exposure.
* **Cinematic Real-Time Interface:** Features a reactive dashboard with a time-dilation testing mode and terminal-based transparency logs.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
* **Language:** TypeScript (Strict Mode)
* **Styling & UI:** Tailwind CSS, Framer Motion
* **Authentication & Database:** NextAuth.js, Firebase (Firestore) / Supabase
* **APIs:** Google Drive API, Resend Email Protocol

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/memento-mori.git](https://github.com/your-username/memento-mori.git)
cd memento-mori
2. Install dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env.local file in the root directory and add your project credentials:

Code snippet
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
4. Run the development server
Bash
npm run dev
Open http://localhost:3000 to view the application in your browser.

🏆 Acknowledgments
Developed during the NEOFUTURE Hackathon 2026 by Team Hugs for Bugs. Built under high-pressure conditions with strict zero-error production standards.
