import { CartProvider } from '@/context/CartContext';
import Head from 'next/head';
import Layout from '../components/layout';
import '../styles/globals.css';
import { FavoritesProvider } from '@/context/FavoriteHook';

export default function MyApp({ Component, pageProps }) {
  return (
    <FavoritesProvider>
    <CartProvider>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
    </FavoritesProvider>
  );
}
