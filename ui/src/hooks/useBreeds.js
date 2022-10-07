import { useEffect, useState } from "react"
import breedService from "../services/breedService"
import petsService from "../services/petsService"

const useBreeds = (id) => {
    const [breeds, setBreeds] = useState([])

    useEffect(() => {
        const getBreeds = async () => {
            setBreeds(breeds)
        }
        getBreeds()
    }, [])
    return breeds
}

export default useBreeds