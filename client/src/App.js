import './App.css';
import React from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';

class App extends React.Component {
  state = { data: null }


  componentDidMount() {
    axios.get('http://localhost:5000')
      .then((response) => {
        this.setState({
          data: response.data
        })
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      })
  };

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <h1>GoodThings</h1>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </header>
          <main>
            <Routes>
              <Route path="/" />
              <Route path="/register" />
              <Route path="/login" />
            </Routes>
          </main>
        </div>
        )
      }
    }
    
  export default App;
