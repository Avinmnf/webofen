import "@/styles/globals.css";
import type {AppContext, AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "@/layout/layout";
import DashboardLayout from "./dashboard/layout";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from "@/contexts/AuthContext";
import SEO from "@/components/seo";

type SiteSettings = {
  title: string;
  description: string;
  favicon: string;
  ogImage: string;
};


 export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");
  const LayoutComponent = isDashboard ? DashboardLayout : Layout;

  return (
    <>
      <SEO
        // title={siteSettings?.title}
        // description={siteSettings?.description}
        // ogImage={siteSettings?.ogImage}
      />
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
