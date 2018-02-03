import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './actions';
import logo from './logo.svg';
import Header from './components/Header';
import './App.css';
import { FETCH_ARTICLES } from './actions/types';

const Landing = () => <h2>DATA BLARGH</h2>;

class App extends Component {
  componentDidMount() {
    this.props.fetchArticles();
    console.log(FETCH_ARTICLES);
   
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
            <div>
            <header className="App-header">
              <h1>WTF Happened Now?</h1>
              <h2>Top news trends every hour, on the hour. Is it F5 O'clock?</h2>
            </header>
            <Route exact={true} path="/" component={Landing} />
            </div>
          </BrowserRouter>
        </div>
    );
  }
}

export default connect(null, actions)(App);