# psychotherapist.ai

An AI-powered therapist matching platform that connects individuals with mental health professionals based on their unique needs and preferences.

🔗 **[Visit the App](https://moghalsaif.github.io/psychotherapist.ai/)**

## Features

- 🧠 **Personalized Matching**: Get matched with therapists based on your mental health needs, preferences, and location
- 🤖 **AI-Powered Recommendations**: Uses Groq's AI to analyze your input and suggest the best therapists
- 👤 **Detailed Therapist Profiles**: View comprehensive information about therapists, including specialties and availability
- 📝 **Smart Onboarding**: Detailed questionnaire to understand your specific needs
- 🌍 **Cultural Matching**: Find therapists who understand your cultural background
- 🌈 **LGBTQ+ Affirming**: Connect with therapists specializing in LGBTQ+ mental health support
- ⭐ **Reviews & Ratings**: Make informed decisions with user reviews
- 🔑 **Seamless Authentication**: Easy sign-up process with magic link authentication

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI**: Groq API
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/psychotherapist.ai.git
cd psychotherapist.ai
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a \`.env.local\` file in the root directory with the following variables:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The easiest way to deploy this application is through [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import your project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Database Setup

The application requires the following tables in your Supabase database:

1. `profiles` - Stores user profile information
2. `therapists` - Stores therapist information

Refer to the schema definitions in the codebase for detailed structure.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this code for your own projects.

## Support

For support, email support@psychotherapist.ai or open an issue in this repository.
