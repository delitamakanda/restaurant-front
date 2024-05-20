/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";

const ABORT_DELAY = 5_000;
const key = "custom";
const cache = createCache({ key });
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let markup = renderToString(
    <CacheProvider value={cache}>
      <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
    </CacheProvider>
  );
  const chunks = extractCriticalToChunks(markup);
  const styles = constructStyleTagsFromChunks(chunks);

  markup = markup.replace('__STYLES__', styles);

  responseHeaders.set('Content-Type', "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}