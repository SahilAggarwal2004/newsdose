import React, { Component } from 'react'
import { Link } from "react-router-dom";

export class Navbar extends Component {

    countries = ["au_Australia", "ca_Canada", "in_India", "ie_Ireland", "my_Malaysia", "ng_Nigeria", "nz_New Zealand", "ph_Philippines", "sa_Saudi Arabia", "sg_Singapore", "za_South Africa", "gb_United Kingdom", "us_United States"]

    categories = ["", "Business", "Entertainment", "Health", "Science", "Sports", "Technology"]

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div className="container-fluid">
                    {/* A way to use props in class based component described below, another by(by defining described in NewsItem.js) */}
                    <Link className="navbar-brand" to="/">NewsDose</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {this.categories.map((element) => {
                                return (
                                    <li className="nav-item" key={element}>
                                        <Link className="nav-link" aria-current="page" to={`/${element.toLowerCase()}`}>{element ? element : "Home"}</Link>
                                    </li>)
                            })}
                        </ul>
                        <div className='d-flex'>
                            <select className="form-select w-auto" aria-label="Default select example" defaultValue={localStorage.getItem('country') || "in"} onChange={() => {
                                this.props.setCoun(document.querySelector("select").value);
                                localStorage.setItem('country', document.querySelector("select").value)
                            }} style={{ marginRight: "0.5rem" }}>
                                {this.countries.map(element => {
                                    return (
                                        <option value={element.split('_')[0]} key={element.split('_')[0]}>{element.split('_')[1]}</option>
                                    )
                                })}
                            </select>
                            <input className="form-control me-2 ps-1" type="search" placeholder="Search" aria-label="Search" onChange={event => {
                                this.props.search(event.target.value)
                            }} />
                        </div>
                    </div>
                </div>
            </nav >
        )
    }
}

export default Navbar
