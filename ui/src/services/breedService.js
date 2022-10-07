import axiosService from "./axiosService"

const getBreeds = async (categoryId) => {
    switch (categoryId) {
        case (1):
            const resp = await axiosService.getAllReq('https://dog.ceo/api/breeds/list')
            return ['Other', ...resp.data.message]
        case (2):
            return ['Other', 'Sphynx', 'Persian', 'Siberian', 'Russian Blue', 'Exotic', 'Siamese', 'Burmese']
        case (3):
            return ['Other', 'Holland Lop', 'Mini Lop', 'Dutch', 'Lionhead', 'French Lop', 'Flemish Giant']
        case (4):
            return ['Other', 'Dwarf Roborovski', 'Campbell’s Dwarf Russian', 'Syrian (Golden) Hamster', 'Dwarf Winter White Russian']
        case (5):
            return ['Other', 'African Grey Parrots', 'Cockatoos', 'Macaws', 'Parrotlet', 'Cockatiel', 'Parakeets', 'Amazon Parrots', 'Lovebirds']
        case (6):
            return ['Other', 'Python', 'Corn ', 'Boa ', 'California Kingsnake', 'Green Tree Python', 'Rosy Boa', 'Rat Snakes', 'Garter Snake', 'Western Hognose']
        default:
            return ''
    }
}




const breedService = { getBreeds }

export default breedService