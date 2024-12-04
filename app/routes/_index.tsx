import styled from "@emotion/styled";
import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import i18nServer from "~/modules/i18n.server";
import {Restaurants} from "~/interfaces/restaurant"
import styles from '../assets/css/root.module.css'
import Category from "~/components/core/category/Category";
import {useEffect, useState} from "react";
import Card from "~/components/core/card/Card";

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

const Grid = styled.div`
    display: grid;
    margin-bottom: 16px;
    padding: 16px;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
`;


export default function Index() {
    const {
        description,
        categories: {data: {categories}},
        restaurants: {data: {restaurants}}
    } = useLoaderData<typeof loader>();
    const {t} = useTranslation();

    const [ filteredRestaurants, setFilteredRestaurants] = useState<Restaurants[]>(restaurants);
    const [count, setCount] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handleCategory = (categoryId: string) => {
        const filteredRestaurants = restaurants.filter((restaurant: Restaurants) => restaurant.categories.some((category) => category.id === categoryId));

        setFilteredRestaurants(filteredRestaurants);
        setActiveCategory(categoryId);
        setCount(count + 1);
        if (activeCategory === categoryId) {
            setCount(0);
            setActiveCategory(null);
            setFilteredRestaurants(restaurants);
        }
    };
    useEffect(() => {
        setFilteredRestaurants(filteredRestaurants)
    }, [filteredRestaurants]);
    return (
        <>
            <div className={styles.column}>

            <Form>
                <button type="submit" name="lng" value="fr">Français</button>
                <button type="submit" name="lng" value="en">English</button>
            </Form>
            <BigTitle>{t("title")}</BigTitle>
            <small>{description}</small>
            <Category categories={categories} onCategoryClick={handleCategory} activatedCategory={count} selectedCategory={activeCategory}
            />

            <Grid>
                {filteredRestaurants.map((restaurant: Restaurants) => (
                <Card key={restaurant.id} restaurant={restaurant} />
            ))}
            </Grid>

            </div>
    </>
  );
}
