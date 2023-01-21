/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useContext, useEffect, createContext } from "react";
import { countries } from "../constants";
import { useStorage } from "../hooks";
import encrypt from "../modules/encrypt";
import { getStorage, setStorage } from "../modules/storage";

axios.defaults.baseURL = process.env.REACT_APP_URL

const Context = createContext()
export const useNewsContext = () => useContext(Context);

const ContextProvider = props => {
    const client = useQueryClient();
    const [country, setCountry] = useStorage('country', { method: 'pending', code: '' })
    const [progress, setProgress] = useState(0)
    const [shareUrl, setShareUrl] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (country.method !== 'pending') return
        axios('https://feeds.intoday.in/geocheck').then(({ country_code }) => { // /location
            const code = country_code?.toLowerCase()
            countries[code] ? setCountry({ method: 'auto', code }) : setCountry({ method: 'auto', code: 'in' })
        })
    }, [country.method])

    async function queryFn(key, id, page, type = 'fetch') {
        setError()
        if (type !== 'prefetch') setProgress(33)
        const category = key[2] || 'general'
        if (category === 'saved') return { news: getStorage('news') }
        const { data: { success, nextPage, news } } = await axios({
            url: type === 'search' ? type : '', method: 'post',
            headers: { accesstoken: encrypt(Date.now()), 'Content-Type': 'application/json' },
            data: { country: key[1], category, page, query: key[3], date: key[4] }
        })
        if (!success) throw new Error('Something went wrong!')
        setProgress(100)
        const data = { nextPage, news }
        if (type === 'prefetch') onSuccess(id, { pageParams: [null], pages: [data] })
        return data
    }

    function onSuccess(id, data) { setStorage(id, data) }

    function onError(key, id, error) {
        const data = getStorage(id)
        if (data) client.setQueryData(key, data)
        setProgress(100)
        setError(error?.response?.data?.error || 'Unable to fetch news! Try again later...')
    }

    return <Context.Provider value={{ country, setCountry, progress, setProgress, shareUrl, setShareUrl, error, queryFn, onSuccess, onError }}>
        {props.children}
    </Context.Provider>
}

export default ContextProvider;