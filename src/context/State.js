import axios from "axios";
import { useState } from "react";
import { useStorage } from "../hooks";
import Context from "./Context";

const State = (props) => {
    const categories = ["", "Business", "Entertainment", "Health", "Science", "Sports", "Technology", "Saved"]
    const [country, setCountry] = useStorage('country', 'in')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [articles, setArticles] = useState([])
    const [news, setNews] = useState([])
    const [load, setLoad] = useState(['hidden', '0'])
    const [end, setEnd] = useState(false)
    const [error, setError] = useState(false)
    const [shareUrl, setShareUrl] = useState(null)

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
        let parsedData;
        if (category === 'Saved') parsedData = JSON.parse(localStorage.getItem('news'))
        else {
            let storedData = JSON.parse(sessionStorage.getItem(`news${country}${category}`))
            if (storedData && storedData.articles.length >= storedData.maxResults && type === 'reload') parsedData = storedData
            else {
                if (storedData && type === 'reload') parsedData = storedData
                else {
                    let updatedPage;
                    storedData ? updatedPage = Math.ceil(storedData.articles.length / 21) + 1 : updatedPage = page
                    try {
                        const { data } = await axios({
                            url: process.env.REACT_APP_URL,
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            data: { country, category: category.toLowerCase(), page: updatedPage }
                        })
                        if (data.success === true) {
                            parsedData = data.news
                            setPage(page => page + 1)
                        } else if (data.success === false) parsedData = await fetchAgain(category, retryOnError)
                        else if (data.success === 'ended') setEnd(true)
                    } catch (error) { console.log(error); parsedData = await fetchAgain(category, retryOnError) }
                }
            }
        }
        setTimeout(() => {
            let { articles: data, maxResults } = parsedData || {}
            if (data?.length) {
                const newsToSet = news.concat(data)
                setArticles(articles.concat(data))
                setNews(newsToSet)
                const newsToStore = { status: "ok", totalResults: newsToSet.length, maxResults, articles: newsToSet }
                sessionStorage.setItem(`news${country}${category}`, JSON.stringify(newsToStore))
                localStorage.setItem(`news${country}${category}`, JSON.stringify(newsToStore))
            }
            setLoad(['visible', '100vw'])
            setError(parsedData?.error)
            setTimeout(() => setLoad(['hidden', '0vw']), 300);
        }, 0);
    }

    return (
        <Context.Provider value={{ categories, country, setCountry, query, setQuery, articles, setArticles, news, setNews, fetchData, load, setLoad, error, shareUrl, setShareUrl, end, setEnd, setPage }}>
            {props.children}
        </Context.Provider>
    )
}

export default State;