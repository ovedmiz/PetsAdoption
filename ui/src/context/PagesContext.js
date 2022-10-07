import { createContext, useState } from "react";

export const PagesContext = createContext()

export const PagesContextProvider = (props) => {
    const [pages, setPages] = useState(0)



    return (
        <PagesContext.Provider value={[pages, setPages]}>
            {props.children}
        </PagesContext.Provider>
    )
}