import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import DocumentsListPage from './pages/documents-list';

class App extends Component {
    render() {
      return (
          <Container>
            <div className="ui two item menu">
              <NavLink className="item" activeClassName="active" exact to="/">Documents</NavLink>
            </div>
            <Route exact path="/" component={DocumentsListPage}/>
          </Container>
      );
   }
}

export default App;
