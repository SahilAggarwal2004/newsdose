"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useContext, useEffect, createContext } from "react";
import { countries } from "@/constants";
import useStorage from "@/hooks/useStorage";
import { getStorage, setStorage } from "@/modules/storage";
import { getFirstUrl } from "@/modules/functions";
import { newToken } from "@/modules/token";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL

const Context = createContext()
export const useNewsContext = () => useContext(Context);

export default function ContextProvider({ children }) {
    const client = useQueryClient();
    const [country, setCountry] = useStorage('country', { method: 'auto', code: '' })
    const [loading, setLoading] = useState(true)
    const [pending, setPending] = useState(country.method === 'auto')
    const [progress, setProgress] = useState(0)
    const [shareUrl, setShareUrl] = useState(null)

    useEffect(() => { setLoading(false) }, [])

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

    async function queryFn({ queryKey, pageParam = 1, type = 'prefetch' }) {
        if (type !== 'prefetch') setProgress(33)
        const data = { country: queryKey[1], language: navigator.language.slice(0, 2), pageParam, firstUrl: getFirstUrl(queryKey, pageParam) }
        if (queryKey[0] === 'news') data.category = queryKey[2] || 'top'
        else {
            data.query = queryKey[2]
            data.date = queryKey[3]
        }
        let [token, expiry] = getStorage('token', [])
        if (!token || Date.now() > expiry) [token] = setStorage('token', await newToken())
        const { data: { success, nextPage, news } } = await axios({
            url: type === 'search' ? type : '', method: 'post', data,
            headers: { token, 'Content-Type': 'application/json' }
        })
        if (!success || nextPage === undefined) throw new Error()
        setProgress(100)
        return { nextPage, news }
    }

    function onError(queryKey) {
        const data = getStorage(queryKey, undefined, queryKey[0] === 'news')
        if (data) client.setQueryData(queryKey, data)
        setProgress(100)
    }

    return !loading && <Context.Provider value={{ country, setCountry, pending, setPending, progress, setProgress, shareUrl, setShareUrl, queryFn, onError }}>
        {children}
    </Context.Provider>
}