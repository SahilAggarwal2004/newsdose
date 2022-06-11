/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useStorage } from "../hooks";
import Context from "./Context";

export const useNewsContext = () => useContext(Context);

const State = props => {
    const [country, setCountry] = useStorage('country', { method: 'auto', code: '' })
    const countries = { au: "Australia", ca: "Canada", in: "India", ie: "Ireland", my: "Malaysia", ng: "Nigeria", nz: "New Zealand", ph: "Philippines", sa: "Saudi Arabia", sg: "Singapore", za: "South Africa", gb: "United Kingdom", us: "United States" }
    const categories = ["", "business", "entertainment", "health", "science", "sports", "technology", "search", "saved"]
    const [page, setPage] = useState(1)
    const [news, setNews] = useState([])
    const [searchNews, setSearchNews] = useState([])
    const [load, setLoad] = useState(['hidden', '0'])
    const [end, setEnd] = useState(false)
    const [error, setError] = useState(false)
    const [shareUrl, setShareUrl] = useState(null)

    useEffect(() => {
        if (country.method !== 'auto') return
        fetch(process.env.REACT_APP_URL + 'location')
            .then(response => response.json())
            .then(({ code }) => countries[code] ? setCountry({ method: 'auto', code }) : setCountry({ method: 'auto', code: 'in' }))
    }, [country.method])

    function resetNews() {
        setPage(1)
        setNews([])
        setSearchNews([])
        setLoad(['hidden', '0'])
        setEnd(false)
        setError(false)
    }

    function updateData(category, parsedData, storedData) {
        const { articles, maxResults, error } = parsedData || {}
        const storedNews = storedData?.articles || []
        if (articles?.length) {
            const newsToSet = storedNews.concat(articles)
            setNews(newsToSet)
            const newsToStore = { status: "ok", totalResults: newsToSet.length, maxResults, articles: newsToSet }
            sessionStorage.setItem(`news${country.code}${category}`, JSON.stringify(newsToStore))
            localStorage.setItem(`news${country.code}${category}`, JSON.stringify(newsToStore))
        } else setNews(storedNews)
        setError(error)
    }

    function fetchAgain(category, retryOnError) {
        let parsedData;
        if (retryOnError) {
            parsedData = { articles: [], error: 'Unable to fetch news! Retrying...' }
            setTimeout(() => fetchData(category, false), 2500);
        } else parsedData = JSON.parse(localStorage.getItem(`news${country.code}${category}`)) || { articles: [], error: 'Unable to fetch news! Try again later...' }
        return parsedData
    }

    async function fetchData(category, retryOnError, type = 'reload') {
        setLoad(['visible', '33vw'])
        let parsedData, storedData
        if (category === 'saved') parsedData = JSON.parse(localStorage.getItem('news'))
        else {
            storedData = JSON.parse(sessionStorage.getItem(`news${country.code}${category}`))
            const { totalResults, maxResults } = storedData || { totalResults: 0, maxResults: 1 }
            if (totalResults === maxResults) setEnd(true)
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
        setLoad(['visible', '100vw'])
        setTimeout(() => setLoad(['hidden', '0vw']), 300);
    }

    return (
        <Context.Provider value={{ countries, categories, country, setCountry, news, setNews, searchNews, setSearchNews, fetchData, load, setLoad, error, setError, shareUrl, setShareUrl, end, setEnd, setPage, resetNews }}>
            {props.children}
        </Context.Provider>
    )
}

export default State;