/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { sign } from "mini-jwt";
import { useState, useContext, useEffect, createContext } from "react";
import { countries } from "../constants";
import { useStorage } from "../hooks";
import { getStorage, setStorage } from "../modules/storage";

axios.defaults.baseURL = process.env.REACT_APP_URL

const Context = createContext()
export const useNewsContext = () => useContext(Context);

const ContextProvider = props => {
    const client = useQueryClient();
    const [country, setCountry] = useStorage('country', { method: 'auto', code: '' })
    const [pending, setPending] = useState(country.method === 'auto')
    const [progress, setProgress] = useState(0)
    const [shareUrl, setShareUrl] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!pending) return
        axios('https://feeds.intoday.in/geocheck').then(({ data }) => { // /location
            const code = data.country_code?.toLowerCase()
            setCountry({ method: 'auto', code: countries[code] ? code : 'in' })
            setPending(false)
        }).catch(() => {
            setCountry({ method: 'auto', code: 'in' })
            setPending(false)
        })
    }, [pending])

    async function queryFn(key, page, type = 'fetch') {
        setError()
        if (type !== 'prefetch') setProgress(33)
        let data = key[0] === 'news' ? { country: key[1], category: key[2] || 'general', page } : { country: key[1], page, query: key[2], date: key[3] }
        const { data: { success, nextPage, news } } = await axios({
            url: type === 'search' ? type : '', method: 'post',
            headers: { datatoken: sign(process.env.REACT_APP_SECRET, data, { expiresIn: 30000 }), 'Content-Type': 'application/json' }
        })
        if (!success) throw new Error('Something went wrong!')
        setProgress(100)
        const pageData = { nextPage, news }
        if (type === 'prefetch') onSuccess(key, { pageParams: [null], pages: [pageData] })
        return pageData
    }

    function onSuccess(key, data) { setStorage(key, data, key[0] === 'news') }

    function onError(key, error) {
        const data = getStorage(key)
        if (data) client.setQueryData(key, data)
        setProgress(100)
        setError(error?.response?.data?.error || 'Unable to fetch news! Try again later...')
    }

    return <Context.Provider value={{ country, setCountry, pending, setPending, progress, setProgress, shareUrl, setShareUrl, error, queryFn, onSuccess, onError }}>
        {props.children}
    </Context.Provider>
}

export default ContextProvider;