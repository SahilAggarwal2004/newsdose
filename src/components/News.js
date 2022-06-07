/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNewsContext } from '../context/State';
import Load from './Load';
import NewsItem from './NewsItem'

export default function News({ category }) {
    const { country, query, news: fullNews, fetchData, error, end, setEnd, load } = useNewsContext()
    console.time('1')
    const news = fullNews.filter(queryFilter)
    console.timeEnd('1')

    useEffect(() => {
        if (!country.code) return
        window.scrollTo(0, 0)
        setEnd(false)
        fetchData(category, true)
    }, [country.code])

    function queryFilter(element) {
        if (!query) return element
        const substr = query.toLowerCase();
        const { title, description, author, source: { name } } = element
        if ([title, description, author, name].join('~~').toLowerCase().includes(substr)) return element
    }

    document.title = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} | NewsDose` : 'NewsDose - Get your daily dose of news for free!'

    return (
        <div style={{ marginTop: "70px" }}>
            <h1 className="text-center fs-3 text-capitalize">Top Headlines{category && ` - ${category}`}</h1>
            <hr />
            <InfiniteScroll className="panel row mx-3 py-2 gx-4" next={() => fetchData(category, true, 'new')} hasMore={!end} loader={load[0] === 'visible' && <Load />} endMessage={news.length && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={fullNews.length}>
                {news.length ? news.map(element => <div className="col-md-4 d-flex" key={element.url}>
                    <NewsItem title={element.title} description={element.description} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} category={category} />
                </div>) : category === 'saved' ? <div className="text-center">
                    You haven't saved any news till now!
                </div> : query ? <div className="text-center">
                    Seems like there is no news related to <strong>{query}</strong>
                </div> : <div className="text-center">{error}</div>}
            </InfiniteScroll>
        </div>
    )
}