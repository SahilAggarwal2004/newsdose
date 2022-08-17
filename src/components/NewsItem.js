/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { BsFillInfoSquareFill } from 'react-icons/bs'
import { FaShareAlt } from 'react-icons/fa'
import { useNewsContext } from '../context/ContextProvider'
import Bookmark from './Bookmark'
import Speech from 'react-text-to-speech';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'

export default function NewsItem(props) {
    const { title, description, imgUrl, newsUrl, author, date, source, dateFormat } = props
    const { setShareUrl } = useNewsContext()
    const showDate = dateFormat === 'UTC' ? new Date(date).toUTCString() : new Date(date).toLocaleString()

    const newsImg = 'https://images.weserv.nl/?url=https://newsdoseweb.herokuapp.com/media/news.webp&width=450&height=300&maxage=1y&q=50';
    let imgUrlWeserv = newsImg
    if (imgUrl?.match(/https/g)?.length === 1) {
        const connectionSpeed = navigator.connection?.effectiveType
        imgUrlWeserv = `https://images.weserv.nl/?url=${imgUrl}&width=450&height=300&maxage=1d&output=webp&q=${connectionSpeed?.includes('2') ? 5 : connectionSpeed?.includes('3') ? 10 : 25}`
    }

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
            <p className="card-text mt-2"><small className="text-muted">Published {author && `by ${author}`} on {showDate}</small></p>
            <div className='position-absolute d-flex align-items-center m-1' style={{ bottom: "1rem" }}>
                <span className="scale me-3 p-1">
                    <Speech id={title} text={`${title}. ${description ? description : ''}`} startBtn={<HiVolumeUp />} stopBtn={<HiVolumeOff />} />
                </span>
                <span className="scale me-3 p-1">
                    <Bookmark {...props} />
                </span>
                <span className="scale me-3 p-1">
                    <FaShareAlt role='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setShareUrl(newsUrl)} />
                </span>
                <a href={newsUrl} target="_blank" rel="noreferrer" className="text-black scale p-1">
                    <BsFillInfoSquareFill />
                </a>
            </div>
        </div>
    </div >
}