/* eslint-disable react-hooks/exhaustive-deps */
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNewsContext } from '../context/ContextProvider'
import { useDebounce, useStorage } from '../hooks'
import { getStorage } from '../modules/storage'
import Loader from './Loader'
import NewsItem from './NewsItem'
import { fallbackCount } from '../constants'

export default function Search() {
    const { country: { code: country }, pending, error, queryFn, onSuccess, onError } = useNewsContext()
    const [search, setSearch] = useStorage('query', '', false)
    const [date, setDate] = useStorage('date', '', false)
    const query = useDebounce(search)
    const now = new Date();
    const maxDate = now.toLocaleDateString('en-ca');
    now.setMonth(now.getMonth() - 1); // Upto 1 month
    const minDate = now.toLocaleDateString('en-ca');
    const queryKey = ['search', country, query, date]

    const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey, enabled: !pending && query.length >= 3, placeholderData: getStorage(queryKey),
        getNextPageParam: ({ nextPage }) => nextPage,
        queryFn: async ({ pageParam = 1 }) => queryFn(queryKey, pageParam, 'search'),
        onSuccess: data => onSuccess(queryKey, data),
        onError: e => onError(queryKey, e)
    })
    const news = data?.pages?.flatMap(({ news }) => news) || []

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
            </div> : error ? <div className="text-center">{error}</div> : <Loader />}
        </InfiniteScroll>
    </div>
}
