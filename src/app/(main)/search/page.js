"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNewsContext } from '@/contexts/ContextProvider'
import { getStorage, setStorage } from '@/modules/storage'
import Loader from '@/components/Loader'
import NewsItem from '@/components/NewsItem'
import { fallbackCount } from '@/constants'
import useDebounce from '@/hooks/useDebounce'
import useURLState from '@/hooks/useURLState'

export default function Search() {
    const { country: { code: country }, pending, queryFn, onError } = useNewsContext()
    const [search, setSearch] = useURLState('query', '')
    const [date, setDate] = useURLState('date', '')
    const query = useDebounce(search)
    const now = new Date();
    const maxDate = now.toLocaleDateString('en-ca');
    now.setMonth(now.getMonth() - 1); // Upto 1 month
    const minDate = now.toLocaleDateString('en-ca');
    const queryKey = useMemo(() => ['search', country, query, date], [country, query, date])
    const placeholderData = useMemo(() => getStorage(queryKey, undefined, false), [queryKey])

    const { data, error, isFetching, isFetched, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey, enabled: !pending && query.length >= 3, placeholderData, retry: placeholderData ? 0 : 1,
        getNextPageParam: ({ nextPage }) => nextPage || undefined,
        queryFn: async ({ queryKey, pageParam }) => queryFn({ queryKey, pageParam, type: 'search' })
    })
    const news = useMemo(() => {
        if (data) setStorage(queryKey, data, false)
        return data?.pages?.flatMap(({ news }) => news) || []
    }, [data])

    useEffect(() => { window.scrollTo(0, 0) }, [country])

    useLayoutEffect(() => { if (isFetched && !data) onError(queryKey) }, [isFetched])

    return <div style={{ marginTop: "70px" }}>
        <div className='container-fluid d-sm-flex justify-content-center pt-1'>
            <input className="form-control w-auto mx-auto mb-2 m-sm-0 me-sm-3" type="search" placeholder="Search" aria-label="Search" value={search} onChange={e => setSearch(e.target.value.substring(0, 100))} />
            <div className='d-flex align-items-center justify-content-center w-auto mx-auto mb-2 m-sm-0 me-sm-3'>
                <label htmlFor='date' className='me-1 d-sm-none'>Date: </label>
                <input id='date' className="form-control w-auto" type="date" value={date} min={minDate} max={maxDate} onChange={e => setDate(e.target.value)} />
            </div>
        </div>

        <InfiniteScroll className="panel row mt-3 mx-3 py-2 gx-4" next={fetchNextPage} hasMore={hasNextPage} loader={isFetching && <Loader />} endMessage={news.length > 0 && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={news.length}>
            {news.length ? news.map((item, i) => <div className="col-sm-6 col-lg-4 d-flex" key={item.url}>
                <NewsItem index={i % fallbackCount} dateFormat='UTC' {...item} />
            </div>) : !query ? <div className="text-center">
                Enter query to search for news...
            </div> : query.length < 3 ? <div className="text-center">
                Please search for at least 3 characters!
            </div> : isFetching ? <Loader /> : <div className="text-center">{error?.response?.data?.error || 'Unable to search news! Try again later...'}</div>}
        </InfiniteScroll>
    </div>
}