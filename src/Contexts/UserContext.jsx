import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setInitialized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setInitialized(true);
        });
        
        return () => {
            unsubscribe(); 
        };
    }, []);

    const logOut = () => {
        signOut(auth);
    }

    return (
        <UserContext.Provider value={{ user, logOut, isInitialized }}>
            {children}            
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext)

export default UserContextProvider
