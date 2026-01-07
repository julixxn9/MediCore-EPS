import type { NavigateFunction } from "react-router-dom"

async function authFetch(url: RequestInfo | URL, options: RequestInit, navegarA: NavigateFunction): Promise<Response | void> {

    const peticionRecursos = await fetch(url, {
        ...options,
        credentials: 'include'
    })

    if (peticionRecursos.status !== 401) return peticionRecursos

    const peticionRefresh = await fetch(import.meta.env.VITE_BACKEND+'/auth/refresh',{
        method: 'POST',
        credentials: 'include'
    })

    if (!peticionRefresh.ok){
        return navegarA('/auth/login')
    }

    const segundaPeticionRecursos = await fetch(url,
        {
            ...options,
            credentials: 'include'
        }
    )

    return segundaPeticionRecursos

}

export default authFetch