import React, { Component } from "react";
import "./Static/home.css";
import Nav from "./Nav";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <div id="home-page-upper-frame">
          <Nav />
          <center>
            <h1 id="site-title">Bespeaking Immerse In The Luxury</h1>
            <br />
            <div id="search-engene-frame">
              <input placeholder="your locaktion" id="search-hotels"></input>
              <button className="search-home-page-button">search</button>
            </div>
          </center>
        </div>
        <footer id="home-footer" style={{backgroundColor: '#f8f9fa', padding: '10px 0'}}>
            <p>&copy; {new Date().getFullYear()} Bespeaking</p>
        </footer>
      </div>
    );
  }
}
