/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next/client";
import * as i18n from './config/i18n';
import { CacheProvider } from "@emotion/react";
import * as React from "react";

import ClientStyleContext from "./styles/client.context";
import createEmotionCache from "./styles/createEmotionCache";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = React.useState(createEmotionCache());

  const reset = React.useCallback(() => {
    setCache(createEmotionCache());
  }, []);

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )

}

i18next.use(initReactI18next)
.use(I18nextBrowserLanguageDetector)
.init({
  ...i18n,
  ns: getInitialNamespaces(),
  detection: { order: ["htmlTag"], caches: []}
});

startTransition(() => {
  hydrateRoot(
    document,
    <I18nextProvider i18n={i18next}>
      <ClientCacheProvider>
        <StrictMode />
      <RemixBrowser />
      </ClientCacheProvider>
    </I18nextProvider>
  )
})
