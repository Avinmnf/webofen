// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/layout/layout";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </Layout>
    </AuthProvider>
  );
}
