import { createContext, useContext } from "react";

export const SiteSettingsContext = createContext<any>(null);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}