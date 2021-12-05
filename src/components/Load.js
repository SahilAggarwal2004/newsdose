import React, { Component } from 'react'
// import loading from '../load.gif'

export class Load extends Component {
    render() {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: "60vh"}} >
                <div className="spinner-border" role="status" />
                {/* We can also import gif as img as follows */}
                {/* <img src={loading} alt="Loading..." style={{ height: "1.4rem", position: "fixed", top: "50vh", left: "50vw" }} /> */}
            </div>
        )
    }
}

export default Load
