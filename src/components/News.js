/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Context from '../context/Context';
import Load from './Load';
import NewsItem from './NewsItem'

export default function News({ category }) {
    const { query, setQuery, news, setNews, articles, fetchData, error, end } = useContext(Context)

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchData(category, true)
        return () => setQuery('')
    }, [])

    useEffect(() => {
        if (query) {
            const substr = query.toLowerCase();
            let result = [];
            articles.forEach(element => {
                const title = element.title?.toLowerCase() || ''
                const description = element.description?.toLowerCase() || ''
                const author = element.author?.toLowerCase() || ''
                const source = element.source?.name?.toLowerCase() || ''
                if (title.includes(substr) || description.includes(substr) || author.includes(substr) || source.includes(substr)) result.push(element)
            });
            setNews(result)
        } else setNews(articles)
    }, [query])

    document.title = category ? `${category} | NewsDose` : 'NewsDose - Get your daily dose of news for free!'

    return (
        <div style={{ marginTop: "70px" }}>
            <h1 className="text-center fs-3">Top Headlines{category ? ` - ${category}` : ""}</h1>
            <hr />
            <InfiniteScroll next={() => fetchData(category, true, 'new')} hasMore={!end} loader={<Load />} endMessage={<p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={news?.length ?? 0}>
                {<div className="panel row mx-3 py-2 gx-4">
                    {news?.length ? news.map(element => {
                        return (<div className="col-md-4 d-flex" key={element.url}>
                            <NewsItem title={element.title} description={element.description} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} category={category} />
                        </div>)
                    }) : category === 'Saved' ? <div className="text-center">
                        You haven't saved any news till now!
                    </div> : query ? <div className="text-center">
                        Seems like there is no news related to <strong>{query}</strong>
                    </div> : <div className="text-center">
                        {error}
                    </div>}
                </div>}
            </InfiniteScroll>
        </div>
    )
}
