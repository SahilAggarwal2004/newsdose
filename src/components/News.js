import React, { Component } from 'react'
import Load from './Load';
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'

export class News extends Component {

    // defaultProps and propTypes in class based component
    static defaultProps = {
        country: localStorage.getItem('country') || 'in',
        category: '',
        query: ''
    }
    static propTypes = {
        country: PropTypes.string,
        category: PropTypes.string,
        query: PropTypes.string
    }

    constructor(props) {

        super(props);

        this.state = {
            articles: [],
            news: [],
            load: false,
            error: false
        }

        document.title = `NewsDose - ${props.category ? props.category : "Get your daily dose of news for free!"}`;
    }

    async componentDidMount() {
        let loadBar = document.getElementById("loadBar").style
        loadBar.visibility = "visible";
        loadBar.width = "10vw";
        this.setState({ load: true })
        let parsedData = JSON.parse(sessionStorage.getItem(`news${this.props.country}${this.props.category}`))
        if (!parsedData) {
            let url = process.env.REACT_APP_URL;
            let response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country: this.props.country,
                    category: this.props.category.toLowerCase()
                })
            });
            loadBar.width = "33vw";
            let data = await response.json();
            if (data.success) {
                parsedData = data.news;
                sessionStorage.setItem(`news${this.props.country}${this.props.category}`, JSON.stringify(parsedData))
            }
        }
        this.setState({
            articles: this.state.articles.concat(parsedData?.articles),
            news: this.state.news.concat(parsedData?.articles),
            load: false,
            error: data.error
        })
        loadBar.width = "100vw";
        setTimeout(() => {
            loadBar.visibility = "hidden";
            loadBar.width = "0vw";
        }, 300);
    }

    componentDidUpdate(previous) {
        if (this.props.query !== previous.query) {
            console.log(this.props.query)
            if (this.props.query) {
                const query = this.props.query.toLowerCase();
                let result = [];
                this.state.articles.forEach(element => {
                    const title = element.title ? element.title.toLowerCase() : ''
                    const description = element.description ? element.description.toLowerCase() : ''
                    const author = element.author ? element.author.toLowerCase() : ''
                    const source = element.source.name ? element.source.name.toLowerCase() : ''
                    if (title.includes(query) || description.includes(query) || author.includes(query) || source.includes(query)) {
                        result.push(element)
                    }
                });
                this.setState({ news: result })
            } else {
                this.setState({ news: this.state.articles })
            }
        }
    }

    render() {
        return (
            <div style={{ marginTop: "70px" }}>
                <h3 className="text-center">Top Headlines{this.props.category ? ` - ${this.props.category}` : ""}</h3>
                <hr />
                {!this.state.load ?
                    <div className="row mx-4 py-2 gx-4">
                        {this.state.news.length ? this.state.news.map(element => {
                            return (
                                <div className="col-md-4 d-flex" key={element.url}>
                                    <NewsItem title={element.title} description={element.description} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            )
                        })
                            : this.props.query ? <div className="text-center">
                                Seems like there is no news related to
                                <strong>{this.props.query}</strong>
                            </div> : <div>
                                {this.state.error ? this.state.error : 'Unable to fetch! Try again later...'}
                            </div>}
                    </div>
                    : <Load />}
            </div>)
    }
}

export default News
