/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { BsFillInfoSquareFill } from 'react-icons/bs'
import { FaShareAlt, FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { useNewsContext } from '../context/ContextProvider'

export default function NewsItem({ title, description, imgUrl, newsUrl, author, date, source }) {
    const { setShareUrl } = useNewsContext()
    const [volume, setVolume] = useState(<HiVolumeUp role='button' className="scale me-4 p-1" onClick={speech} />)
    const [bookmark, setBookmark] = useState(<FaRegBookmark role='button' className='scale me-4 p-1' onClick={saveNews} />)

    const newsImg = 'https://images.weserv.nl/?url=https://newsdoseweb.herokuapp.com/media/news.webp&width=450&height=300&maxage=1y&q=50';
    let imgUrlWeserv = newsImg
    if (imgUrl?.match(/https/g)?.length == 1) {
        const connectionSpeed = navigator.connection?.effectiveType
        imgUrlWeserv = `https://images.weserv.nl/?url=${imgUrl}&width=450&height=300&maxage=1d&output=webp&q=${connectionSpeed?.includes('2') ? 5 : connectionSpeed?.includes('3') ? 10 : 25}`
    }

    function checkBookmark() {
        let count = 0
        const news = JSON.parse(localStorage.getItem('news')) || { articles: [] }
        news.articles.forEach(element => { if (title === element?.title) count++ });
        return Boolean(count)
    }

    let speechId = null;
    function speech() { handleSpeech(title) }
    function handleSpeech(clickId) {
        const speaking = speechSynthesis.speaking;
        const newSpeech = () => {
            speechId = clickId;
            const text = title + '. ' + description;
            setVolume(<HiVolumeOff role='button' className="scale me-4 p-1" onClick={speech} />)
            const utterance = new SpeechSynthesisUtterance(text.replace(/\s/g, ' '))
            speechSynthesis.speak(utterance)
            utterance.onend = () => {
                speechId = null
                setVolume(<HiVolumeUp role='button' className="scale me-4 p-1" onClick={speech} />)
            }
        }
        if (!speaking) return newSpeech()
        speechSynthesis.cancel()
        if (speechId !== clickId) return newSpeech()
        speechId = null;
        setVolume(<HiVolumeUp role='button' className="scale me-4 p-1" onClick={speech} />)
    }

    function saveNews() {
        const news = JSON.parse(localStorage.getItem('news')) || { articles: [] }
        const isBoomarked = checkBookmark()
        if (isBoomarked) {
            news.articles = news.articles.filter(element => { return element.title !== title })
            setBookmark(<FaRegBookmark role='button' className='scale me-4 p-1' onClick={saveNews} />)
        } else {
            news.articles.push({ title, description, urlToImage: imgUrl, url: newsUrl, author, publishedAt: date, source: { name: source } })
            setBookmark(<FaBookmark role='button' className='scale me-4 p-1' onClick={saveNews} />)
        }
        localStorage.setItem('news', JSON.stringify(news))
    }

    useEffect(() => {
        const isBoomarked = checkBookmark()
        if (isBoomarked) setBookmark(<FaBookmark role='button' className='scale me-4 p-1' onClick={saveNews} />)
    }, [])

    return <div className="card mt-4 mb-3" style={{ paddingBottom: "2rem" }}>
        <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger border">{source}</span>
        <a href={newsUrl} target="_blank" rel="noreferrer" className="text-black">
            <div style={{ height: "13rem" }}>
                <img src={imgUrlWeserv} onError={event => event.target.src = newsImg} loading='lazy' className="card-img-top h-100" alt='' />
            </div>
        </a>
        <div className="card-body">
            <hr />
            <a href={newsUrl} target="_blank" rel="noreferrer" className="text-black text-decoration-none">
                <h5 className="card-title">{title}</h5>
                <hr />
                <p className="card-text">{description}</p>
            </a>
            <p className="card-text mt-2"><small className="text-muted">Published {author && `by ${author}`} on {new Date(date).toUTCString()}</small></p>
            <div className='position-absolute d-flex align-items-center m-1' style={{ bottom: "1rem" }}>
                <a>{volume}</a>
                <a>{bookmark}</a>
                <a><FaShareAlt role='button' className="scale me-4 p-1" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setShareUrl(newsUrl)} /></a>
                <a href={newsUrl} target="_blank" rel="noreferrer" className="text-black">
                    <BsFillInfoSquareFill role='button' className="scale p-1" />
                </a>
            </div>
        </div>
    </div >
}