import './App.css';

// Till now we were using function based components (which are easier to create and understand) but now we will understand class-based components (method management is easier and we can do things directly using 'this' keyword without hooks, props, etc.)
import React, { Component } from 'react'
import Navbar from './components/Navbar';
import News from './components/News';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

export default class App extends Component { // This is a class based component

  constructor() {
    super()
    this.state = {
      country: localStorage.getItem('country') || "in",
      query: ""
    }
    this.categories = ["", "Business", "Entertainment", "Health", "Science", "Sports", "Technology"];
  }

  setCoun = country => {
    this.setState({ country })
  }

  search = query => {
    this.setState({ query })
  }

  render() { // render() function is pre-defined and is used to render something in webpage (also used in index.js as ReactDOM.render())
    // let setCat = this.setCat // but still we have to define title here since render() is a function and not a class. Also, since parent of render() is App class, we can access App's identifiers and other functions using 'this'
    return (
      <div>
        <Router>
          {/* using 'this' keyword, we are using the name identifier of parent class of render() function */}
          <Navbar setCoun={this.setCoun} setCat={this.setCat} search={this.search} />
          <div id="loadBar" className="fixed-top" style={{
            height: "0.125rem",
            width: "0vw",
            backgroundColor: "red",
            transition: "width 0.25s"
          }} />
          <Routes>
            {/* here key needs to defined uniquely for all categorized News components with different categories as when we switch to a different endpoint(category), react thinks that there is no need to render News again as its already rendered and does nothing but when we define different keys for different News components, so on changing the endpoint, it identifies that the new News component is different from the current one and it re-renders it with the new props */}
            {this.categories.map((category)=>{
              return <Route path={`/${category.toLowerCase()}`} element={<News country={this.state.country} key={this.state.country + category + this.state.query} category={category} query={this.state.query} />} />
            })}
            {/* <Route path='/science' element={<News country={this.state.country} key={this.state.country + 'science' + this.state.query} category={'Science'} query={this.state.query} />} /> */}
          </Routes>
        </Router>
      </div>
    )
  }
}
