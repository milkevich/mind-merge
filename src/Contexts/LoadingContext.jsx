import React, { createContext, useState, useContext } from "react";
import Loader from "../Components/Loader";

const LoadingContext = createContext(null);

export const LoadingContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading ? <Loader /> : children}       
        </LoadingContext.Provider>
    );
}

export const useLoadingContext = () => useContext(LoadingContext);

export default LoadingContextProvider;
