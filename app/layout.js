import './globals.css';

export const metadata = {
  title: 'Financial Time Machine',
  description: 'Explore alternate outcomes from your transaction history.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
