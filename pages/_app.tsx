import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "@/layout/layout"; // web layout
import DashboardLayout from "../components/dashboard/layout";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  const LayoutComponent = isDashboard ? DashboardLayout : Layout;

  return (
    <AuthProvider>
      <CartProvider>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </CartProvider>
    </AuthProvider>
  );
}
