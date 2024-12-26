import React, { createContext, useContext, useEffect, useState } from 'react';

const ChildContext = createContext();

export const ChildContextProvider = ({ children }) => {
    const [selectedChild, setSelectedChild] = useState(() => {
        
        const savedChild = sessionStorage.getItem('selectedChild');
        return savedChild ? JSON.parse(savedChild) : null;
    });

    useEffect(() => {

        if (selectedChild) {
            sessionStorage.setItem('selectedChild', JSON.stringify(selectedChild));
        } else {
            sessionStorage.removeItem('selectedChild');
        }
    }, [selectedChild]);


    return (
        <ChildContext.Provider value={{ selectedChild, setSelectedChild }}>
            {children}
        </ChildContext.Provider>
    );
};

export const useChild = () => useContext(ChildContext);
