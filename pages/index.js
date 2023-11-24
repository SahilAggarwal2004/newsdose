/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import { useNewsContext } from '../contexts/ContextProvider';
import useStorage from '../hooks/useStorage';
import Loader from '../components/Loader';
import NewsItem from '../components/NewsItem'
import { getStorage, setStorage } from '../modules/storage';
import { categories, fallbackCount } from '../constants';
import { includes } from '../modules/functions';
import Head from 'next/head';

export default function News({ router }) {
    const { country: { code: country }, pending, queryFn, onError } = useNewsContext()
    const [query, setQuery] = useStorage('query', '', false)
    const category = useMemo(() => categories.includes(router.query.category) ? router.query.category : '', [router.query])
    const queryKey = useMemo(() => ['news', country, category], [country, category])
    const placeholderData = useMemo(() => getStorage(queryKey), [queryKey]) // Avoiding multiple localStorage calls on re-renders as well as we need only old cached data for retry param

    const { data, error, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey, enabled: !pending, placeholderData, retry: placeholderData ? 0 : 1,
        getNextPageParam: ({ nextPage }) => nextPage || undefined,
        queryFn: async ({ pageParam = 1 }) => queryFn(queryKey, pageParam)
    })
    const fullNews = useMemo(() => {
        if (data) setStorage(queryKey, data)
        return data?.pages?.flatMap(({ news }) => news || []) || []
    }, [data])
    const news = useMemo(() => query ? fullNews.filter(item => includes(item, query) && item) : fullNews, [fullNews, query])

    useEffect(() => { window.scrollTo(0, 0) }, [country])

    useLayoutEffect(() => { if (error) onError(queryKey) }, [error])

    return <>
        <Head><title>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} | NewsDose` : 'NewsDose - Daily dose of news for free!'}</title></Head>
        <div style={{ marginTop: "70px" }}>
            <div className='grid container-fluid'>
                <h1 className="text-center fs-3 text-capitalize mb-0">Top Headlines{category && ` - ${category}`}</h1>
                <input className="form-control w-auto" type="search" placeholder="Search" aria-label="Search" value={query} onChange={event => setQuery(event.target.value.substring(0, 100))} />
            </div>
            <hr />
            <InfiniteScroll className="panel row mx-3 py-2 gx-4" next={fetchNextPage} hasMore={hasNextPage} loader={isFetching && <Loader />} endMessage={news.length > 0 && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={fullNews.length}>
                {news.length ? news.map((item, i) => <div className="col-sm-6 col-lg-4 d-flex" key={item.url}>
                    <NewsItem index={i % fallbackCount} {...item} />
                </div>) : query ? <div className="text-center">
                    <div className='mb-2'>Seems like there is no news related to <strong>{query}</strong>...</div>
                    <Link href='/search' className='text-decoration-none'>Try advanced search</Link>
                </div> : error ? <div className="text-center">{error.response?.data?.error || 'Unable to fetch news! Try again later...'}</div> : <Loader />}
            </InfiniteScroll>
        </div>
    </>
}