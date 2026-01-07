import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { contextType } from "../types"
import Loading from "../pages/Loading"

const authContext = createContext<contextType | undefined>(undefined)

function AuthContextProvider({ children }: {children: ReactNode}) {

    const [ logged, setLogged ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ , setErrorCode ] = useState<number | null>(null)
    
    useEffect(()=>{
        // if (errorCode == 401){
        //     setLogged(false)
        //     console.log('Proceso de refresh')
        // } else {
        //     console.log('Error que no tiene nada que ver co autorizacion')
        // }

        const tryRefresh = async () =>{
            try {
                const request = await fetch(import.meta.env.VITE_BACKEND+'/auth/refresh', {
                    method: 'POST',
                    credentials: 'include'
                })
                if(!request.ok){
                    setLogged(false)
                    setLoading(false)
                    return
                }
            } catch (error) {
                alert('Ocurrio un error inesperado, intentalo de nuevo mas tarde')
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        tryRefresh()
    }, [loading])

    return (
        <authContext.Provider value={{logged, setErrorCode, setLoading, setLogged}} >
            {loading ?
            <Loading/>
             :
            children
            }
        </authContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(authContext)
    if (context) return context
    throw new Error('No puedes llamar a useAuth si no estas dentro del authContextProvider')
}

export default AuthContextProvider