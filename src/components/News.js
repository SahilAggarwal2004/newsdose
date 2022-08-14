/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNewsContext } from '../context/ContextProvider';
import { useStorage } from '../hooks';
import Loader from './Loader';
import NewsItem from './NewsItem'

export default function News({ category }) {
    const { country, news: fullNews, fetchData, error, end, setEnd, load, fetchedIfAuto } = useNewsContext()
    const [query, setQuery] = useStorage('query', '', { local: false, session: true })
    const news = fullNews.filter(queryFilter)

    useEffect(() => {
        if (navigator.onLine) {
            if (!country.code) return
            if (country.method === 'auto' && !fetchedIfAuto) return
        }
        window.scrollTo(0, 0)
        setEnd(false)
        fetchData(category, true)
    }, [country.code, fetchedIfAuto])

    function queryFilter(element) {
        if (!query) return element
        const substr = query.toLowerCase();
        const { title, description, author, source: { name } } = element
        if ([title, description, author, name].join('~~').toLowerCase().includes(substr)) return element
    }

    document.title = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} | NewsDose` : 'NewsDose - Get your daily dose of news for free!'

    return <div style={{ marginTop: "70px" }}>
        <div className='grid container-fluid'>
            <h1 className="text-center fs-3 text-capitalize mb-0">Top Headlines{category && ` - ${category}`}</h1>
            <input className="form-control w-auto" type="search" placeholder="Search" aria-label="Search" value={query} onChange={event => setQuery(event.target.value)} />
        </div>
        <hr />
        <InfiniteScroll className="panel row mx-3 py-2 gx-4" next={() => fetchData(category, true, 'new')} hasMore={!end} loader={load[0] === 'visible' && <Loader />} endMessage={Boolean(news.length) && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={fullNews.length}>
            {news.length ? news.map(element => {
                const { title, description, urlToImage, url, author, publishedAt, source } = element
                return <div className="col-sm-6 col-lg-4 d-flex" key={url}>
                    <NewsItem title={title} description={description} imgUrl={urlToImage} newsUrl={url} author={author} date={publishedAt} source={source.name} />
                </div>
            }) : category === 'saved' ? <div className="text-center">
                You haven't saved any news till now!
            </div> : query && load[0] === 'hidden' && country.code ? <div className="text-center">
                Seems like there is no news related to <strong>{query}</strong>
            </div> : load[0] === 'hidden' && country.code && error ? <div className="text-center">{error}</div> : load[0] === 'hidden' && <Loader />}
        </InfiniteScroll >
    </div >
}