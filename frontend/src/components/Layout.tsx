import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} HoopsClone. All rights reserved.</p>
          <p className="text-sm mt-2">Data provided by DuckDB & Basketball Reference (Clone).</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
