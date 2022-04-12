import axios from "axios";
import React, { useState } from "react";
import Context from "./Context";

const State = (props) => {
    const categories = ["", "Business", "Entertainment", "Health", "Science", "Sports", "Technology", "Saved"]
    const [country, setCountry] = useState(localStorage.getItem('country') || 'in')
    const [query, setQuery] = useState('')
    const [articles, setArticles] = useState([])
    const [news, setNews] = useState([])
    const [load, setLoad] = useState([false, 'hidden', '0'])
    const [error, setError] = useState(false)
    const [shareUrl, setShareUrl] = useState(null)

    async function fetchAgain(category, retryOnError) {
        let parsedData;
        if (retryOnError) {
            parsedData = { articles: [], error: 'Unable to fetch news! Retrying...' }
            setTimeout(() => {
                fetchData(category, false)
            }, 2500);
        } else {
            parsedData = JSON.parse(localStorage.getItem(`news${country}${category}`)) || { articles: [], error: 'Unable to fetch news! Try again later...' }
        }
        return parsedData
    }

    async function fetchData(category, retryOnError) {
        setLoad([true, 'visible', '33vw'])
        let parsedData = JSON.parse(sessionStorage.getItem(`news${country}${category}`))
        if (!parsedData) {
            if (category === 'Saved') { parsedData = JSON.parse(localStorage.getItem('news')) }
            else {
                try {
                    const { data } = await axios({
                        url: process.env.REACT_APP_URL,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        data: { country: country, category: category.toLowerCase() }
                    })
                    if (data.success) {
                        parsedData = data.news;
                        sessionStorage.setItem(`news${country}${category}`, JSON.stringify(parsedData))
                        localStorage.setItem(`news${country}${category}`, JSON.stringify(parsedData))
                    } else parsedData = await fetchAgain(category, retryOnError)
                } catch { parsedData = await fetchAgain(category, retryOnError) }
            }
        }
        setTimeout(() => {
            setArticles(parsedData?.articles)
            setNews(parsedData?.articles)
            setLoad([true, 'visible', '100vw'])
            setError(parsedData?.error)
        }, 0);
        setTimeout(() => {
            setLoad([false, 'hidden', '0vw'])
        }, 300);
    }

    return (
        <Context.Provider value={{ categories, country, setCountry, query, setQuery, articles, setArticles, news, setNews, fetchData, load, setLoad, error, shareUrl, setShareUrl }}>
            {props.children}
        </Context.Provider>
    )
}

export default State;