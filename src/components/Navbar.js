import React, { Component } from 'react'
import { Link } from "react-router-dom";

export class Navbar extends Component {

    countries = ["ar_Argentina", "at_Austria", "au_Australia", "be_Belgium", "bg_Bulgaria", "br_Brazil", "ca_Canada", "cn_China", "co_Colombia", "cu_Cuba", "cz_Czech Republic", "eg_Egypt", "ae_Emirates (UAE)", "fr_France", "de_Germany", "gr_Greece", "hk_Hong Kong", "hu_Hungary", "in_India", "id_Indonesia", "ie_Ireland", "il_Israel", "it_Italy", "jp_Japan", "kr_Korea", "lv_Latvia", "lt_Lithuania", "my_Malaysia", "mx_Mexico", "ma_Morocco", "ng_Nigeria", "nl_Netherlands", "nz_New Zealand", "no_Norway", "ph_Philippines", "pl_Poland", "pt_Portugal", "ro_Romania", "ru_Russia", "sa_Saudi Arabia", "rs_Serbia", "sg_Singapore", "sk_Slovakia", "si_Slovenia", "za_South Africa", "se_Sweden", "ch_Switzerland", "tw_Taiwan", "th_Thailand", "tr_Turkey", "ua_Ukraine", "gb_United Kingdom", "us_United States", "ve_Venezuela"]

    categories = ["", "Business", "Entertainment", "Health", "Science", "Sports", "Technology"]

    submit = event => {
        event.preventDefault()
        this.props.search(document.querySelector('input').value)
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div className="container-fluid">
                    {/* A way to use props in class based component described below, another by(by defining described in NewsItem.js) */}
                    <Link className="navbar-brand" to="/" onClick={() => {
                        this.props.setCat("")
                    }}>News-Dose</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {this.categories.map((element) => {
                                return (
                                    <li className="nav-item" key={element}>
                                        <Link className="nav-link" aria-current="page" to={`/${element.toLowerCase()}`} onClick={() => {
                                            this.props.setCat(element)
                                        }}>{element ? element : "Home"}</Link>
                                    </li>)
                            })}
                        </ul>
                        <select className="form-select w-auto" aria-label="Default select example" defaultValue="in" onChange={() => { this.props.setCoun(document.querySelector("select").value) }} style={{ marginRight: "0.5rem" }}>
                            {this.countries.map(element => {
                                return (
                                    <option value={element.split('_')[0]} key={element.split('_')[0]}>{element.split('_')[1]}</option>
                                )
                            })}
                        </select>
                        <form className="d-flex w-auto" onSubmit={this.submit}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-primary" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav >
        )
    }
}

export default Navbar
