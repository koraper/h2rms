import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Users, Clock, FileText, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>H2RMS - Human Resources Management System</title>
        <meta name="description" content="Modern HR management solution for efficient employee management" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">H2RMS</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="btn-outline">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern HR Management
              <span className="block text-primary-600">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your human resources operations with our comprehensive
              management system. Track attendance, manage leave requests, and
              generate insightful reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/demo" className="btn-outline text-lg px-8 py-3">
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive HR tools designed to make your work easier and more efficient
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
                <p className="text-gray-600">
                  Complete employee profiles with role-based access control
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
                <p className="text-gray-600">
                  Real-time check-in/check-out with QR code support
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Leave Management</h3>
                <p className="text-gray-600">
                  Streamlined leave requests and approval workflows
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-error-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-error-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
                <p className="text-gray-600">
                  Comprehensive reporting with interactive charts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies that trust H2RMS for their HR management needs
            </p>
            <Link href="/auth/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
              Start Your Free Trial
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">H2RMS</h3>
                <p className="text-gray-400">
                  Modern HR management solution for the digital workplace.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/features" className="hover:text-white">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                  <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                  <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                  <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Hyperwise. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Redirect authenticated users to dashboard
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};