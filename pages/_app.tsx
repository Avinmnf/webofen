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

interface MyAppProps extends AppProps {
  siteSettings: SiteSettings;
}

function App({ Component, pageProps, siteSettings }: MyAppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");
  const LayoutComponent = isDashboard ? DashboardLayout : Layout;

  return (
    <>
      <SEO
        title={siteSettings?.title}
        description={siteSettings?.description}
        ogImage={siteSettings?.ogImage}
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
App.getInitialProps = async (
  appContext: AppContext
): Promise<MyAppProps> => {
  const appProps = await App.getInitialProps(appContext);
  const website = process.env.NEXT_PUBLIC_WEBOFEN || "https://webofen.com";

  // گرفتن siteSettings از CMS
  const res = await fetch(`${website}/api/proxy/site-settings`);
  const siteSettings: SiteSettings = await res.json();

  return {
    ...appProps,
    siteSettings,
  };
};
export default App;