import styled from "@emotion/styled";
import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import i18nServer from "~/modules/i18n.server";
import {Restaurants} from "~/interfaces/restaurant"
import styles from '../assets/css/root.module.css'
import Category from "~/components/core/category/Category";
import {useEffect, useState} from "react";

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
    text-align: center;
    justify-content: center;
    font-family: system-ui, sans-serif;
    line-height: 1.8;
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    min-height: 100vh;
    padding: 0;
`;

const Grid = styled.div`
    display: grid;
    margin-bottom: 16px;
    padding: 16px;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
`;

const Card = styled.div`
    min-width: 164px;
    width: 100%;
    max-width: 246px;
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
        <Container>
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
                <Card key={restaurant.id}>
                    <div className={styles.image} style={{ backgroundImage: `url(${restaurant.image_url})`}}>
                        <div className={styles.tags}>
                            {restaurant.tags}
                        </div>
                    </div>
                    <span className={styles.title}>{restaurant.name}</span>
                </Card>
            ))}
        </Grid>

            </div>
    </Container>
  );
}
