import {createContext, useContext, useEffect, useState} from 'react'
import type { User, ContextType } from '@/types'
import { getCurrentUser } from '@/lib/appwrite/api'
import { useNavigate } from 'react-router-dom'

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<ContextType>(INITIAL_STATE)

const AuthProvider = ({children} : {children: React.ReactNode}) => {

    const [user, setUser] = useState<User>(INITIAL_USER)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    const navigate = useNavigate()

    const checkAuthUser = async () => {

        setIsLoading(true)

        try {
            // Here you would typically check if the user is authenticated
            // For example, checking a token or making an API call
            const currentAccount = await getCurrentUser();
            

            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username || '',
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl || '',
                    bio: currentAccount.bio || '',
                });

                setIsAuthenticated(true);

                return true;
            } 
            
            return false;

        } catch (error) {

            console.error('Error checking authentication:', error);
            return false;

        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {

        if(
            localStorage.getItem('cookieFallback') === '[]' || 
            localStorage.getItem('cookieFallback') === null
        ) navigate('/sign-in')

        checkAuthUser();
    }
    , [])

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useUserContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useUserContext must be used within an AuthProvider')
    }

    return context
}