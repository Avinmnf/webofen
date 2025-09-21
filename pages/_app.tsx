import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "@/layout/layout";
import DashboardLayout from "./dashboard/layout";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from "@/contexts/AuthContext";
import SEO from "@/components/seo";
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");
  const LayoutComponent = isDashboard ? DashboardLayout : Layout;

  return (
    <>
    <SEO />
      <AuthProvider>
        <CartProvider>
          <LayoutComponent>
            <Component {...pageProps} />
          </LayoutComponent>
        </CartProvider>
      </AuthProvider>
    </>
  );
}
