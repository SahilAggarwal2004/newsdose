/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from "@tanstack/react-query";
import { useState, useContext, useEffect, createContext } from "react";
import { countries } from "../constants";
import { useStorage } from "../hooks";
import { getStorage } from "../modules/storage";

const Context = createContext()
export const useNewsContext = () => useContext(Context);

const ContextProvider = props => {
    const client = useQueryClient();
    const [country, setCountry] = useStorage('country', { method: 'pending', code: '' })
    const [progress, setProgress] = useState(0)
    const [shareUrl, setShareUrl] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => { setError() }, [window.location.pathname])

    useEffect(() => {
        if (country.method !== 'pending') return
        fetch('https://feeds.intoday.in/geocheck') // process.env.REACT_APP_URL + 'location'
            .then(response => response.json())
            .then(({ country_code }) => {
                const code = country_code?.toLowerCase()
                countries[code] ? setCountry({ method: 'auto', code }) : setCountry({ method: 'auto', code: 'in' })
            })
    }, [country.method])

    function onError(key, id, error) {
        setProgress(100)
        client.setQueryData(key, { news: getStorage(id) })
        setError(error?.response?.data?.error || 'Unable to fetch news! Try again later...')
    }

    return <Context.Provider value={{ country, setCountry, progress, setProgress, shareUrl, setShareUrl, error, onError }}>
        {props.children}
    </Context.Provider>
}

export default ContextProvider;