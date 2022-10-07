import { useEffect, useState } from "react"
import petsService from "../services/petsService"

const useCategories = () => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const getCategories = async () => {
            const categories = await petsService.getAllCategories()
            setCategories(categories)
        }
        getCategories()
    }, [])
    return categories
}

export default useCategories