# H2RMS
Hyperwise's Human Resources Management System

A modern, scalable HR management solution built with Next.js, Supabase, and TypeScript.

## 🚀 Features

- **Employee Management** - Complete employee profiles and organization structure
- **Attendance Tracking** - Real-time check-in/check-out with QR code support
- **Leave Management** - Request, approve, and track employee leave
- **Reporting & Analytics** - Comprehensive reports with interactive charts
- **Document Management** - Secure document storage and access
- **Mobile Responsive** - Works seamlessly on all devices
- **Role-Based Access** - Admin, Manager, and Employee permission levels

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Supabase Auth
- **File Storage**: Supabase Storage
- **Deployment**: Vercel
- **Charts**: Chart.js / Recharts
- **PDF Generation**: jsPDF / Puppeteer
- **QR Codes**: qrcode.js / qr-scanner

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/h2rms.git
   cd h2rms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables (see [Configuration Guide](docs/configuration.md))

4. **Set up Supabase**
   Follow the [Supabase Setup Guide](docs/api/supabase-setup.md)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Installation Guide](docs/installation.md) - Step-by-step installation instructions
- [Configuration](docs/configuration.md) - Environment setup and configuration
- [API Documentation](docs/api/) - Backend API reference and setup
- [Implementation Guides](docs/guides/) - Feature-specific implementation guides
- [Deployment](docs/deployment/) - Production deployment guides
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## 🏗️ Project Structure

```
h2rms/
├── components/          # React components
├── pages/              # Next.js pages and API routes
├── lib/                # Utility functions and configurations
├── styles/             # CSS and styling
├── public/             # Static assets
├── docs/               # Project documentation
├── types/              # TypeScript type definitions
└── tests/              # Test files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm test` - Run tests

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

For detailed deployment instructions, see the [Vercel Deployment Guide](docs/deployment/vercel-deployment.md).

### Other Platforms

- **Netlify**: Supported with minor configuration changes
- **Docker**: Dockerfile included for containerized deployment
- **Traditional VPS**: Node.js deployment with PM2

## 🔒 Security Features

- Row Level Security (RLS) with Supabase
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- HTTPS enforcement
- Rate limiting
- CSRF protection

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@hyperwise.com
- 📖 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/h2rms/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/h2rms/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment and hosting platform

---

**Made with ❤️ by the Hyperwise Team**
