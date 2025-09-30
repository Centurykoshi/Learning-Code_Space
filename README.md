# getOkay - Mental Wellness Platform

Website : https://get-okay.vercel.app/

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.0-blue" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5.0-2D3748" alt="Prisma" />
</div>

## 🌟 Overview

**getOkay** is a comprehensive mental wellness platform designed to support your mental health journey through innovative tools and personalized experiences. The platform combines AI-powered therapy, mood and peace tracking, therapeutic games, and mindful typing all in one place.

## ✨ Features

### 🤖 AI-Powered Therapy Chatbot
- **24/7 Availability:** Instant support anytime you need it
- **Intelligent Conversations:** AI-driven therapeutic discussions
- **Personalized Responses:** Guidance tailored to your needs
- **Safe Space:** Confidential, judgment-free environment

### 🧘‍♀️ Peace & Mood Tracking
- **Daily Mood Logging:** Track your emotional state over time
- **Visual Analytics:** Charts and insights for better understanding
- **Mindfulness Exercises:** Guided meditation and breathing
- **Progress Monitoring:** Observe your wellness journey

### 🎮 Therapeutic Games
- **Stress Relief:** Interactive activities to reduce anxiety
- **Focus Enhancement:** Games to improve concentration
- **Mood Boosting:** Fun activities to lift your spirits
- **Progress Tracking:** Monitor your engagement

### ⌨️ Mindful Typing
- **Concentration Practice:** Improve focus through typing
- **Stress Reduction:** Rhythmic typing for relaxation
- **Skill Development:** Enhance speed and accuracy
- **Mindfulness Integration:** Combine typing with meditation

### 📊 Personal Dashboard
- **Activity Overview:** All your wellness activities at a glance
- **Progress Stats:** Track streaks, sessions, and improvements
- **Quick Access:** Easy navigation to all features
- **Recent Activity:** Keep track of your latest sessions

## 🚀 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM with PostgreSQL
- **Authentication:** Custom system
- **API:** tRPC for type-safe APIs
- **AI:** Google Gemini AI for chatbot

## 📱 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── Chatbot/           # AI therapy chatbot
│   ├── Peace/             # Mood tracking and mindfulness
│   ├── Games/             # Therapeutic games
│   ├── dashboard/         # User dashboard
│   ├── auth-redirect/     # Authentication handling
│   └── ...
├── components/            # Reusable UI components
│   ├── TypingComponent/   # Mindful typing
│   ├── ui/               # Base UI components
│   └── ...
├── ChatbotComponents/     # Chatbot-specific
├── PeaceComponents/       # Mood tracking
├── lib/                   # Utilities
├── hooks/                 # Custom React hooks
├── trpc/                  # tRPC setup
└── types/                 # TypeScript types
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Centurykoshi/getOkay.git
   cd getOkay
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_SECRET="your-secret-key"
   GEMINI_API_KEY="your-google-gemini-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Models

- **User:** User accounts and profiles
- **Chat:** Chatbot conversation history
- **Mood:** Daily mood tracking
- **Activity:** User activity logs
- **Profile:** Extended user info

## 🎨 Design Philosophy

- **User-Centric:** Designed for mental wellness
- **Accessibility:** Usable by everyone
- **Privacy:** Protecting user data
- **Evidence-Based:** Grounded in therapeutic techniques
- **Continuous Improvement:** Updated based on feedback

## 🤝 Contributing

We welcome contributions! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Made with ❤️ for mental wellness</strong>
  <br />
  <a href="https://getokay.com">getOkay.com</a>
</div>
