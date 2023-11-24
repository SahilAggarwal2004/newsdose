import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link'
import ReactSelect from 'react-select';
import LoadingBar from "react-top-loading-bar"
import { countries, categories, pseudoCategories } from '../constants';
import { useNewsContext } from '../contexts/ContextProvider';
import { getStorage, setStorage } from '../modules/storage';

export default function Navbar() {
    const { country: { method, code }, setCountry, pending, setPending, progress, setProgress, queryFn } = useNewsContext()
    const client = useQueryClient()
    const [width, setWidth] = useState(window.outerWidth)
    const country = countries[code]
    countries.auto = 'Auto' + (method === 'auto' && country ? ` (${country})` : '')
    const options = useMemo(() => Object.entries(countries).reduce((arr, [value, label]) => arr.concat({ value, label }), []), [])

    useEffect(() => { window.addEventListener('resize', () => setWidth(window.outerWidth)); }, [])

    function updateCountry({ value }) {
        if (value === 'auto') setPending(true)
        else setCountry({ method: '', code: value })
    }

    async function prefetch(event) {
        const category = event.target.pathname?.slice(1) || ''
        const queryKey = ['news', code, category]
        if (getStorage(queryKey, undefined, false)) return;
        await client.prefetchInfiniteQuery({
            queryKey, retry: 0, enabled: !pending,
            queryFn: async () => await queryFn(queryKey, 1, 'prefetch'),
        })
        setStorage(queryKey, client.getQueryData(queryKey))
        setStorage(queryKey, true, false)
    }

    return <>
        <LoadingBar color='#ff0000' shadow={false} progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)} />
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand">NewsDose</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav d-grid d-lg-flex me-auto mt-2 mb-2 mt-lg-0 mb-lg-0">
                        {categories.map(category => <li className='nav-item text-center' key={category}>
                            <Link href={`/?category=${category}`} className="nav-link d-inline-block px-1" aria-current="page" onMouseEnter={prefetch}>
                                <button className='btn shadow-none nav-link p-0 text-capitalize' data-bs-toggle='collapse' data-bs-target={width <= 991 && "#navbarSupportedContent"}>{category || "Home"}</button>
                            </Link>
                        </li>)}
                        {pseudoCategories.map(category => <li className='nav-item text-center' key={category}>
                            <Link href={`/${category}`} className="nav-link d-inline-block px-1" aria-current="page">
                                <button className='btn shadow-none nav-link p-0 text-capitalize' data-bs-toggle='collapse' data-bs-target={width <= 991 && "#navbarSupportedContent"}>{category || "Home"}</button>
                            </Link>
                        </li>)}
                    </ul>
                    <div className='d-flex justify-content-center align-items-center'>
                        <ReactSelect id='countries' options={options} defaultValue={options[Object.keys(countries).indexOf(method || code)]} onChange={updateCountry} className="ms-4 me-3" isSearchable={false} />
                        <Link href='/search' className='text-black mb-1'>
                            <FaSearch title='Search' data-bs-toggle='collapse' data-bs-target={width <= 991 && "#navbarSupportedContent"} />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    </>
}
