import './globals.css';

export const metadata = {
  title: 'Real Estate Plot Layout',
  description: 'Interactive Real Estate Plot Layout built with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
