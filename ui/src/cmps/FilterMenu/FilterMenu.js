import React, { useContext, useEffect, useState } from 'react'

import { PetsContext } from '../../context/PetsContext'

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Slider from '@mui/material/Slider';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Popper from '@material-ui/core/Popper';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { HiOutlineFilter } from 'react-icons/hi'

import './FilterMenu.css'
import breedService from '../../services/breedService';
import petsService from '../../services/petsService';
import { Box } from '@mui/system';
import { buildFilterString } from '../../utils/stringUtils'
import { PagesContext } from '../../context/PagesContext';

import { useNotification } from '../../cmps/Notification/NotificationProvider'


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            "& .MuiAutocomplete-listbox":
            {
                backgroundColor: "#f9f3e4",
            }
        }
    })
);

const CustomPopper = function (props) {
    const classes = useStyles();
    return <Popper {...props} className={classes.root} placement="bottom" />;
};


export const FilterMenu = ({ selectedCategory }) => {
    const [pages, setPages] = useContext(PagesContext)
    const notify = useNotification()


    const [breeds, setBreeds] = useState([])
    const [options, setOptions] = useState({
        size: 'All Sizes',
        sex: 'All Sexes',
        breed: 'All Breeds',
        age: [0, 25]
    })

    const [pets, setPets] = useContext(PetsContext)


    useEffect(() => {
        const getBreeds = async () => {
            if (selectedCategory !== 0) {
                const resp = await breedService.getBreeds(parseInt(selectedCategory))
                let breeds = resp.map(str => str.charAt(0).toUpperCase() + str.slice(1))
                setBreeds(['All Breeds', ...breeds])
            }
        }
        getBreeds()

        return () => {
            setOptions({
                size: 'All Sizes',
                sex: 'All Sexes',
                breed: 'All Breeds',
                age: [0, 25]
            })
        }
    }, [selectedCategory])


    const handleChange = (e) => {
        const { name, value } = e.target
        setOptions(prevState => ({ ...prevState, [name]: value }))
    }
    const handleChangeBreed = (e) => {
        setOptions(prev => ({ ...prev, breed: e.target.textContent }))
    }

    const sendFilter = async () => {
        let str = buildFilterString(options)
        try {
            const filteredPets = await petsService.filterPets(selectedCategory, str)
            setPets(filteredPets.content)
            setPages(filteredPets.totalPages)
            notify({
                type: 'SUCCESS',
                msg: 'Filtered Succefully'
            })
        } catch (error) {
            notify({
                type: 'ERROR',
                msg: 'There Was A Problem.. Try Again'
            })
        }
    }

    return (
        <div className='FilterMenu'>
            <Box className='filterOption' sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel>Size</InputLabel>
                    <Select
                        name="size"
                        value={options.size}
                        label="Age"
                        onChange={handleChange}
                        sx={{
                            backgroundColor: '#f9f3e4',
                        }}
                        menuprops={{
                            PaperProps: {
                                sx: {
                                    bgcolor: '#f9f3e4',
                                    '& .MuiMenuItem-root': {
                                        padding: 2,
                                    },
                                },
                            },
                        }}                    >
                        <MenuItem selected value={'All Sizes'}>All Sizes</MenuItem>
                        <MenuItem value={'small'}>Small</MenuItem>
                        <MenuItem value={'medium'}>Medium</MenuItem>
                        <MenuItem value={'Big'}>Big</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box className='filterOption' sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel>Sex</InputLabel>
                    <Select
                        name="sex"
                        value={options.sex}
                        label="Sex"
                        onChange={handleChange}
                        sx={{
                            backgroundColor: '#f9f3e4'
                        }}
                        menuprops={{
                            PaperProps: {
                                sx: {
                                    bgcolor: '#f9f3e4',
                                    '& .MuiMenuItem-root': {
                                        padding: 2,
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem selected value={'All Sexes'}>All Sexes</MenuItem>
                        <MenuItem value={'female'}>Female</MenuItem>
                        <MenuItem value={'male'}>Male</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box className='filterOption' sx={{ minWidth: 120 }}>
                <FormControl fullWidth>

                    <Autocomplete
                        onChange={handleChangeBreed}
                        value={options.breed}
                        name='breed'
                        sx={{
                            backgroundColor: '#f9f3e4',
                            width: 220,
                            color: 'rgb(255, 94, 0)'
                        }}
                        menuprops={{
                            PaperProps: {
                                sx: {
                                    bgcolor: '#f9f3e4',
                                    '& .MuiMenuItem-root': {
                                        padding: 2,
                                    },
                                },
                            },
                        }}
                        disablePortal
                        options={breeds}
                        renderInput={(params) => <TextField {...params} label="Breed" />}
                        PopperComponent={CustomPopper}
                    />
                </FormControl>
            </Box>
            <Box className='filterOption' sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <Typography id="input-slider" gutterBottom>
                        Age
                    </Typography>
                    <Slider
                        getAriaLabel={() => 'Minimum distance'}
                        value={options.age}
                        name='age'
                        onChange={handleChange}
                        sx={{
                            backgroundColor: '#f9f3e4',
                            width: '200px',
                            color: 'rgb(252,168,114)'
                        }}
                        menuprops={{
                            PaperProps: {
                                sx: {
                                    bgcolor: '#f9f3e4',
                                    '& .MuiMenuItem-root': {
                                        padding: 2,
                                    },
                                },
                            },
                        }}
                        valueLabelDisplay="auto"
                        getAriaValueText={() => 'Minimum distance'}
                        disableSwap
                        step={1}
                        min={0}
                        max={25}
                    />
                </FormControl>
            </Box>

            <div className='filterOption' >
                <button className='filterBtn' onClick={sendFilter}>
                    Filter <HiOutlineFilter />
                </button>
            </div>

        </div>)
}
