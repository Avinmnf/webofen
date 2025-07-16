// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/layout/layout";
import { CartProvider } from '@/contexts/CartContext'; 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </Layout>
  );
}
