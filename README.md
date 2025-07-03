# 🧠 psychotherapist.ai

> **Product Engineering Assignment Submission**  
> *A demonstration of full-stack development, AI integration, and product thinking*

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-92.8%25-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Demo Mode](https://img.shields.io/badge/Demo-Live-success)](http://localhost:3000)

An intelligent AI-powered therapist matching platform that connects individuals with mental health professionals based on their unique needs, preferences, and circumstances. Built as a product engineering showcase demonstrating modern web development, AI integration, and thoughtful UX design.

---

## 📋 **Assignment Context**

This project was developed as a **product engineering assignment submission** to demonstrate:

- **Full-stack development capabilities** with modern technologies
- **AI integration and prompt engineering** using Groq API
- **Product thinking and user experience design**
- **Problem-solving and architectural decisions**
- **Code quality and documentation standards**

**Note**: This represents a focused implementation showcasing core functionality and technical proficiency within assignment constraints.

---

## 🎯 **Product Overview**

### **The Problem**
Finding the right therapist is often overwhelming, with limited filtering options and no personalized matching based on individual needs, cultural background, or specific mental health concerns.

### **The Solution**
An AI-powered platform that uses intelligent questionnaires and machine learning to match users with therapists who best fit their unique circumstances, preferences, and therapeutic needs.

### **Key Value Propositions**
- 🎯 **Personalized Matching**: AI-driven recommendations based on 15+ criteria
- 🌍 **Cultural Sensitivity**: Matching based on cultural background and language preferences  
- 🌈 **Inclusive Care**: Specialized support for LGBTQ+ community
- 📊 **Data-Driven**: Smart algorithms analyze user inputs for optimal matches
- ⚡ **Instant Results**: Get matched immediately with detailed therapist profiles

---

## ✨ **Features Implemented**

### **🤖 AI-Powered Matching Engine**
- Intelligent analysis of user responses using Groq's LLaMA models
- Keyword-based matching for mental health conditions
- Cultural and demographic preference weighting
- Specialized matching for LGBTQ+ affirming care

### **📝 Comprehensive Questionnaire System**
- 15+ data points collected for accurate matching
- Progressive disclosure to reduce form abandonment
- Real-time validation and user feedback
- localStorage persistence for demo mode

### **👥 Detailed Therapist Profiles**
- Comprehensive therapist information display
- Specializations, approaches, and availability
- Cultural background and language capabilities
- Review system and rating display

### **🔐 Demo-First Authentication**
- **Demo Mode**: Fully functional without API keys
- Realistic demo responses and data
- localStorage-based session management
- Magic link authentication (when configured)

### **🎨 Modern UI/UX**
- Responsive design with Tailwind CSS
- Beautiful gradient backgrounds and animations
- shadcn/ui component library
- Accessibility-focused design patterns

---

## 🏗️ **Technical Architecture**

### **Frontend**
- **Next.js 15.1.4** with App Router
- **React 19** with modern hooks and patterns
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for responsive styling
- **shadcn/ui** for consistent component library

### **AI Integration**
- **Groq API** for fast LLM inference
- Custom prompt engineering for therapist matching
- Fallback demo responses for seamless experience
- Intelligent keyword and semantic matching

### **Data & State Management**
- **Supabase** for authentication and database (configurable)
- **localStorage** for demo mode persistence
- React useState/useEffect for local state
- Form validation and error handling

### **Development & Deployment**
- **Turbopack** for fast development builds
- **ESLint** for code quality
- **Git** for version control
- **Vercel-ready** deployment configuration

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Quick Start (Demo Mode)**
```bash
# Clone the repository
git clone https://github.com/moghalsaif/psychotherapist.ai.git
cd psychotherapist.ai

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

**🎉 That's it!** The app runs in demo mode by default - no API keys required.

### **Production Setup (Optional)**
For full functionality with real data:

```bash
# Create environment file
cp .env.example .env.local

# Add your API keys
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

---

## 📁 **Project Structure**

```
psychotherapist.ai/
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page and main app logic
│   └── globals.css              # Global styles and animations
├── components/                   # React components
│   ├── Auth.tsx                 # Authentication component
│   ├── Questionnaire.tsx        # User questionnaire form
│   ├── TherapistMatcher.tsx     # AI matching and results
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utilities and configuration
│   ├── supabaseClient.tsx       # Supabase setup with demo fallback
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

---

## 🎮 **Demo Features**

Since this is a demo submission, the app includes realistic mock data:

### **Demo Therapists**
- **Dr. Sarah Johnson** - Anxiety and LGBTQ+ specialist
- **Dr. Michael Chen** - CBT and cultural therapy expert  
- **Dr. Emily Rodriguez** - Bilingual family therapy specialist

### **Demo Matching Logic**
- Keyword-based matching (anxiety → anxiety specialists)
- Cultural preference matching
- LGBTQ+ identity consideration
- Location-based filtering
- Insurance and budget constraints

### **Demo Data Persistence**
- User profiles saved to localStorage
- Session state maintained across refreshes
- Realistic user flow with progress tracking

---

## 🔧 **Technical Decisions & Trade-offs**

### **Why Demo-First Approach?**
- **Immediate showcasing**: Anyone can try the app instantly
- **Reduced barriers**: No API key setup required for evaluation
- **Realistic experience**: Demo data mirrors real functionality
- **Development speed**: Faster iteration without external dependencies

### **Technology Choices**
- **Next.js 15**: Latest features, excellent DX, Vercel-optimized
- **TypeScript**: Type safety crucial for complex user data
- **Tailwind**: Rapid UI development, consistent design system
- **Groq**: Fast inference for real-time matching experience
- **Supabase**: Full-stack solution with great DX

### **Performance Optimizations**
- Dynamic imports for code splitting
- Optimized hydration handling
- Efficient re-renders with proper React patterns
- Image optimization ready for production

---

## 🚧 **Future Enhancements**

*Ideas for continued development:*

### **Core Features**
- [ ] Video consultation booking system
- [ ] Real-time chat with therapists
- [ ] Insurance verification and billing
- [ ] Advanced filtering and search
- [ ] Therapist availability calendar

### **AI Improvements**
- [ ] More sophisticated matching algorithms
- [ ] Natural language processing for better understanding
- [ ] Sentiment analysis of user inputs
- [ ] Continuous learning from user feedback

### **Platform Features**
- [ ] Mobile app development
- [ ] Therapist onboarding portal
- [ ] Admin dashboard and analytics
- [ ] Multi-language support
- [ ] API for third-party integrations

---

## 🎨 **Design Philosophy**

### **User-Centered Design**
- **Reduce friction**: Minimal steps to get matched
- **Build trust**: Clear information about therapists
- **Respect privacy**: Transparent data handling
- **Inclusive design**: Accessible to all users

### **Technical Excellence**
- **Clean code**: Readable, maintainable, well-documented
- **Type safety**: Comprehensive TypeScript usage
- **Performance**: Fast loading, smooth interactions
- **Scalability**: Architecture supports growth

---

## 📊 **Assignment Deliverables**

### **✅ Completed**
- [x] Full-stack web application
- [x] AI integration for matching
- [x] Responsive, modern UI
- [x] Demo mode for easy evaluation
- [x] Clean, documented codebase
- [x] Git history showing development process
- [x] Production-ready deployment setup

### **📈 Metrics & Success Criteria**
- **Technical**: TypeScript coverage 92.8%, zero compilation errors
- **Functionality**: Complete user flow from landing to matching
- **UX**: Intuitive interface, clear value proposition
- **Code Quality**: ESLint compliance, proper component structure

---

## 🛠️ **Development Commands**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production  
npm run start            # Start production server
npm run lint             # Run ESLint

# Deployment
npm run deploy           # Deploy to Vercel
```

---

## 📞 **Contact & Submission**

**Developer**: Moghal Saif Aliullah  
**Email**: [moghalsaif@gmail.com](mailto:moghalsaif@gmail.com)  
**GitHub**: [@moghalsaif](https://github.com/moghalsaif)  
**Live Demo**: [psychotherapist.ai](https://psychotherapist.ai)

### **For Evaluation**
- **Repository**: All code available for review
- **Demo Ready**: No setup required - runs immediately
- **Documentation**: Comprehensive README and code comments
- **Responsive**: Works on desktop, tablet, and mobile

---

## 📄 **License**

MIT License - Created as a product engineering assignment submission.

---

*Built with ❤️ and modern web technologies to showcase product engineering capabilities.*
