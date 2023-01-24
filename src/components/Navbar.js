/* eslint-disable jsx-a11y/anchor-is-valid */
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import LoadingBar from "react-top-loading-bar"
import { countries, categories, pseudoCategories } from '../constants';
import { useNewsContext } from '../context/ContextProvider';

export default function Navbar() {
    const { country: { method, code }, setCountry, progress, setProgress, queryFn } = useNewsContext()
    const client = useQueryClient()
    const [width, setWidth] = useState(window.outerWidth)
    const country = countries[code]

    useEffect(() => { window.addEventListener('resize', () => setWidth(window.outerWidth)); }, [])

    function updateCountry(event) {
        let method = '', code = '';
        const value = event.target.value
        value === 'pending' ? method = 'pending' : code = value
        setCountry({ method, code })
    }

    function prefetch(event) {
        const category = event.target.pathname.slice(1)
        const queryKey = ['news', code, category]
        if (!pseudoCategories.includes(category)) client.prefetchInfiniteQuery({
            queryKey, retry: 0, enabled: method !== 'pending',
            queryFn: async () => await queryFn(queryKey, 1, 'prefetch')
        })
    }

    return <>
        <LoadingBar color='#ff0000' progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)} />
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">NewsDose</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav d-grid d-lg-flex me-auto mt-2 mb-2 mt-lg-0 mb-lg-0">
                        {categories.map(category => <li className={`nav-item text-center ${category}`} key={category}>
                            <Link to={`/${category}`} className="nav-link d-inline-block w-auto" aria-current="page" onMouseEnter={prefetch}>
                                <button className='btn shadow-none nav-link p-0 text-capitalize' data-bs-toggle='collapse' data-bs-target={width <= 991 && "#navbarSupportedContent"}>{category || "Home"}</button>
                            </Link>
                        </li>)}
                    </ul>
                    <select className="form-select w-auto" aria-label="Choose country" defaultValue={method || code} onChange={updateCountry}>
                        {Object.keys(countries).map(code => <option value={code} key={code}>{countries[code]}</option>)}
                        {method === 'auto' ? <option value='auto'>Auto{country && ` (${country})`}</option> :
                            <option value='pending'>Auto</option>}
                    </select>
                </div>
            </div>
        </nav>
    </>
}
