import React, { useContext, useEffect, useState } from 'react'
import './CategoriesNavigation.css'
import Button from '../Button/CategoryButton';
import { PetsContext } from '../../context/PetsContext';
import petsService from '../../services/petsService';
import { FilterMenu } from '../FilterMenu/FilterMenu';

export const CategoriesNavigation = ({ isCategorySelected, setIsCategorySelected, setActiveCategory, setActiveCategoryId }) => {
    const [activeBtn, setActiveBtn] = useState(0)
    const [categories, setCategories] = useState([])
    const [pets, setPets] = useContext(PetsContext);


    useEffect(() => {
        const getCategories = async () => {
            const categories = await petsService.getAllCategories()
            setCategories(categories)
        }
        getCategories()
    }, [])



    useEffect(() => {
        if (!isCategorySelected) setActiveBtn(0)
    }, [isCategorySelected])

    const handleCategoryClick = async (e, id) => {
        if (id == 0) {
            const resp = await petsService.getRandomAnimals()
            setPets(resp)
            setActiveCategory('Pet')
            setActiveCategoryId(0)

        } else {
            const resp = await petsService.getAllPetsOfCategory(id, 0)
            setPets(resp.content)
            setActiveCategoryId(id)
            setActiveCategory(e.target.value)
        }
        setIsCategorySelected(true)
        setActiveBtn(id)
    }

    return (
        <>
            <div className='categoriesNavigation'>
                {categories.map(category => {
                    return (
                        <div key={category.id} className='btnWrapper'>
                            <Button
                                onClick={e => handleCategoryClick(e, category.id)}
                                active={activeBtn == category.id ? true : false}
                                category={category.categoryName}
                            />
                        </div>)
                })}
            </div>

            {isCategorySelected && <FilterMenu selectedCategory={activeBtn} />}
        </>

    )
}
