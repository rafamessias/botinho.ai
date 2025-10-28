# botinho.ai - WhatsApp AI Automation Platform

<div align="center">
  <img src="public/opineeo-logo.png" alt="botinho.ai Logo" width="120" height="120" />
  
  <h3>Your friendly WhatsApp assistant — powered by AI</h3>
  
  <p>Automate your customer support and never miss a message again. Perfect for restaurants, shops, and service businesses.</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748)](https://prisma.io/)
  [![Stripe](https://img.shields.io/badge/Stripe-18.5.0-635BFF)](https://stripe.com/)
</div>

## 🚀 Overview

**botinho.ai** is a comprehensive WhatsApp AI automation platform that helps businesses automate their customer support through intelligent AI-powered conversations. The platform connects to WhatsApp Business and handles customer conversations with context-aware responses trained on business-specific data.

### Key Features

- **🤖 AI-Powered Responses**: 24/7 intelligent, context-aware responses trained on your business data
- **📚 Smart Learning**: Train the bot with FAQs, promotions, and past conversations to match your brand voice
- **⚡ Instant Response**: Reduce response time from hours to seconds
- **📈 Boost Sales**: Never lose a customer due to slow responses
- **👥 Human Handoff**: Seamlessly transfer complex conversations to your team when needed
- **🔧 Easy Setup**: Connect your WhatsApp Business in minutes with no technical knowledge required

## 🏗️ Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Radix UI** - Headless UI components
- **Framer Motion** - Animation library
- **Recharts** - Chart library for analytics

### Backend & Database
- **Prisma 6.15.0** - Database toolkit and ORM
- **PostgreSQL** - Primary database
- **NextAuth.js v5** - Authentication
- **Stripe** - Payment processing
- **Resend** - Email service

### AI & Integrations
- **WhatsApp Business API** - Messaging platform integration
- **AI Training System** - Custom knowledge base and template management
- **Real-time Analytics** - Usage tracking and performance metrics

### Development Tools
- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React Email** - Email template development

## 📱 Core Features

### 1. Dashboard Analytics
- **Message Volume Tracking**: Daily, weekly, and monthly message statistics
- **Response Time Analytics**: Average response time monitoring
- **Customer Satisfaction**: Satisfaction rate tracking
- **Active Customer Metrics**: Real-time customer engagement data
- **Interactive Charts**: Visual representation of performance metrics

### 2. AI Training System
- **Knowledge Base Management**: Add text content and website URLs for AI training
- **Template System**: Create reusable message templates with quick reply options
- **Category Organization**: Organize templates by greeting, orders, products, support, and closing
- **Training Status Monitoring**: Track AI training progress and effectiveness

### 3. Inbox Management
- **Real-time Conversations**: Live WhatsApp conversation management
- **Customer Search**: Search conversations by customer name or phone number
- **Message Status Tracking**: Sent, delivered, and read status indicators
- **Human Takeover**: Seamless handoff from AI to human agents
- **Conversation History**: Complete message history and context

### 4. Team Collaboration
- **Team Management**: Create and manage teams with multiple members
- **Role-based Access**: Admin, member, and owner permissions
- **Team Invitations**: Invite team members via email
- **Usage Tracking**: Monitor team usage and limits
- **Subscription Management**: Handle team subscriptions and billing

### 5. Subscription & Billing
- **Multiple Plans**: Free, Starter, Pro, and Business tiers
- **Stripe Integration**: Secure payment processing
- **Usage Monitoring**: Real-time usage tracking with limit alerts
- **Billing Management**: Handle subscriptions, cancellations, and upgrades
- **Trial Management**: Free trial periods for new users

## 🌍 Internationalization

The platform supports multiple languages with easy extensibility:

- **English (en)** - Default language
- **Portuguese (pt-BR)** - Brazilian Portuguese support
- **Extensible** - Easy to add new languages

### Adding New Languages
1. Create new translation files in `i18n/messages/`
2. Add the locale to `i18n/routing.ts`
3. Update the middleware configuration

## 🔐 Authentication & Security

### Authentication Methods
- **Email/Password** - Traditional authentication
- **Google OAuth** - Social login integration
- **Email Verification** - Account verification system
- **Password Reset** - Secure password recovery
- **Session Management** - Secure session handling

### Security Features
- **bcryptjs** - Password hashing
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - API rate limiting
- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Prisma ORM protection

## 📧 Email System

Built-in email templates for various scenarios:

- **Welcome Emails** - New user onboarding
- **Email Verification** - Account verification
- **Password Reset** - Password recovery
- **Team Invitations** - Team member invitations
- **Project Invitations** - Project collaboration
- **OTP Emails** - One-time password delivery
- **Contact Emails** - Support and contact forms

## 🗄️ Database Schema

### Core Models
- **User** - User accounts and profiles
- **Team** - Team management and collaboration
- **TeamMember** - Team membership and roles
- **SubscriptionPlan** - Available subscription tiers
- **CustomerSubscription** - User subscription management
- **UsageTracking** - Usage monitoring and limits

### Key Relationships
- Users can belong to multiple teams
- Teams have subscription plans with usage limits
- Usage tracking monitors plan limits and alerts
- File management for avatars and documents

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Resend account (for emails)
- WhatsApp Business API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/botinho.ai.git
   cd botinho.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/botinho"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # Email
   RESEND_API_KEY="re_..."
   
   # WhatsApp API
   WHATSAPP_API_TOKEN="your-whatsapp-token"
   WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed:subscription-plans
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run check        # Run both lint and type-check

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio

# Email Development
npm run email        # Start email development server

# Subscription Management
npm run seed:subscription-plans  # Seed subscription plans
```

## 🏗️ Project Structure

```
botinho.ai/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── dashboard/           # Dashboard page
│   │   ├── inbox/              # Inbox management
│   │   ├── ai-training/        # AI training system
│   │   ├── team/               # Team management
│   │   ├── subscription/       # Subscription management
│   │   └── settings/          # User settings
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── stripe/            # Payment processing
│   │   └── cron/              # Scheduled tasks
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/             # Dashboard components
│   ├── inbox/                # Inbox components
│   ├── ai-training/          # AI training components
│   ├── team/                 # Team management components
│   └── subscription/         # Subscription components
├── lib/                       # Utility libraries
│   ├── generated/prisma/     # Generated Prisma client
│   ├── services/            # Business logic services
│   └── utils.ts             # Utility functions
├── prisma/                   # Database schema and migrations
├── i18n/                     # Internationalization
│   └── messages/            # Translation files
├── emails/                   # Email templates
└── public/                  # Static assets
```

## 🎨 UI/UX Design System

### Design Principles
- **Mobile-First**: Responsive design starting from mobile
- **Accessibility**: WCAG compliant components
- **Dark Mode**: System preference detection and manual toggle
- **Consistent Spacing**: Standardized spacing system
- **Modern Aesthetics**: Clean, professional interface

### Component Library
- **shadcn/ui**: Base component library
- **Custom Components**: Business-specific components
- **Icon System**: Lucide React icons
- **Typography**: Geist font family
- **Color System**: CSS custom properties for theming

## 📊 Analytics & Monitoring

### Built-in Analytics
- **Message Volume**: Track daily, weekly, monthly message counts
- **Response Times**: Monitor AI response performance
- **Customer Satisfaction**: Track satisfaction metrics
- **Usage Tracking**: Monitor subscription limits and usage
- **Performance Metrics**: Real-time system performance

### External Integrations
- **Vercel Analytics**: Performance and user analytics
- **Stripe Dashboard**: Payment and subscription analytics
- **Custom Metrics**: Business-specific KPIs

## 🔧 Configuration

### Tailwind CSS Configuration
- **Custom Design System**: Brand colors and spacing
- **Component Variants**: Consistent component styling
- **Responsive Breakpoints**: Mobile-first responsive design
- **Dark Mode Support**: Automatic theme switching

### Next.js Configuration
- **App Router**: Latest Next.js routing system
- **Turbopack**: Fast development builds
- **Image Optimization**: Automatic image optimization
- **Bundle Analysis**: Production bundle optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Cloud deployment
- **AWS Amplify** - AWS integration

### Environment Variables
Ensure all required environment variables are set in your deployment environment:
- Database connection string
- Authentication secrets
- Stripe API keys
- Email service credentials
- WhatsApp API credentials

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding guidelines
4. **Add tests**: If applicable, add tests for new features
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Submit a pull request**: Describe your changes clearly

### Coding Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Follow the existing component patterns
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the Issues**: Look through existing [GitHub Issues](../../issues)
2. **Create a New Issue**: Provide detailed information about your problem
3. **Community Discussions**: Join our community discussions
4. **Documentation**: Check the comprehensive documentation
5. **Email Support**: Contact us at support@botinho.ai

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Vercel](https://vercel.com/) - Next.js and deployment platform
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Stripe](https://stripe.com/) - Payment processing
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Lucide](https://lucide.dev/) - Beautiful icon library

---

**Built with ❤️ by Rafael Messias**

This platform is designed to help businesses automate their WhatsApp customer support quickly and efficiently. Happy coding! 🚀

## 📞 Contact

- **Website**: [botinho.ai](https://botinho.ai)
- **Email**: hello@botinho.ai
- **GitHub**: [@rafaelmessias](https://github.com/rafaelmessias)
- **LinkedIn**: [Rafael Messias](https://linkedin.com/in/rafaelmessias)

---

*Last updated: January 2025*