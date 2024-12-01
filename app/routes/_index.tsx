import styled from "@emotion/styled";
import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import i18nServer from "~/modules/i18n.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18nServer.getFixedT(request);
    const data = await fetch("https://restaurantapi.applikuapp.com/api/categories/", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        mode: "no-cors"
    })
  return json({ description: t("description"), categories: await data.json() });
}

const BigTitle = styled.h1`
  font-size: 2rem;
  color: #000;
`;

const Container = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
  font-family: system-ui, sans-serif;
  line-height: 1.8;
`;

interface Categories {
    id: string;
    name: string;
    image_url: string;
    position: string;
}

export default function Index() {
  const { description, categories: { data: { categories }} } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  return (
    <Container>
      <BigTitle>{t("title")}</BigTitle>
      <p>{description}</p>
        {
            categories.map((category: Categories) => (
              <div key={category.id}>
                  <img src={category.image_url} alt={category.name} />
                  <p>{category.name}</p>
              </div>
            ))
        }
      <Form>
        <button type="submit" name="lng" value="fr">Français</button>
        <button type="submit" name="lng" value="en">English</button>
      </Form>
      
    </Container>
  );
}
