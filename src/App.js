import './App.css';

// Till now we were using function based components (which are easier to create and understand) but now we will understand class-based components (only helpful if someone doesn't want to use hooks, props as in class based components, method management is easier and we can do things directly using 'this' keyword without hooks, props, etc.)
import React, { Component } from 'react'

export default class App extends Component { // This is a class based component
  name = "Sahil"; // in class, we don't define any variable and directly use them instead
  render() {
    return (
      <div>
        {/* using 'this' keyword, we are using the name identifier of parent class of render() function */}
        Hello {this.name}! 
      </div>
    )
  }
}
