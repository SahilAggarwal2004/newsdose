/* eslint-disable jsx-a11y/anchor-is-valid */
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar"
import { countries, categories, pseudoCategories } from '../constants';
import { useNewsContext } from '../context/ContextProvider';

export default function Navbar() {
    const { country: { method, code }, setCountry, progress, setProgress, queryFn } = useNewsContext()
    const client = useQueryClient()
    const [width, setWidth] = useState(window.outerWidth)
    const navigate = useNavigate();
    const autoCountry = method === 'auto' && countries[code] ? ` (${countries[code]})` : ''
    countries.auto = 'Auto' + autoCountry

    useEffect(() => { window.addEventListener('resize', () => setWidth(window.outerWidth)); }, [])

    function updateCountry(event) {
        let method = '', code = '';
        const value = event.target.value
        value === 'auto' ? method = 'pending' : code = value
        setCountry({ method, code })
    }

    function prefetch(event) {
        const category = event.target.getAttribute("to").slice(1)
        if (!pseudoCategories.includes(category)) client.prefetchInfiniteQuery({
            queryKey: ['news', code, category], retry: 0, enabled: method !== 'pending',
            queryFn: async ({ queryKey }) => await queryFn(queryKey, 1, 'prefetch'),
        })
    }

    function redirect(event) {
        event.preventDefault();
        const path = event.target.getAttribute("to");
        if (progress !== 33 && window.location.pathname !== path) navigate(path)
    }

    return <>
        <LoadingBar color='#ff0000' progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)} />
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" to="/" onClick={redirect}>NewsDose</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav d-grid d-lg-flex me-auto mt-2 mb-2 mt-lg-0 mb-lg-0">
                        {categories.map(category => <li className={`nav-item text-center ${category}`} key={category}>
                            <a className="nav-link d-inline-block w-auto" aria-current="page">
                                <button className='btn shadow-none nav-link p-0 text-capitalize' data-bs-toggle='collapse' data-bs-target={width <= 991 && "#navbarSupportedContent"} to={`/${category}`} onMouseEnter={prefetch} onClick={redirect}>{category || "Home"}</button>
                            </a>
                        </li>)}
                    </ul>
                    <select className="form-select w-auto" aria-label="Choose country" defaultValue={method || code} onChange={updateCountry}>
                        {Object.keys(countries).map(code => <option value={code} key={code}>{countries[code]}</option>)}
                    </select>
                </div>
            </div>
        </nav>
    </>
}
