import styled from "@emotion/styled";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import i18nServer from "~/modules/i18n.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18nServer.getFixedT(request);
  return json({ description: t("description") });
}

const BigTitle = styled.h1`
  font-size: 5rem;
  color: #ff3333;
`;

export default function Index() {
  const { description } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <BigTitle>{t("title")}</BigTitle>
      <p>{description}</p>
      <Form>
        <button type="submit" name="lng" value="fr">Français</button>
        <button type="submit" name="lng" value="en">English</button>
      </Form>
    </div>
  );
}
