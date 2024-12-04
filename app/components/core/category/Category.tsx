import styles from './category.module.css';

import type { Category } from "~/interfaces/category";
import {FC} from "react";
import classNames from "classnames";

type Props = {
    categories: Category[];
    onCategoryClick: (categoryId: string) => void;
    activatedCategory: number;
    selectedCategory?: string | null;
}

type PropsWithCategory = {
    category: Category;
    onClick: (categoryId: string) => void;
    categoryActive: number;
    isSelected: boolean;
}
const CategoryItem: FC<PropsWithCategory> = ({ category, onClick, isSelected }) => {
    return (
        <div className={classNames(styles.category, {
            [styles.active]: isSelected
        })} onClick={() => onClick(category.id)}>
            <div className={styles.item}>
                <img src={category.image_url} alt={category.name} className={styles.image}/>
            </div>
            <div className={styles.title}>{category.name}</div>
        </div>
    )
}

const Category: FC<Props> = ({categories, onCategoryClick, activatedCategory, selectedCategory }) => {
    return (
        <div className={styles.categories}>
            {
                categories.map((category: Category) => (
                    <CategoryItem key={category.id} category={category} onClick={onCategoryClick} categoryActive={activatedCategory}
                    isSelected={category.id === selectedCategory}/>
                ))
            }
        </div>
    )
}

export default Category;
