
## �� Customization

### Styling
The project uses Tailwind CSS v4 with a custom design system. You can customize:

- **Colors**: Modify `tailwind.config.js` for brand colors
- **Components**: Edit shadcn/ui components in `components/ui/`
- **Layout**: Adjust sidebar and header in respective components

### Internationalization
Add new languages by:

1. Creating new translation files in `i18n/messages/`
2. Adding the locale to `i18n/routing.ts`
3. Updating the middleware configuration

### Database Schema
Modify the database schema in `prisma/schema.prisma` and run:
```bash
npx prisma generate
npx prisma db push
```

## 📊 Dashboard Components

### Section Cards
Display key metrics with trend indicators:
- Total Revenue
- New Customers  
- Active Accounts
- Growth Rate

### Interactive Charts
Real-time analytics with:
- Area charts for visitor data
- Time range selectors
- Responsive design
- Dark/light mode support

### Data Table
Advanced table with features:
- Drag and drop reordering
- Column filtering and sorting
- Pagination
- Bulk actions
- Inline editing
- Export functionality

## 🔐 Authentication

The framework includes:
- **NextAuth.js v5** for authentication
- **Google OAuth** integration
- **Email/password** authentication
- **Password reset** functionality
- **Email verification**
- **Session management**

## 📧 Email System

Built-in email templates:
- **Welcome emails** for new users
- **Password reset** emails
- **Email verification** emails
- **Team invitations**
- **Project invitations**

## 🌍 Internationalization

Supports multiple languages:
- **English** (en)
- **Portuguese** (pt-BR)

Easy to extend with additional languages.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## �� Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run check        # Run both lint and type-check

# Email Development
npm run email        # Start email development server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## �� Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Vercel](https://vercel.com/) for Next.js
- [Prisma](https://prisma.io/) for the database toolkit
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ by Rafael Messias**

This template is designed to help you build scalable SaaS applications quickly and efficiently. Happy coding! 🚀