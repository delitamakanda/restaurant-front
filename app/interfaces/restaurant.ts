export interface Restaurants {
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
