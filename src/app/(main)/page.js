"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNewsContext } from '@/contexts/ContextProvider';
import Loader from '@/components/Loader';
import NewsItem from '@/components/NewsItem'
import { categories, fallbackCount } from '@/constants';
import useURLState from '@/hooks/useURLState';
import SearchLink from '@/components/SearchLink';
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery';

export default function News() {
    const { country: { code: country } } = useNewsContext()
    const [query, setQuery] = useURLState('query', '')
    const searchCategory = useSearchParams().get('category')
    const category = useMemo(() => categories.includes(searchCategory) ? searchCategory : '', [searchCategory])
    const queryKey = useMemo(() => ['news', country, category], [country, category])
    const { news, length, error, isFetching, hasNextPage, fetchNextPage } = useCustomInfiniteQuery({ queryKey, query })

    return <>
        <Head><title>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} | NewsDose` : 'NewsDose - Daily dose of news for free!'}</title></Head>
        <div style={{ marginTop: "70px" }}>
            <div className='grid container-fluid'>
                <h1 className="text-center fs-3 text-capitalize mb-0">Top Headlines{category && ` - ${category}`}</h1>
                <input className="form-control w-auto" type="search" placeholder="Search" aria-label="Search" value={query} onChange={event => setQuery(event.target.value.substring(0, 100))} />
            </div>
            <hr />
            <InfiniteScroll className="panel row mx-3 py-2 gx-4" next={fetchNextPage} hasMore={hasNextPage} loader={isFetching && <Loader />} endMessage={news.length > 0 && <p className='text-center fw-bold'>Yay! You have seen it all</p>} dataLength={length}>
                {news.length ? news.map((item, i) => <div className="col-sm-6 col-lg-4 d-flex" key={item.url}>
                    <NewsItem index={i % fallbackCount} {...item} />
                </div>) : query ? <div className="text-center">
                    <div className='mb-2'>Seems like there is no news related to <strong>{query}</strong>...</div>
                    <SearchLink href='/search' className='text-decoration-none'>Try advanced search</SearchLink>
                </div> : error ? <div className="text-center">{error.response?.data?.error || 'Unable to fetch news! Try again later...'}</div> : <Loader />}
            </InfiniteScroll>
        </div>
    </>
}