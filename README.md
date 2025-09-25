# getOkay - Mental Wellness Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.0-blue" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5.0-2D3748" alt="Prisma" />
</div>

## 🌟 Overview

**getOkay** is a comprehensive mental wellness platform designed to support your mental health journey through innovative tools and personalized experiences. Our platform combines AI-powered therapy, mood tracking, mindfulness exercises, and interactive activities to create a holistic approach to mental wellness.

## ✨ Features

### 🤖 AI-Powered Therapy Chatbot
- **24/7 Availability**: Get instant support whenever you need it
- **Intelligent Conversations**: AI-driven therapeutic conversations
- **Personalized Responses**: Tailored guidance based on your needs
- **Safe Space**: Confidential and judgment-free environment

### 🧘‍♀️ Peace & Mood Tracking
- **Daily Mood Logging**: Track your emotional state over time
- **Visual Analytics**: Beautiful charts and insights
- **Mindfulness Exercises**: Guided meditation and breathing exercises
- **Progress Monitoring**: See your mental wellness journey unfold

### 🎮 Therapeutic Games
- **Stress Relief Games**: Interactive activities to reduce anxiety
- **Focus Enhancement**: Games designed to improve concentration
- **Mood Boosting**: Fun activities to lift your spirits
- **Progress Tracking**: Monitor your engagement and improvements

### ⌨️ Mindful Typing
- **Concentration Practice**: Improve focus through typing exercises
- **Stress Reduction**: Rhythmic typing for relaxation
- **Skill Development**: Enhance typing speed and accuracy
- **Mindfulness Integration**: Combine typing with meditation techniques

### 📊 Personal Dashboard
- **Activity Overview**: See all your wellness activities at a glance
- **Progress Stats**: Track your streaks, sessions, and improvements
- **Quick Access**: Easy navigation to all features
- **Recent Activity**: Keep track of your latest sessions

## 🚀 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Custom auth system
- **API**: tRPC for type-safe APIs
- **AI Integration**: Google Gemini AI for chatbot functionality

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
│   ├── TypingComponent/   # Mindful typing functionality
│   ├── ui/               # Base UI components
│   └── ...
├── ChatbotComponents/     # Chatbot-specific components
├── PeaceComponents/       # Mood tracking components
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
├── trpc/                  # tRPC setup and routers
└── types/                 # TypeScript type definitions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Centurykoshi/Learning-Code_Space.git
cd Learning-Code_Space
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

## 🗄️ Database Schema

The application uses Prisma with the following main models:
- **User**: User accounts and profiles
- **Chat**: Chatbot conversation history
- **Mood**: Daily mood tracking entries
- **Activity**: User activity logs
- **Profile**: Extended user profile information

## 🎨 Design Philosophy

getOkay is built with a focus on:
- **User-Centric Design**: Every feature is designed with the user's mental wellness in mind
- **Accessibility**: Ensuring the platform is usable by everyone
- **Privacy**: Protecting user data and maintaining confidentiality
- **Evidence-Based**: Features are based on proven therapeutic techniques
- **Continuous Improvement**: Regular updates based on user feedback

## 🤝 Contributing

We welcome contributions! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:
- 📧 Email: support@getokay.com
- 💬 Discord: [Join our community](https://discord.gg/getokay)
- 📖 Documentation: [docs.getokay.com](https://docs.getokay.com)

## 🙏 Acknowledgments

- Google Gemini AI for powering our chatbot
- The mental health community for inspiration and guidance
- All contributors who help make mental wellness accessible
- Open source libraries that make this project possible

---

<div align="center">
  <strong>Made with ❤️ for mental wellness</strong>
  <br />
  <a href="https://getokay.com">getOkay.com</a>
</div>
