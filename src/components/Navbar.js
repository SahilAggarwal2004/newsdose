import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { useNewsContext } from '../context/ContextProvider';

export default function Navbar() {
    const { countries, categories, country, setCountry, resetNews } = useNewsContext()
    const [width, setWidth] = useState(window.outerWidth)
    const location = useLocation();
    const autoCountry = country.method === 'auto' && countries[country.code] ? ` (${countries[country.code]})` : ''
    countries.auto = 'Auto' + autoCountry

    useEffect(() => { window.addEventListener('resize', () => setWidth(window.outerWidth)); }, [])

    function updateCategory(newCategory) { if (location.pathname !== '/' + newCategory) resetNews() }

    function updateCountry(event) {
        let method = '', code = '';
        const value = event.target.value
        value === 'auto' ? method = value : code = value
        if (code !== country.code) resetNews()
        setCountry({ method, code })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">NewsDose</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav d-grid d-lg-flex me-auto mt-2 mb-2 mt-lg-0 mb-lg-0">
                        {categories.map(category => <li className={`nav-item text-center ${category}`} key={category} onClick={() => updateCategory(category)}>
                            <Link className="nav-link d-inline-block w-auto" aria-current="page" to={`/${category}`}>
                                <button className='btn shadow-none nav-link p-0 text-capitalize' data-bs-toggle='collapse' data-bs-target={width <= 991 && "#navbarSupportedContent"}>{category || "Home"}</button>
                            </Link>
                        </li>)}
                    </ul>
                    <select className="form-select w-auto" aria-label="Choose country" defaultValue={country.method || country.code} onChange={updateCountry}>
                        {Object.keys(countries).map(code => <option value={code} key={code}>{countries[code]}</option>)}
                    </select>
                </div>
            </div>
        </nav >
    )
}
