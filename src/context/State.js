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

    async function fetchData(category) {
        setLoad([true, 'visible', '33vw'])
        let parsedData = JSON.parse(sessionStorage.getItem(`news${country}${category}`))
        if (!parsedData) {
            if (category === 'Saved') { parsedData = JSON.parse(localStorage.getItem('news')) }
            else {
                try {
                    const response = await fetch(process.env.REACT_APP_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            country: country,
                            category: category.toLowerCase()
                        })
                    });
                    const data = await response.json()
                    if (data.success) {
                        parsedData = data.news;
                        sessionStorage.setItem(`news${country}${category}`, JSON.stringify(parsedData))
                    } else { parsedData = { articles: [], error: 'Unable to fetch! Try again later...' } }
                } catch { parsedData = { articles: [], error: 'Unable to fetch! Try again later...' } }
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
        <Context.Provider value={{ categories, country, setCountry, query, setQuery, articles, setArticles, news, setNews, fetchData, load, setLoad, error }}>
            {props.children}
        </Context.Provider>
    )
}

export default State;