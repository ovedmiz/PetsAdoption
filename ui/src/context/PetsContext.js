import { createContext, useState } from "react";

export const PetsContext = createContext()

export const PetsContextProvider = (props) => {
    const [pets, setPets] = useState([])



    return (
        <PetsContext.Provider value={[pets, setPets]}>
            {props.children}
        </PetsContext.Provider>
    )
}