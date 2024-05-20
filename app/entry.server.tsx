/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import createCache from "@emotion/cache";
import {createInstance} from "i18next";
import * as i18n from './config/i18n';
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18nServer from "./modules/i18n.server";
import { ServerStyleSheet } from "styled-components";
import createEmotionServer from "@emotion/server/create-instance";

const ABORT_DELAY = 5_000;
const key = "custom";
const cache = createCache({ key });
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);


export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const instance = createInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(remixContext);
  instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns
  })
  const sheet = new ServerStyleSheet();
  let markup = renderToString(
    sheet.collectStyles(
      <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
    </I18nextProvider>
    )
  );
  const chunks = extractCriticalToChunks(markup);
  let styles = constructStyleTagsFromChunks(chunks);
  styles = sheet.getStyleTags();

  markup = markup.replace('__STYLES__', styles);

  responseHeaders.set('Content-Type', "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}