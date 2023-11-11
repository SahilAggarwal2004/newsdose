/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { sign } from "jssign";
import { useState, useContext, useEffect, createContext } from "react";
import { countries } from "../constants";
import { useStorage } from "../hooks";
import { getStorage } from "../modules/storage";
import { getFirstUrl } from "../modules/functions";

axios.defaults.baseURL = process.env.REACT_APP_URL

const Context = createContext()
export const useNewsContext = () => useContext(Context);

const ContextProvider = props => {
    const client = useQueryClient();
    const [country, setCountry] = useStorage('country', { method: 'auto', code: '' })
    const [pending, setPending] = useState(country.method === 'auto')
    const [progress, setProgress] = useState(0)
    const [shareUrl, setShareUrl] = useState(null)

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
        if (type !== 'prefetch') setProgress(33)
        const language = navigator.language.slice(0, 2)
        const data = { country: key[1], language, page, firstUrl: getFirstUrl(key, page) }
        if (key[0] === 'news') data.category = key[2] || 'top'
        else {
            data.query = key[2]
            data.date = key[3]
        }
        const { data: { success, nextPage, news } } = await axios({
            url: type === 'search' ? type : '', method: 'post',
            headers: { datatoken: sign(data, process.env.REACT_APP_SECRET, { expiresIn: 300000 }), 'Content-Type': 'application/json' }
        })
        if (!success || nextPage === undefined) throw new Error('Something went wrong!')
        setProgress(100)
        return { nextPage, news }
    }

    function onError(key) {
        const data = getStorage(key, undefined, key[0] === 'news')
        if (data) client.setQueryData(key, data)
        setProgress(100)
    }

    return <Context.Provider value={{ country, setCountry, pending, setPending, progress, setProgress, shareUrl, setShareUrl, queryFn, onError }}>
        {props.children}
    </Context.Provider>
}

export default ContextProvider;