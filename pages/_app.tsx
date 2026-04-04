import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
}
