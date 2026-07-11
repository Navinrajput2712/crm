import './globals.css';
import Shell from '../components/Shell';

export const metadata = {
  title: 'GrowEasy',
  description: 'AI-powered CRM lead management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
