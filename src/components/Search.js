/* eslint-disable react-hooks/exhaustive-deps */
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { categories, pseudoCategories } from '../constants'
import { useNewsContext } from '../context/ContextProvider'
import { useDebounce, useStorage } from '../hooks'
import { getStorage } from '../modules/storage'
import Loader from './Loader'
import NewsItem from './NewsItem'

export default function Search() {
    const { country: { method, code }, error, queryFn, onSuccess, onError } = useNewsContext()
    const [category, setCategory] = useStorage('category', 'all', { local: false, session: true })
    const [search, setSearch] = useStorage('query', '', { local: false, session: true })
    const [date, setDate] = useStorage('date', '', { local: false, session: true })
    const query = useDebounce(search)
    const now = new Date();
    const maxDate = now.toLocaleDateString('en-ca');
    now.setDate(now.getDate() - 13); // 14 days
    const minDate = now.toLocaleDateString('en-ca');
    const queryKey = ['search', code, category, query, date]
    const id = queryKey.join('-')

    const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey, enabled: method !== 'pending' && query.length >= 3, placeholderData: getStorage(id),
        getNextPageParam: ({ nextPage }) => nextPage,
        queryFn: async ({ pageParam = 1 }) => queryFn(queryKey, id, pageParam, 'search'),
        onSuccess: data => onSuccess(id, data),
        onError: e => onError(queryKey, id, e)
    })
    const news = data?.pages?.flatMap(({ news }) => news) || []

    return <div style={{ marginTop: "70px" }}>
        <div className='container-fluid d-sm-flex justify-content-center pt-1'>
            <input className="form-control w-auto mx-auto mb-2 m-sm-0 me-sm-3" type="search" placeholder="Search" aria-label="Search" value={search} onChange={e => setSearch(e.target.value)} />
            <div className='d-flex align-items-center justify-content-center w-auto mx-auto mb-2 m-sm-0 me-sm-3'>
                <label htmlFor='date' className='me-1 d-sm-none'>Date: </label>
                <input id='date' className="form-control w-auto" type="date" value={date} min={minDate} max={maxDate} onChange={e => setDate(e.target.value)} />
            </div>
            <select className="form-select w-auto mx-auto m-sm-0 text-capitalize" aria-label="Choose category" value={category} onChange={e => setCategory(e.target.value)}>
                <option value='all'>All</option>
                {categories.map(item => {
                    if (pseudoCategories.includes(item)) return null
                    return <option value={item} key={item}>{item || 'General'}</option>
                })}
            </select>
        </div>

        <InfiniteScroll className="panel row mt-3 mx-3 py-2 gx-4" next={fetchNextPage} hasMore={hasNextPage} loader={isFetching && <Loader />} endMessage={news.length > 0 && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={news.length}>
            {news.length ? news.map(item => <div className="col-sm-6 col-lg-4 d-flex" key={item.url}>
                <NewsItem {...item} dateFormat='UTC' />
            </div>) : category === 'saved' ? <div className="text-center">
                You haven't saved any news till now!
            </div> : !query ? <div className="text-center">
                Enter query to search for news...
            </div> : query.length < 3 ? <div className="text-center">
                Please search for at least 3 characters!
            </div> : error ? <div className="text-center">{error}</div> : <Loader />}
        </InfiniteScroll>
    </div>
}
