/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

export default function Bookmark({ title, description, imgUrl, newsUrl, author, date, source }) {
    const [bookmark, setBookmark] = useState(<FaRegBookmark />)

    function checkBookmark() {
        const news = JSON.parse(localStorage.getItem('news'))?.articles || []
        for (let i = 0; i < news.length; i++) {
            const element = news[i];
            if (title === element?.title) return true
        }
        return false
    }

    function saveNews() {
        const news = JSON.parse(localStorage.getItem('news')) || { articles: [] }
        const isBoomarked = checkBookmark()
        if (isBoomarked) {
            news.articles = news.articles.filter(element => element.title !== title)
            setBookmark(<FaRegBookmark />)
        } else {
            news.articles.push({ title, description, urlToImage: imgUrl, url: newsUrl, author, publishedAt: date, source: { name: source } })
            setBookmark(<FaBookmark />)
        }
        localStorage.setItem('news', JSON.stringify(news))
    }

    useEffect(() => {
        const isBoomarked = checkBookmark()
        if (isBoomarked) setBookmark(<FaBookmark />)
    }, [])

    return <a role='button' onClick={saveNews}>{bookmark}</a>
}