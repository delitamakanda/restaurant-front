import { RemixI18Next } from "remix-i18next/server";
import { createCookie } from "@remix-run/node";


import * as i18n from '../config/i18n';

export const localeCookie = createCookie("lng", {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: true,
})

export default new RemixI18Next({
    detection: {
        supportedLanguages: i18n.supportedLanguages,
        fallbackLanguage: i18n.fallbackLang,
        cookie: localeCookie
    },
    i18next: {
        ...i18n,
    }
})