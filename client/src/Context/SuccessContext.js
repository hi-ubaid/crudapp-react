import React, { createContext, useState, useContext } from 'react';

const SuccessMessageContext = createContext();

export const useSuccessMessage = () => useContext(SuccessMessageContext);

export const SuccessMessageProvider = ({ children }) => {
    const [successMessage, setSuccessMessage] = useState("");

    return (
        <SuccessMessageContext.Provider value={{ successMessage, setSuccessMessage }}>
            {children}
        </SuccessMessageContext.Provider>
    );
};
