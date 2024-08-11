import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../Services/category_service';
import 'react-toastify/dist/ReactToastify.css';
import BannerBackground from "../../Assets/home-banner-background.png";
import DefaultImage from  "../../Assets/no-image.png";
import '../../CSS/LandingPage.css';
import Spinner from './Spinner';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategory = async () => {
            try {
                const categories = await fetchCategories();
                console.log("Categories fetched successfully");
                console.log(categories);
                setCategories(categories);
                setLoading(false);

            } catch (error) {
                setError(error);
                setLoading(false);
                console.log("Error while fetching cart");
            }
        };

        getCategory();
    }, []);

    if (loading) {
        return <div><Spinner /></div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (

        <div className='cart-container'>

            <div className="home-bannerImage-container bg-container">
                <img src={BannerBackground} alt="" className='backgoround-img' />
            </div>

            <div className="category-section-wrapper" id="Category">

                <div className="category-section-bottom">
                
                    {categories.map(category => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
                </div>

                </div>
            </div>

    );
};

const CategoryItem = ({ category }) => {
    console.log(category);
    return (
        <div className="category-section-info">
            <div className="info-boxes-img-container">
                <img src={category.image ? `data:image/jpeg;base64,${category.image}`: DefaultImage} alt={"No image"} className="top-category-img" />
            </div>
            <h2>{category.name}</h2>
            <p>{category.name}</p>
        </div>

    );
};

export default Category;