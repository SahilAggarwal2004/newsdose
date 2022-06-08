/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNewsContext } from '../context/State'
import { useDebounce } from '../hooks'
import NewsItem from './NewsItem'

export default function Search() {
    const { categories, country, setLoad, error, setError } = useNewsContext()
    const [category, setCategory] = useState('')
    const [search, setSearch] = useState('')
    const [searchNews, setSearchNews] = useState([])
    const query = useDebounce(search)

    async function searchBackend() {
        setLoad(['visible', '33vw'])
        try {
            const { data } = await axios({
                url: process.env.REACT_APP_URL + 'search',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                data: { country: country.code, category: category || 'general', query }
            })
            if (data.success) setSearchNews(data.news.articles)
        } catch (error) { setError(error.response.data.error) }
        setLoad(['visible', '100vw'])
        setTimeout(() => setLoad(['hidden', '0vw']), 300);
    }
    useEffect(() => { if (query?.length >= 3) searchBackend() }, [query, country.code, category])

    return <div style={{ marginTop: "70px" }}>
        <div>
            <input className="form-control ps-1" type="search" placeholder="Search" aria-label="Search" value={search} onChange={event => setSearch(event.target.value)} />
            <select className="form-select w-auto me-2 text-capitalize" aria-label="Choose category" value={category} onChange={event => setCategory(event.target.value)}>
                <option value={'all'}>All</option>
                {categories.map(element => {
                    if (element === 'search' || element === 'saved') return null
                    return <option value={element} key={element}>{element || 'General'}</option>
                })}
            </select>
        </div>
        <div className="panel row mx-3 py-2 gx-4">
            {searchNews.length ? searchNews.map(element => <div className="col-md-4 d-flex" key={element.url}>
                <NewsItem title={element.title} description={element.description} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
            </div>) : query.length >= 3 ? <div className="text-center">
                Seems like there is no news related to <strong>{query}</strong>
            </div> : <div className="text-center">{error}</div>}
        </div>
    </div>
}
