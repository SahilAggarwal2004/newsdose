import React, { useContext, useEffect, useState } from 'react'
import Context from '../context/Context'

export default function NewsItem(props) {
    let { title, description, imgUrl, newsUrl, author, date, source } = props
    let newsImg = 'https://newsdoseweb.netlify.app/news.webp'
    newsImg = `//images.weserv.nl/?url=${newsImg}&maxage=1y`;
    imgUrl = `//images.weserv.nl/?url=${imgUrl}&maxage=1d&output=webp&q=25`;
    const { setShareUrl } = useContext(Context)
    const [bookmark, setBookmark] = useState('far')

    function checkBookmark() {
        let count = 0
        let news = JSON.parse(localStorage.getItem('news'))
        if (!news) news = { articles: [] }
        news.articles.forEach(element => { if (title === element?.title) count++ });
        return Boolean(count)
    }

    let speechId = null;
    function speech(event) {
        const speaking = speechSynthesis.speaking;
        const clickId = title;
        const newSpeech = () => {
            event.target.classList.remove('fa-volume')
            event.target.classList.add('fa-volume-mute')
            const text = title + '. ' + description;
            speechId = clickId;
            const utterance = new SpeechSynthesisUtterance(text.replace(/\s/g, ' '))
            speechSynthesis.speak(utterance)
            utterance.onend = () => {
                const elementClass = document.getElementById(clickId).classList
                elementClass.add('fa-volume')
                elementClass.remove('fa-volume-mute')
                speechId = null
            }
        }

        if (!speaking) {
            newSpeech()
            return
        }
        speechSynthesis.cancel()
        if (speechId !== clickId) {
            newSpeech()
            return
        }
        event.target.classList.add('fa-volume')
        event.target.classList.remove('fa-volume-mute')
        speechId = null;
    }

    function saveNews(event) {
        let news = JSON.parse(localStorage.getItem('news'))
        if (!news) news = { articles: [] }
        const isBoomarked = checkBookmark()
        if (isBoomarked) {
            news.articles = news.articles.filter(element => { return element.title !== title })
        } else {
            news.articles.push({ title, description, urlToImage: imgUrl, url: newsUrl, author, publishedAt: date, source: { name: source } })
        }
        localStorage.setItem('news', JSON.stringify(news))
        event.target.classList.toggle('far')
        event.target.classList.toggle('fas')
    }

    useEffect(() => {
        const isBoomarked = checkBookmark()
        if (isBoomarked) setBookmark('fas')
        // eslint-disable-next-line
    }, [])

    return (
        <div className="card mt-4 mb-3" style={{ paddingBottom: "2rem" }}>
            <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger border">{source}</span>
            <a href={newsUrl} target="_blank" rel="noreferrer" className="text-black">
                <img src={imgUrl ? imgUrl : newsImg} onError={event => { event.target.src = newsImg }} loading='lazy' className="card-img-top" alt="News" style={{ height: "12rem" }} />
            </a>
            <div className="card-body">
                <hr />
                <a href={newsUrl} target="_blank" rel="noreferrer" className="text-black text-decoration-none">
                    <h5 className="card-title">{title}</h5>
                    <hr />
                    <p className="card-text">{description}</p>
                </a>
                <p className="card-text mt-2"><small className="text-muted">Published {author ? `by ${author}` : ""} on {new Date(date).toLocaleString()}</small></p>
                <div className='position-absolute' style={{ bottom: "1rem" }}>
                    <i role='button' className="fas fa-volume me-3 p-1" onClick={speech} />
                    <i role='button' className={`${bookmark} fa-bookmark me-3 p-1`} onClick={saveNews} />
                    <i role='button' className="fas fa-share-alt me-3 p-1" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setShareUrl(newsUrl)} />
                    <a href={newsUrl} target="_blank" rel="noreferrer" className="text-black">
                        <i role='button' className="fas fa-info-square p-1" />
                    </a>
                </div>
            </div>
        </div >
    )
}
