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

const Categories = styled.div`
    display: flex;
    margin: 0 16px;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: none;
    height: 74px;
`;

const CategoryItem = styled.div`
    padding: 0 8px;
    display: flex;
    align-items: center;
    margin-right: 8px;
    flex-direction: column;
    `;

const CategoryImg = styled.div`
    width: 54px;
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CategoryTitle = styled.div`
font-size: 14px;
    font-weight: 700;
    color: #333;
    text-decoration: navajowhite;
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
    tags: string;
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
            <div style={{ display: 'flex', flex: '1 1 0%', flexDirection: 'column'}}>
                <div style={{ flex: '1 1 0%' }}>
            <Form>
                <button type="submit" name="lng" value="fr">Français</button>
                <button type="submit" name="lng" value="en">English</button>
            </Form>
            <BigTitle>{t("title")}</BigTitle>
            <small>{description}</small>
            <Categories>
                {
                    categories.map((category: Categories) => (
                        <CategoryItem key={category.id} onClick={handleCategory(category.id)}>
                            <CategoryImg><img src={category.image_url} alt={category.name} style={{ width: 'auto', height: 'auto', maxHeight: '50px', maxWidth: '50px', display: 'block', transition: 'transform 0.5s'}}/></CategoryImg>
                            <CategoryTitle><span>{category.name}</span></CategoryTitle>
                        </CategoryItem>
                    ))
                }
            </Categories>

            <Grid>
                {restaurants.map((restaurant: Restaurants) => (
                <Card key={restaurant.id}>
                    <div className="restaurant-image" style={{ backgroundImage: `url(${restaurant.image_url})`, backgroundSize: 'cover', overflow: 'hidden',backgroundPosition: 'center center', borderRadius: '8px', height: '135px', display: 'flex', position: 'relative', border: '1px solid rgb(228, 288, 231)'}}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: '12px', color: "blue", backgroundColor: 'lightblue', width: 'fit-content', borderRadius: '6px', position: 'absolute', left: '8px', bottom: '8px', padding: '4px 8px'}}>
                            {restaurant.tags}
                        </div>
                    </div>
                    <span style={{ fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '24px',
                        textDecoration: 'none',
                        color: 'rgb(26, 26, 26)',
                        opacity: 1,
                        marginTop: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        }}>{restaurant.name}</span>
                </Card>
            ))}
        </Grid>
                </div>
            </div>
    </Container>
  );
}
