import { QueryProvider } from '@/components/QueryProvider';
import './globals.css';
import { Poppins } from 'next/font/google';
import { Header } from '@/components/Header';
import { ThemeProvider } from 'next-themes';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <QueryProvider>
          <ThemeProvider>
            <div className="min-h-screen">
              <Header />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </main>
              {/* <Footer /> */}
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
