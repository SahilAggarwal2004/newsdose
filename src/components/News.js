import React, { useEffect, useContext } from 'react'
import Context from '../context/Context';
import Load from './Load';
import NewsItem from './NewsItem'

export default function News(props) {
    const { query, news, setNews, articles, fetchData, load, error } = useContext(Context)
    const { category } = props

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchData(category)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (query) {
            const substr = query.toLowerCase();
            let result = [];
            articles.forEach(element => {
                const title = element.title ? element.title.toLowerCase() : ''
                const description = element.description ? element.description.toLowerCase() : ''
                const author = element.author ? element.author.toLowerCase() : ''
                const source = element.source.name ? element.source.name.toLowerCase() : ''
                if (title.includes(substr) || description.includes(substr) || author.includes(substr) || source.includes(substr)) {
                    result.push(element)
                }
            });
            setNews(result)
        } else {
            setNews(articles)
        }
        // eslint-disable-next-line
    }, [query])

    document.title = category ? `${category} | NewsDose` : 'NewsDose - Get your daily dose of news for free!'

    return (
        <div style={{ marginTop: "70px" }}>
            <h3 className="text-center">Top Headlines{category ? ` - ${category}` : ""}</h3>
            <hr />
            {!load[0] ? <div className="panel row mx-3 py-2 gx-4">
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
            </div> : <Load />}
        </div>
    )
}
