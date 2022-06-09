/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNewsContext } from '../context/State'
import { useDebounce, useStorage } from '../hooks'
import Loader from './Loader'
import NewsItem from './NewsItem'

export default function Search() {
    const { categories, country, load, setLoad, error, setError, searchNews, setSearchNews, page, setPage, resetNews } = useNewsContext()
    const [category, setCategory] = useState('all')
    const [search, setSearch] = useStorage('query', '', { local: false, session: true })
    const [end, setEnd] = useState(false)
    const query = useDebounce(search)

    function updateQuery(event) {
        setSearch(event.target.value)
        resetNews()
    }

    function updateCategory(event) {
        setCategory(event.target.value)
        resetNews()
    }

    function updateData(parsedData, storedData) {
        const { articles, maxResults } = parsedData || {}
        const storedNews = storedData?.articles || []
        if (articles?.length) {
            const newsToSet = storedNews.concat(articles)
            setSearchNews(newsToSet)
            const newsToStore = { status: "ok", totalResults: newsToSet.length, maxResults, articles: newsToSet }
            sessionStorage.setItem(`search${country.code}${category}${query}`, JSON.stringify(newsToStore))
        } else setSearchNews(storedNews)
    }

    async function searchBackend(type = 'reload') {
        setLoad(['visible', '33vw'])
        let parsedData, storedData = JSON.parse(sessionStorage.getItem(`search${country.code}${category}${query}`))
        const { totalResults, maxResults } = storedData || { totalResults: 0, maxResults: 1 }
        if (totalResults === maxResults) setEnd(true)
        else if (!storedData || type !== 'reload') {
            let updatedPage;
            storedData ? updatedPage = Math.ceil(totalResults / 24) + 1 : updatedPage = page
            try {
                const { data } = await axios({
                    url: process.env.REACT_APP_URL + 'search',
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    data: { country: country.code, category: category || 'general', query, page: updatedPage }
                })
                if (data.success) {
                    parsedData = data.news
                    setPage(page => page + 1)
                }
            } catch (error) { setError(error.response.data?.error || 'Unable to fetch news! Try again later...') }
        }
        updateData(parsedData, storedData)
        setLoad(['visible', '100vw'])
        setTimeout(() => setLoad(['hidden', '0vw']), 300);
    }

    useEffect(() => { if (query?.length >= 3) searchBackend() }, [query, country.code, category])

    return <div style={{ marginTop: "70px" }}>
        <div className='container-fluid d-sm-flex justify-content-center pt-1'>
            <input className="form-control ps-1 w-auto mx-auto mb-2 m-sm-0 me-sm-3" type="search" placeholder="Search" aria-label="Search" value={search} onChange={updateQuery} />
            <select className="form-select w-auto mx-auto m-sm-0 text-capitalize" aria-label="Choose category" value={category} onChange={updateCategory}>
                <option value={'all'}>All</option>
                {categories.map(element => {
                    if (element === 'search' || element === 'saved') return null
                    return <option value={element} key={element}>{element || 'General'}</option>
                })}
            </select>
        </div>

        <InfiniteScroll className="panel row mx-3 py-2 gx-4" next={() => searchBackend('new')} hasMore={!end} loader={load[0] === 'visible' && <Loader />} endMessage={searchNews.length && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={searchNews.length}>
            {searchNews.length ? searchNews.map(element => <div className="col-sm-6 col-lg-4 d-flex" key={element.url}>
                <NewsItem title={element.title} description={element.description} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
            </div>) : query && query.length < 3 && load[0] === 'hidden' && country.code ? <div className="text-center">
                Please search for at least 3 characters!
            </div> : load[0] === 'hidden' && country.code && <div className="text-center">{error}</div>}
        </InfiniteScroll>
    </div>
}
