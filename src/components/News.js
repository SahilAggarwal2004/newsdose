import React, { Component } from 'react'
import Load from './Load';
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'

// In react class-based components, there are some lifecycle methods which determines the life-cycle of a class component. For study of this, refer https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
export class News extends Component {

    // defaultProps and propTypes in class based component
    static defaultProps = {
        country: "in",
        pageSize: 99,
        category: ""
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    constructor(props) { // constructor method is used in class based component either to bind a method, initialize state(like useState in functions) or to access properties of parent component. constrictor is a method of OOP.

        super(props); // it must be used inside constructor as it is the method which is accessing properties(here, props) of parent component(News class for constructor). For this purpose, we can pass parameter to access the props and now use props using "this.props" inside our News class
        // Now after using super(), props that were being passed to News component from App.js can be accessed using 'props' inside this constructor

        this.state = { // here we can pass our state variables (which needs to be updated just as useState in functions)
            articles: [], // it can be accessed in our News class using this.state.keyName
            // page: 1,
            // maxPage: 1,
            load: false
        }
        // this.setState is a method to update state in class based component which will not be used in the constructor but outside the constructor

        // Below is the way to bind a function in constructor():
        // this.next = this.next.bind(this); // this.funcName = this.funcName.bind(this)

        document.title = `NewsDose - ${props.category ? props.category : "Get your daily dose of news for free!"}`;
    }
    // basicaly the main purpose of using the constructor is to define state

    // async update(page = 1) {
    //     this.setState({ load: true })
    //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&apiKey=${this.apikey}&category=${this.props.category.toLowerCase()}&page=${page}&pageSize=${this.props.pageSize}&q=${this.props.query}`;
    //     // we can add filters in our API (available in detail at source api documentation). Eg: top-headlines is a filter(only this is different from other filter, i.e, in our api (usually in all apis/links), all other filters are added after ?(represented get request) and are separated by &), also country=in is a filter. News API we are using, category=something is a filter for category of news, pageSize=num_of_articles in one page(default 20), page=pg_num is for page number(we can access 20(default) articles only in a single page, if more articles are available in our api, we must change the page). Even apiKey is a filter(this represented the developer who is using the api)

    //     // update state using setState()
    //     this.setState({ // this.setState(keyName: value) (Note that the key we are updating must be already present in the this.state object already
    //         page: page,
    //         articles: parsedData.articles,
    //         load: false,
    //         maxPage: page === 1 ? Math.ceil(parsedData.totalResults / this.props.pageSize) : this.state.maxPage
    //     })
    // }

    async componentDidMount() { // componentDidMount() runs after render(), so here we can do things which we want to do after the components have been rendered
        // this.update()
        let loadBar = document.getElementById("loadBar").style
        loadBar.visibility = "visible";
        loadBar.width = "10vw";
        this.setState({ load: true })
        let url = process.env.REACT_APP_URL;
        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                country: this.props.country,
                category: this.props.category.toLowerCase(),
                page: 1,
                pageSize: this.props.pageSize,
                query: this.props.query
            })
        });
        loadBar.width = "15vw";
        let data = await response.json();
        let parsedData = data.news;
        loadBar.width = "25vw";
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            load: false
        })
        loadBar.width = "100vw";
        setTimeout(() => {
            loadBar.visibility = "hidden";
            loadBar.width = "0vw";
        }, 300);
        let page = 1
        while (this.state.articles.length <= parsedData.totalResults - this.props.pageSize) {
            page++
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country: this.props.country,
                    category: this.props.category.toLowerCase(),
                    page: page,
                    pageSize: this.props.pageSize,
                    query: this.props.query
                })
            });
            data = await response.json();
            parsedData = data.news;
            this.setState({
                articles: this.state.articles.concat(parsedData.articles),
            })
        }
    }

    // prev = async () => { // If a function is being used jsx code (inside or outside render()), that function should be either arrow function like this function or that funnction should be bound to the constructor() like next() to avoid errors
    //     this.update(this.state.page - 1)
    // }
    // async next() { // bound in constructor()
    //     this.update(this.state.page + 1)
    // }

    render() {
        return (
            <div className="container" style={{ marginTop: "70px" }}>
                <h3 className="text-center">Top Headlines{this.props.category ? ` - ${this.props.category}` : ""}</h3>
                <hr />
                {!this.state.load ?
                    <>
                        {/* row and col-md are bootstrap classes for grid. Now when we want to add some items to a grid, we can give a row class (used to hold columns) to the parent container. Doing this divides the container into 12 equal columns and by using col-md-(n) class for the items, we can decide the number of columns occupied by a single item */}
                        {/* since each div is given a width of 4 columns, and there is a total space of 12 columns, total 3 columns of equal width will be formed and each item will be filled in columns by order: column1-->column2-->column3 */}
                        <div className="row">
                            {this.state.articles.length ? this.state.articles.map(element => {
                                return (
                                    <div className="col-md-4 d-flex" key={element.url}>
                                        <NewsItem title={element.title} description={element.description} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                    </div>
                                )
                            })
                                : <div className="text-center">Seems like there is no news related to <strong>{this.props.query}</strong></div>}
                        </div>
                        {/* <div className="d-flex justify-content-between mt-3">
                            <button disabled={this.state.page === 1} type="button" className="btn btn-sm btn-primary" onClick={this.prev}>&larr; Previous</button>
                            <button disabled={this.state.maxPage <= this.state.page} type="button" className="btn btn-sm btn-primary" onClick={this.next}>Next &rarr;</button>
                        </div> */}
                    </>
                    : <Load />}
            </div>)
    }
}

export default News
