// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Virtual Try-On App',
  description: 'Try on clothing virtually with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Virtual Try-On App
          </h1>
          {children}
        </main>
      </body>
    </html>
  );
}