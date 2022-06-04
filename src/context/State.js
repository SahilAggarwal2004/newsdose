import axios from "axios";
import { useState, useContext } from "react";
import { useStorage } from "../hooks";
import Context from "./Context";

export const useNewsContext = () => useContext(Context);

const State = props => {
    const categories = ["", "business", "entertainment", "health", "science", "sports", "technology", "saved"]
    const [country, setCountry] = useStorage('country', 'in')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [news, setNews] = useState([])
    const [load, setLoad] = useState(['hidden', '0'])
    const [end, setEnd] = useState(false)
    const [error, setError] = useState(false)
    const [shareUrl, setShareUrl] = useState(null)

    function updateData(category, parsedData, storedData) {
        const storedNews = storedData?.articles || []
        const newsToSet = storedNews.concat(parsedData?.articles || [])
        if (newsToSet.length) {
            setNews(newsToSet)
            const maxResults = parsedData?.maxResults || storedData?.maxResults
            const newsToStore = { status: "ok", totalResults: newsToSet.length, maxResults, articles: newsToSet }
            sessionStorage.setItem(`news${country}${category}`, JSON.stringify(newsToStore))
            localStorage.setItem(`news${country}${category}`, JSON.stringify(newsToStore))
        }
        setLoad(['visible', '100vw'])
        setError(parsedData?.error)
        setTimeout(() => setLoad(['hidden', '0vw']), 300);
    }

    function fetchAgain(category, retryOnError) {
        let parsedData;
        if (retryOnError) {
            parsedData = { articles: [], error: 'Unable to fetch news! Retrying...' }
            setTimeout(() => fetchData(category, false), 2500);
        } else parsedData = JSON.parse(localStorage.getItem(`news${country}${category}`)) || { articles: [], error: 'Unable to fetch news! Try again later...' }
        return parsedData
    }

    async function fetchData(category, retryOnError, type = 'reload') {
        setLoad(['visible', '33vw'])
        let parsedData, storedData
        if (category === 'saved') parsedData = JSON.parse(localStorage.getItem('news'))
        else {
            storedData = JSON.parse(sessionStorage.getItem(`news${country}${category}`))
            const { totalResults, maxResults } = storedData || { totalResults: 0, maxResults: 1 }
            if (totalResults === maxResults) setEnd(true)
            else if (!storedData || type !== 'reload') {
                let updatedPage;
                storedData ? updatedPage = Math.ceil(totalResults / 21) + 1 : updatedPage = page
                try {
                    const { data } = await axios({
                        url: process.env.REACT_APP_URL,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        data: { country, category: category || 'general', page: updatedPage }
                    })
                    if (data.success) {
                        parsedData = data.news
                        setPage(page => page + 1)
                    } else parsedData = await fetchAgain(category, retryOnError)
                } catch { parsedData = await fetchAgain(category, retryOnError) }
            }
        }
        updateData(category, parsedData, storedData)
    }

    return (
        <Context.Provider value={{ categories, country, setCountry, query, setQuery, news, setNews, fetchData, load, error, shareUrl, setShareUrl, end, setEnd, setPage }}>
            {props.children}
        </Context.Provider>
    )
}

export default State;