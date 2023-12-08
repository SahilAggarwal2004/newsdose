/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react'
import Head from 'next/head';
import NewsItem from '../components/NewsItem'
import { getStorage } from '../modules/storage';
import { fallbackCount } from '../constants';
import { includes } from '../modules/functions';
import useURLState from '../hooks/useURLState';

export default function News() {
    const [query, setQuery] = useURLState('query', '')
    const fullNews = getStorage('news', [])
    const news = useMemo(() => query ? fullNews.filter(item => includes(item, query) && item) : fullNews, [query])

    return <>
        <Head><title>Saved | NewsDose</title></Head>
        <div style={{ marginTop: "70px" }}>
            <div className='grid container-fluid'>
                <h1 className="text-center fs-3 text-capitalize mb-0">Top Headlines - Saved</h1>
                <input className="form-control w-auto" type="search" placeholder="Search" aria-label="Search" value={query} onChange={e => setQuery(e.target.value.substring(0, 100))} />
            </div>
            <hr />
            <div className='panel row mx-3 py-2 gx-4'>
                {news.length ? news.map((item, i) => <div className="col-sm-6 col-lg-4 d-flex" key={item.url}>
                    <NewsItem index={i % fallbackCount} {...item} />
                </div>) : <div className="text-center">
                    You haven&#39;t saved any news{query && <> related to <strong>{query}</strong></>} till now!
                </div>}
            </div>
        </div>
    </>
}