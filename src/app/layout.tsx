import Header from './components/layout/Header';
import '@/app/globals.css';
import MainWrapper from './components/layout/MainWrapper';
import AppWrapper from './components/layout/AppWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <AppWrapper>
            <Header />
            <MainWrapper>{children}</MainWrapper>
          </AppWrapper>
      </body>
    </html>
  );
}
