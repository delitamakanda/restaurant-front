import styled from "@emotion/styled";
import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import i18nServer from "~/modules/i18n.server";

export async function loader({request}: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    const [data1, data2] = await Promise.all([
        await fetch("https://restaurantapi.applikuapp.com/api/restaurants/", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            mode: "no-cors"
        }),
        await fetch("https://restaurantapi.applikuapp.com/api/categories/", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            mode: "no-cors"
        })
    ]);
    return json({description: t("description"), restaurants: await data1.json(), categories: await data2.json()});
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

const Categories = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    flex-basis: 100%;
    max-width: 800px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
`;

interface Categories {
    id: string;
    name: string;
    image_url: string;
    position: string;
}

interface Restaurants {
    address: Array<string>;
    categories: Array<{id: string; name: string}>;
    id: string;
    image_url: string;
    menus: Array<{id: string;}>;
    name: string;
    schedule: Array<{day: string;}>;
    user: number;
}

export default function Index() {
    const {
        description,
        categories: {data: {categories}},
        restaurants: {data: {restaurants}}
    } = useLoaderData<typeof loader>();
    const {t} = useTranslation();
    const handleCategory = (categoryId: string) => () => {
        console.log(restaurants.filter((restaurant: Restaurants) => restaurant.categories.some((category) => category.id === categoryId)));

    };
    return (
        <Container>
            <BigTitle>{t("title")}</BigTitle>
            <p>{description}</p>
            <Categories>
                {
                    categories.map((category: Categories) => (
                        <div key={category.id} onClick={handleCategory(category.id)}>
                            <img src={category.image_url} alt={category.name}/>
                            <p>{category.name}</p>
                        </div>
                    ))
                }
            </Categories>
            <Form>
                <button type="submit" name="lng" value="fr">Français</button>
                <button type="submit" name="lng" value="en">English</button>
            </Form>
            <div>
                {restaurants.map((restaurant: Restaurants) => (
                <div key={restaurant.id}>
                    <img src={restaurant.image_url} alt={restaurant.name}/>
                    <div>{restaurant.name}</div>
                </div>
            ))}
        </div>
      
    </Container>
  );
}
