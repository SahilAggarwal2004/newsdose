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
    const [country, setCountry] = useStorage('country', { method: 'auto', code: '' })
    const auto = country.method === 'auto'
    const [pending, setPending] = useState(auto)
    const [progress, setProgress] = useState(0)
    const [shareUrl, setShareUrl] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!auto || !pending) return
        axios('https://feeds.intoday.in/geocheck').then(({ data }) => { // /location
            const code = data.country_code?.toLowerCase()
            setCountry({ method: 'auto', code: countries[code] ? code : 'in' })
            setPending(false)
        }).catch(() => {
            setCountry({ method: 'auto', code: 'in' })
            setPending(false)
        })
    }, [auto])

    async function queryFn(key, page, type = 'fetch') {
        setError()
        if (type !== 'prefetch') setProgress(33)
        const { data: { success, nextPage, news } } = await axios({
            url: type === 'search' ? type : '', method: 'post',
            headers: { accesstoken: encrypt(Date.now()), 'Content-Type': 'application/json' },
            data: { country: key[1], category: key[2] || 'general', page, query: key[3], date: key[4] }
        })
        if (!success) throw new Error('Something went wrong!')
        setProgress(100)
        const data = { nextPage, news }
        if (type === 'prefetch') onSuccess(key, { pageParams: [null], pages: [data] })
        return data
    }

    function onSuccess(key, data) { setStorage(key, data, key[0] === 'news') }

    function onError(key, error) {
        const data = getStorage(key)
        if (data) client.setQueryData(key, data)
        setProgress(100)
        setError(error?.response?.data?.error || 'Unable to fetch news! Try again later...')
    }

    return <Context.Provider value={{ country, setCountry, pending, progress, setProgress, shareUrl, setShareUrl, error, queryFn, onSuccess, onError }}>
        {props.children}
    </Context.Provider>
}

export default ContextProvider;