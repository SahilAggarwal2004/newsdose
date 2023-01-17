/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useState, useContext, useEffect, createContext } from "react";
import { useLocation } from "react-router-dom";
import { countries } from "../constants";
import { useStorage } from "../hooks";

const Context = createContext()
export const useNewsContext = () => useContext(Context);

const ContextProvider = props => {
    const [country, setCountry] = useStorage('country', { method: 'auto', code: '' })
    const [fetchedIfAuto, setFetchedIfAuto] = useState(false)
    const [page, setPage] = useState(1)
    const [news, setNews] = useState([])
    const [searchNews, setSearchNews] = useState([])
    const [progress, setProgress] = useState(0)
    const [end, setEnd] = useState(false)
    const [error, setError] = useState(false)
    const [shareUrl, setShareUrl] = useState(null)
    const location = useLocation();

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
        setSearchNews([])
        setProgress(0)
        setEnd(false)
        setError(false)
    }

    function updateData(category, parsedData, storedData) {
        const { articles, maxResults, local, error } = parsedData || {}
        const storedNews = storedData?.articles || []
        const sameCategory = location.pathname === `/${category}`
        if (articles?.length) {
            const newsToSet = local ? articles : storedNews.concat(articles)
            if (sameCategory) setNews(newsToSet)
            const newsToStore = { status: "ok", totalResults: newsToSet.length, maxResults, articles: newsToSet }
            sessionStorage.setItem(`news${country.code}${category}`, JSON.stringify(newsToStore))
            localStorage.setItem(`news${country.code}${category}`, JSON.stringify(newsToStore))
        } else if (sameCategory) setNews(storedNews)
        setError(error)
    }

    function fetchAgain(category, retryOnError) {
        let parsedData;
        if (retryOnError) {
            parsedData = { articles: [], error: 'Unable to fetch news! Retrying...' }
            setTimeout(() => fetchData(category, false), 2000);
        } else {
            parsedData = JSON.parse(localStorage.getItem(`news${country.code}${category}`)) || { articles: [], error: 'Unable to fetch news! Try again later...' }
            parsedData = { ...parsedData, local: true }
        }
        return parsedData
    }

    async function fetchData(category, retryOnError, type = 'reload') {
        setProgress(33)
        let parsedData
        if (category === 'saved') {
            parsedData = JSON.parse(localStorage.getItem('news'))
            setEnd(true)
        } else {
            var storedData = JSON.parse(sessionStorage.getItem(`news${country.code}${category}`))
            const { totalResults, maxResults } = storedData || { totalResults: 0, maxResults: 1 }
            if (!navigator.onLine) parsedData = fetchAgain(category, false)
            else if (totalResults === maxResults) setEnd(true)
            else if (!storedData || type !== 'reload') {
                let updatedPage;
                storedData ? updatedPage = Math.ceil(totalResults / 24) + 1 : updatedPage = page
                try {
                    const { data } = await axios({
                        url: process.env.REACT_APP_URL,
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        data: { country: country.code, category: category || 'general', page: updatedPage }
                    })
                    if (data.success) {
                        parsedData = data.news
                        setPage(page => page + 1)
                    } else parsedData = await fetchAgain(category, retryOnError)
                } catch { parsedData = await fetchAgain(category, retryOnError) }
            }
        }
        updateData(category, parsedData, storedData)
        setProgress(100)
    }

    return <Context.Provider value={{ country, setCountry, news, setNews, searchNews, setSearchNews, fetchData, progress, setProgress, error, setError, shareUrl, setShareUrl, end, setEnd, setPage, resetNews, fetchedIfAuto }}>
        {props.children}
    </Context.Provider>
}

export default ContextProvider;