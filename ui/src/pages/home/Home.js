import React, { useState, useEffect, useContext } from 'react'

import { useNavigate } from 'react-router-dom'
import { CategoriesNavigation } from '../../cmps/CategoriesNavigation/CategoriesNavigation'
import { PetsContext } from '../../context/PetsContext'
import PetCard from '../../cmps/PetCard/PetCard'

import Pagination from '@mui/material/Pagination';

import './Home.css'
import petsService from '../../services/petsService'

import { PagesContext } from '../../context/PagesContext'
import { ThemeProvider } from '@material-ui/core'
import { createTheme } from '@mui/material/styles';
import Spinner from '../../cmps/Spinner/Spinner'

const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#0971f1',
            darker: '#053e85',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});


const Home = ({ isCategorySelected, setIsCategorySelected }) => {

    let navigate = useNavigate();
    const [pets, setPets] = useContext(PetsContext)
    const [activeCategory, setActiveCategory] = useState("Home")
    const [activeCategoryId, setActiveCategoryId] = useState(0)
    const [pages, setPages] = useContext(PagesContext)

    useEffect(() => {
        const fetchRandom = async () => {
            setPets('loading')
            const resp = await petsService.getRandomAnimals()
            setPets(resp)
        }

        fetchRandom()
        setPages(1)
        setIsCategorySelected(false)
    }, []);

    function handlePetClick(pet) {
        navigate(`/home/pet/${pet.id}`);
    }

    const setTitle = (category) => {
        setActiveCategory(`${category}s`)
    }

    useEffect(() => {
        if (activeCategoryId !== 0) {
            const getPets = async () => {
                const resp = await petsService.getAllPetsOfCategory(activeCategoryId, 0)
                setPages(resp.totalPages)
                setPets(resp.content)
            }
            getPets()
        }
    }, [activeCategoryId])

    const handlePageChange = async (e, page) => {
        let pageURL = page - 1;
        const resp = await petsService.getAllPetsOfCategory(activeCategoryId, pageURL)
        setPets(resp.content)
    }


    return (
        <>
            <CategoriesNavigation
                setIsCategorySelected={setIsCategorySelected}
                isCategorySelected={isCategorySelected}
                setActiveCategory={setTitle}
                setActiveCategoryId={(id) => setActiveCategoryId(id)}
            />
            <div className='title'>{!isCategorySelected ? 'Home' : activeCategory}</div>
            <div className='petsContainer'>
                {pets === 'loading' && <Spinner />}
                {pets !== 'loading' && pets?.map(pet =>
                    <PetCard
                        key={pet.id}
                        pet={pet}
                        onClick={() => handlePetClick(pet)}
                    />)}
            </div>
            {pets.length < 1 && <h1 className='pageTitle'>{isCategorySelected ? 'No Pets Found' : <Spinner />
            }</h1>}

            {pages > 1 &&
                <div className='showMoreContainer' style={{ marginTop: '30px' }}>
                    <ThemeProvider theme={theme}>
                        <Pagination count={pages} color='standard' size="large" onChange={handlePageChange} />
                    </ThemeProvider>
                </div>
            }
        </>
    )
}

export default Home
