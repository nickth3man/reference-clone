import Link from "next/link";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-text-inverse focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <Navbar />

      <main
        id="main-content"
        className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        tabIndex={-1}
      >
        {children}
      </main>

      <footer
        className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">HoopsClone</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Data</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">DuckDB</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Basketball Reference (Clone)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Subscribe</h3>
            <p className="text-sm mb-4">Get the latest stats and updates delivered to your inbox.</p>
            <form className="flex">
              <input type="email" placeholder="Enter your email" className="bg-slate-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-orange-500 w-full" />
              <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-md transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} HoopsClone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
