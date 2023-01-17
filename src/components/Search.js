/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { categories } from '../constants'
import { useNewsContext } from '../context/ContextProvider'
import { useDebounce, useStorage } from '../hooks'
import { getStorage, setStorage } from '../modules/storage'
import Loader from './Loader'
import NewsItem from './NewsItem'

export default function Search() {
    const { country, progress, setProgress, error, setError, news, setNews, page, setPage, resetNews, fetchedIfAuto } = useNewsContext()
    const [category, setCategory] = useStorage('category', 'all', { local: false, session: true })
    const [search, setSearch] = useStorage('query', '', { local: false, session: true })
    const [date, setDate] = useStorage('date', '', { local: false, session: true })
    const [end, setEnd] = useState(false)
    const query = useDebounce(search)
    const now = new Date();
    const maxDate = now.toLocaleDateString('en-ca');
    now.setDate(now.getDate() - 6);
    const minDate = now.toLocaleDateString('en-ca');

    function updateQuery({ target }) {
        setSearch(target.value)
        resetNews()
    }

    function updateCategory({ target }) {
        setCategory(target.value)
        resetNews()
    }

    function updateDate({ target }) {
        setDate(target.value)
        resetNews()
    }

    function updateData(parsedData, storedData) {
        const { articles, maxResults } = parsedData || {}
        const storedNews = storedData?.articles || []
        if (articles?.length) {
            const newsToSet = storedNews.concat(articles)
            setNews(newsToSet)
            const newsToStore = { status: "ok", totalResults: newsToSet.length, maxResults, articles: newsToSet }
            setStorage(`search${country.code}${category}${query}${date}`, newsToStore, false)
        } else setNews(storedNews)
    }

    async function searchBackend(type = 'reload') {
        setProgress(33)
        let storedData = getStorage(`search${country.code}${category}${query}${date}`, {}, false)
        const { totalResults = 0, maxResults = 1 } = storedData
        if (totalResults === maxResults) setEnd(true)
        else if (!storedData || type !== 'reload') {
            const updatedPage = storedData ? Math.ceil(totalResults / 24) + 1 : page
            try {
                const { data } = await axios({
                    url: process.env.REACT_APP_URL + 'search',
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    data: { country: country.code, category: category || 'general', query, page: updatedPage, date }
                })
                if (data.success) {
                    var parsedData = data.news
                    setPage(page => page + 1)
                }
            } catch (e) { setError(e.response.data?.error || 'Unable to fetch news! Try again later...') }
        }
        updateData(parsedData, storedData)
        setProgress(100)
    }

    useEffect(() => {
        if (!country.code) return
        if (country.method === 'auto' && !fetchedIfAuto) return
        setEnd(false)
        if (query?.length >= 3) searchBackend()
    }, [query, country.code, category, date, fetchedIfAuto])

    return <div style={{ marginTop: "70px" }}>
        <div className='container-fluid d-sm-flex justify-content-center pt-1'>
            <input className="form-control w-auto mx-auto mb-2 m-sm-0 me-sm-3" type="search" placeholder="Search" aria-label="Search" value={search} onChange={updateQuery} />
            <div className='d-flex align-items-center justify-content-center w-auto mx-auto mb-2 m-sm-0 me-sm-3'>
                <label htmlFor='date' className='me-1 d-sm-none'>Date: </label>
                <input id='date' className="form-control w-auto" type="date" value={date} onChange={updateDate} min={minDate} max={maxDate} />
            </div>
            <select className="form-select w-auto mx-auto m-sm-0 text-capitalize" aria-label="Choose category" value={category} onChange={updateCategory}>
                <option value='all'>All</option>
                {categories.map(element => {
                    if (element === 'search' || element === 'saved') return null
                    return <option value={element} key={element}>{element || 'General'}</option>
                })}
            </select>
        </div>

        <InfiniteScroll className="panel row mt-3 mx-3 py-2 gx-4" next={() => searchBackend('new')} hasMore={!end} loader={progress > 0 && <Loader />} endMessage={Boolean(news.length) && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={news.length}>
            {news.length ? news.map(item => <div className="col-sm-6 col-lg-4 d-flex" key={item.url}>
                <NewsItem {...item} dateFormat='UTC' />
            </div>) : !query && !progress && country.code ? <div className="text-center">
                Enter query to search for news...
            </div> : query && query.length < 3 && !progress && country.code ? <div className="text-center">
                Please search for at least 3 characters!
            </div> : !progress && country.code && <div className="text-center">{error}</div>}
        </InfiniteScroll>
    </div>
}
