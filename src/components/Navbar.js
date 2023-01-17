/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar"
import { countries, categories } from '../constants';
import { useNewsContext } from '../context/ContextProvider';

export default function Navbar() {
    const { country, setCountry, resetNews, progress, setProgress } = useNewsContext()
    const [width, setWidth] = useState(window.outerWidth)
    const location = useLocation();
    const navigate = useNavigate();
    const autoCountry = country.method === 'auto' && countries[country.code] ? ` (${countries[country.code]})` : ''
    countries.auto = 'Auto' + autoCountry

    useEffect(() => { window.addEventListener('resize', () => setWidth(window.outerWidth)); }, [])

    function updateCountry(event) {
        let method = '', code = '';
        const value = event.target.value
        value === 'auto' ? method = value : code = value
        if (code !== country.code) resetNews()
        setCountry({ method, code })
    }

    function redirect(event) {
        event.preventDefault();
        const path = event.target.getAttribute("to");
        if (!progress && location.pathname !== path) {
            resetNews()
            navigate(path)
        }
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
                                <button className='btn shadow-none nav-link p-0 text-capitalize' data-bs-toggle='collapse' data-bs-target={width <= 991 && "#navbarSupportedContent"} to={`/${category}`} onClick={redirect}>{category || "Home"}</button>
                            </a>
                        </li>)}
                    </ul>
                    <select className="form-select w-auto" aria-label="Choose country" defaultValue={country.method || country.code} onChange={updateCountry}>
                        {Object.keys(countries).map(code => <option value={code} key={code}>{countries[code]}</option>)}
                    </select>
                </div>
            </div>
        </nav >
    </>
}
