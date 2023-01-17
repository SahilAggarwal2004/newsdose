/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useState, useContext, useEffect, createContext } from "react";
import { countries } from "../constants";
import { useStorage } from "../hooks";
import { getStorage, setStorage } from "../modules/storage";

const Context = createContext()
export const useNewsContext = () => useContext(Context);

const ContextProvider = props => {
    const [country, setCountry] = useStorage('country', { method: 'auto', code: '' })
    const [fetchedIfAuto, setFetchedIfAuto] = useState(false)
    const [page, setPage] = useState(1)
    const [news, setNews] = useState([])
    const [fetched, setFetched] = useState([])
    const [progress, setProgress] = useState(0)
    const [end, setEnd] = useState(false)
    const [error, setError] = useState(false)
    const [shareUrl, setShareUrl] = useState(null)
    const category = window.location.pathname.slice(1)
    const id = country.code + category

    useEffect(() => {
        if (country.method !== 'auto') return
        fetch('https://feeds.intoday.in/geocheck') // process.env.REACT_APP_URL + 'location'
            .then(response => response.json())
            .then(({ country_code }) => {
                const code = country_code?.toLowerCase()
                countries[code] ? setCountry({ method: 'auto', code }) : setCountry({ method: 'auto', code: 'in' })
                setFetchedIfAuto(true)
            })
    }, [country.method])

    function resetNews() {
        setPage(1)
        setNews([])
        setProgress(0)
        setEnd(false)
        setError(false)
    }

    function updateData(parsedData, storedData) {
        const { articles, maxResults, local, error } = parsedData || {}
        const storedNews = storedData?.articles || []
        if (articles?.length) {
            var newsToSet = local ? articles : storedNews.concat(articles)
            setNews(newsToSet)
            const newsToStore = { status: "ok", totalResults: newsToSet.length, maxResults, articles: newsToSet }
            setStorage('news' + id, newsToStore)
        }
        setNews(newsToSet || storedNews)
        error ? setError(error) : setFetched(old => old.includes(id) ? old : old.concat(id))
    }

    function fetchAgain(retryOnError) {
        let parsedData;
        if (retryOnError) {
            parsedData = { articles: [], error: 'Unable to fetch news! Retrying...' }
            setTimeout(() => fetchData(false), 2000);
        } else {
            parsedData = getStorage('news' + id) || { articles: [], error: 'Unable to fetch news! Try again later...' }
            parsedData = { ...parsedData, local: true }
        }
        return parsedData
    }

    async function fetchData(retryOnError, type = 'reload') {
        setProgress(33)
        if (category === 'saved') {
            var parsedData = getStorage('news')
            setEnd(true)
        } else {
            var storedData = fetched.includes(id) && getStorage('news' + id)
            const { totalResults = 0, maxResults = 1 } = storedData || {}
            if (!navigator.onLine) parsedData = fetchAgain(false)
            else if (totalResults === maxResults) setEnd(true)
            else if (!storedData || type !== 'reload') {
                const updatedPage = storedData ? Math.ceil(totalResults / 24) + 1 : page
                try {
                    const { data: { success, news } } = await axios({
                        url: process.env.REACT_APP_URL,
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        data: { country: country.code, category: category || 'general', page: updatedPage }
                    })
                    if (success) {
                        parsedData = news
                        setPage(page => page + 1)
                    } else parsedData = await fetchAgain(retryOnError)
                } catch { parsedData = await fetchAgain(retryOnError) }
            }
        }
        updateData(parsedData, storedData)
        setProgress(100)
    }

    return <Context.Provider value={{ country, setCountry, news, setNews, fetchData, progress, setProgress, error, setError, shareUrl, setShareUrl, end, setEnd, setPage, resetNews, fetchedIfAuto }}>
        {props.children}
    </Context.Provider>
}

export default ContextProvider;