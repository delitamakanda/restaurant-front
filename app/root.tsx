import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import "remixicon/fonts/remixicon.css";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useChangeLanguage } from "remix-i18next/react";
import { withEmotionCache } from "@emotion/react";
import styled from "@emotion/styled";
import i18nServer, { localeCookie } from "./modules/i18n.server";
import { useContext, useEffect, useRef } from "react";

import ClientStyleContext from "./styles/client.context";
import ServerStyleSContext from "./styles/server.context";

const Container = styled("div")`
  background-color: #ff11cc;
  padding: 1em;
`;

export const handle = { i18n: ["translation"]};

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18nServer.getLocale(request);
  return json({ locale }, { headers: {"Set-Cookie": await localeCookie.serialize(locale) }});
}

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}


export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { property: "og:title", content: "Click&Serve" },
    { property: "og:description", content: "Welcome to Remix!" },
    { title: "Click&Serve" },
    { name: "description", content: "Welcome to Remix!" },
    { name: "theme-color", content: "#000" },
  ];
};

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleSContext);
    const clientStyleData = useContext(ClientStyleContext);
    const reinjectStyleRef = useRef(true);

    useEffect(() => {
      if (!reinjectStyleRef.current) {
        return;
      }
      emotionCache.sheet.container = document.head;
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (emotionCache.sheet as any)._insertTag(tag);
      })
      clientStyleData.reset();
      reinjectStyleRef.current = false;
    }, [clientStyleData, emotionCache.sheet]);

    const loaderData = useRouteLoaderData<typeof loader>("root");
    return (
      <html lang={loaderData?.locale?? "en"}>
        <head>
          { title ? <title>{title}</title> : null }
          <Meta />
          <Links />
          { serverStyleData?.map(({ key, ids, css}) => (
            <style key={key} data-emotion={`${key} ${ids.join(" ")}`} dangerouslySetInnerHTML={{ __html: css}}></style>
          ))}
        </head>
        <body>
          <Container>
            Click&Serve
          </Container>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
});

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  useChangeLanguage(locale);
  return (
    <Document>
      <Outlet />
    </Document>
  )
}
