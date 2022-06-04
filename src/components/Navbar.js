import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { useNewsContext } from '../context/State';

export default function Navbar() {
    const { countries, categories, country, setCountry, query, setQuery, setPage, setNews } = useNewsContext()
    const [width, setWidth] = useState(window.outerWidth)
    const location = useLocation();
    const autoCountry = country.method === 'auto' && countries[country.code] ? ` (${countries[country.code]})` : ''
    countries.auto = 'Auto' + autoCountry

    useEffect(() => { window.addEventListener('resize', () => setWidth(window.outerWidth)); }, [])

    function resetNews(newCategory) {
        if (location.pathname === '/' + newCategory) return
        setPage(1)
        setNews([])
    }

    function updateCountry(event) {
        let method = '', code = '';
        const value = event.target.value
        value === 'auto' ? method = value : code = value
        setCountry({ method, code })
        if (code !== autoCountry) {
            setPage(1)
            setNews([])
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">NewsDose</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav pe-3 me-auto mb-2 mb-lg-0">
                        {categories.map(category => <li className="nav-item" key={category} onClick={() => resetNews(category)}>
                            <Link className="nav-link d-inline-block w-auto" aria-current="page" to={`/${category}`}>
                                <button className='btn shadow-none nav-link p-0 text-capitalize' data-bs-toggle='collapse' data-bs-target={width > 991 ? '' : "#navbarSupportedContent"}>{category || "Home"}</button>
                            </Link>
                        </li>)}
                    </ul>
                    <div className='d-flex'>
                        <select className="form-select w-auto me-2" aria-label="Choose country" defaultValue={country.method || country.code} onChange={updateCountry}>
                            {Object.keys(countries).map(code => <option value={code} key={code}>{countries[code]}</option>)}
                        </select>
                        <input className="form-control ps-1" type="search" placeholder="Search" aria-label="Search" value={query} onChange={event => setQuery(event.target.value)} />
                    </div>
                </div>
            </div>
        </nav >
    )
}
