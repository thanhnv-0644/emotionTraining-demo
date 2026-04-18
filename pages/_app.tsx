import type { AppProps } from 'next/app';
import type { ReactNode } from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';
import 'material-symbols/outlined.css';
import '../globals.css';
import { AuthProvider } from '@/context/AuthContext';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

type AppPropsWithLayout = AppProps & {
  Component: AppProps['Component'] & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <div className={`${beVietnamPro.variable} min-h-screen font-sans antialiased`}>
      <AuthProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </div>
  );
}
