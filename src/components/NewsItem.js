import React, { Component } from 'react'
import newsImg from '../news.webp'

export class NewsItem extends Component {
    render() {
        let { title, description, imgUrl, newsUrl, author, date, source } = this.props // setting props in class-based component. props is passed to NewsItem class from News component and then accessed in render() function using 'this' keyword.
        // let {} = props could also be used in function based component without 'this' by accepting props as parameter.
        return (
            <div className="card mt-4 mb-3" style={{ paddingBottom: "2rem" }}>
                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger border">{source}</span>
                <img src={imgUrl ? imgUrl : newsImg} onError={event => { event.target.src = newsImg }} className="card-img-top" alt="News" style={{ height: "12rem" }} />
                <div className="card-body">
                    <hr />
                    <h5 className="card-title">{title}</h5>
                    <hr />
                    <p className="card-text">{description}</p>
                    <p className="card-text"><small className="text-muted">Published {author ? `by ${author}` : ""} on {new Date(date).toLocaleString()}</small></p>
                    {/* newsUrl is the url from where news is coming to uniquely identify a news item */}
                    {/* rel="noreferrer" must be used with target="_blank" even in normal programs(other than react) */}
                    <a href={newsUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary" style={{ position: "absolute", bottom: "1rem" }}>Read More</a>
                </div>
            </div>
        )
    }
}

export default NewsItem
