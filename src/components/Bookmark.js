/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { getStorage, setStorage } from '../modules/storage';

export default function Bookmark({ title, description, urlToImage, url, author, publishedAt, source }) {
    const [bookmark, setBookmark] = useState(<FaRegBookmark />)
    const isBookmark = () => getStorage('news', []).some(item => item.title === title)

    function saveNews() {
        let news = getStorage('news')
        if (isBookmark()) {
            news = news.filter(item => item.title !== title)
            setBookmark(<FaRegBookmark />)
        } else {
            news.push({ title, description, urlToImage, url, author, publishedAt, source })
            setBookmark(<FaBookmark />)
        }
        setStorage('news', news)
    }

    useEffect(() => { if (isBookmark()) setBookmark(<FaBookmark />) }, [])

    return <a role='button' onClick={saveNews}>{bookmark}</a>
}