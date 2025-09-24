# Installation Guide

This guide will help you install and set up H2RMS on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/h2rms.git
cd h2rms
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Configure your environment variables (see [Configuration](configuration.md))

### 4. Database Setup

Follow the [Supabase Setup](api/supabase-setup.md) guide to configure your database.

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Your application should now be running at `http://localhost:3000`.

## Verification

To verify your installation:

1. Open `http://localhost:3000` in your browser
2. Check that the application loads without errors
3. Verify database connectivity through the app interface

## Next Steps

- [Configure your environment](configuration.md)
- [Set up authentication](api/authentication.md)
- [Deploy to production](deployment/vercel-deployment.md)

## Troubleshooting

If you encounter issues during installation, check the [Troubleshooting](troubleshooting.md) guide.