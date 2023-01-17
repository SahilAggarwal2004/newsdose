/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { getStorage, setStorage } from '../modules/storage';

export default function Bookmark({ title, description, urlToImage, url, author, publishedAt, source }) {
    const [bookmark, setBookmark] = useState(<FaRegBookmark />)
    const isBookmark = () => getStorage('news')?.articles?.some(item => item.title === title)

    function saveNews() {
        const news = getStorage('news', { articles: [] })
        if (isBookmark()) {
            news.articles = news.articles.filter(item => item.title !== title)
            setBookmark(<FaRegBookmark />)
        } else {
            news.articles.push({ title, description, urlToImage, url, author, publishedAt, source })
            setBookmark(<FaBookmark />)
        }
        setStorage('news', news)
    }

    useEffect(() => { if (isBookmark()) setBookmark(<FaBookmark />) }, [])

    return <a role='button' onClick={saveNews}>{bookmark}</a>
}