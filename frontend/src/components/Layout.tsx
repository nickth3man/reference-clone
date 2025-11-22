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
        className="bg-slate-900 text-slate-400 py-8 mt-auto"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} HoopsClone. All rights reserved.</p>
          <p className="text-sm mt-2">
            Data provided by DuckDB & Basketball Reference (Clone).
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
