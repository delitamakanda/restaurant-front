import styles from './card.module.css';
import {Restaurants} from "~/interfaces/restaurant";
import {FC} from "react";

type Props = {
    restaurant: Restaurants;
}

const Card: FC<Props> = ({ restaurant }) => {

    return (
        <div className={styles.card}>
            <div className={styles.image} style={{backgroundImage: `url(${restaurant.image_url})`}}>
                <div className={styles.tags}>
                    {restaurant.tags}
                </div>
            </div>
            <span className={styles.title}>{restaurant.name}</span>
        </div>
    )
}

export default Card;
