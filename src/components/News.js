/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useNewsContext } from '../context/ContextProvider';
import { useStorage } from '../hooks';
import Loader from './Loader';
import NewsItem from './NewsItem'
import { getStorage } from '../modules/storage';
import { fallbackCount } from '../constants';

function includes({ title, description, source }, substring) {
    substring = substring.toLowerCase()
    return [title, description, source].some(item => item?.toLowerCase().includes(substring))
}

export default function News() {
    const { country: { code: country }, pending, error, queryFn, onSuccess, onError } = useNewsContext()
    const [query, setQuery] = useStorage('query', '', false)
    const category = window.location.pathname?.slice(1) || ''
    const saved = category === 'saved'
    const queryKey = ['news', country, category]

    const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey, enabled: !pending && !saved, placeholderData: getStorage(queryKey),
        getNextPageParam: ({ nextPage }) => nextPage,
        queryFn: async ({ pageParam = 1 }) => await queryFn(queryKey, pageParam),
        onSuccess: data => onSuccess(queryKey, data),
        onError: e => onError(queryKey, e)
    })
    const fullNews = data?.pages?.flatMap(({ news }) => news || []) || (saved && getStorage('news')) || []
    const news = query ? fullNews.filter(item => includes(item, query) && item) : fullNews

    useEffect(() => { document.title = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} | NewsDose` : 'NewsDose - Get your daily dose of news for free!' }, [])
    useEffect(() => { window.scrollTo(0, 0) }, [country])

    return <div style={{ marginTop: "70px" }}>
        <div className='grid container-fluid'>
            <h1 className="text-center fs-3 text-capitalize mb-0">Top Headlines{category && ` - ${category}`}</h1>
            <input className="form-control w-auto" type="search" placeholder="Search" aria-label="Search" value={query} onChange={event => setQuery(event.target.value)} />
        </div>
        <hr />
        <InfiniteScroll className="panel row mx-3 py-2 gx-4" next={fetchNextPage} hasMore={hasNextPage} loader={isFetching && <Loader />} endMessage={news.length > 0 && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={fullNews.length}>
            {news.length ? news.map((item, i) => <div className="col-sm-6 col-lg-4 d-flex" key={item.url}>
                <NewsItem index={i % fallbackCount} {...item} />
            </div>) : category === 'saved' ? <div className="text-center">
                You haven't saved any news till now!
            </div> : query ? <div className="text-center">
                <div className='mb-2'>Seems like there is no news related to <strong>{query}</strong>...</div>
                <Link to='/search' className='text-decoration-none'>Try advanced search</Link>
            </div> : error ? <div className="text-center">{error}</div> : <Loader />}
        </InfiniteScroll>
    </div>
}