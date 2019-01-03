import React, { Component } from 'react';
import { Link, Router } from '@reach/router';
import styled from '@emotion/styled';

import Home from './Home';
import Namespaces from './Namespaces';

const Button = styled.button`
  color: hotpink;
`;

class App extends Component {
  render() {
    return (
      <div>
        <div className="header">
          <Link to="/">Home</Link>
          <Link to="/namespaces">Namespaces</Link>
        </div>
        <Button>teste4</Button>
        <Router>
          <Home path="/" />
          <Namespaces path="/namespaces" />
        </Router>
      </div>
    );
  }
}

export default App;
