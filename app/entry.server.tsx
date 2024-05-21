/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import {createInstance} from "i18next";
import * as i18n from './config/i18n';
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18nServer from "./modules/i18n.server";
import createEmotionServer from "@emotion/server/create-instance";
import { CacheProvider } from "@emotion/react";

import createEmotionCache from "./styles/createEmotionCache";
import ServerStyleContext from "./styles/server.context";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // loadContext: AppLoadContext,
) {
  const instance = createInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(remixContext);
  instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns
  })
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
      <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
    </I18nextProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  const chunks = extractCriticalToChunks(html);

  const markup = renderToString(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
      <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
    </I18nextProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  responseHeaders.set('Content-Type', "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}