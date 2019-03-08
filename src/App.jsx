import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { Container } from 'semantic-ui-react';

import './App.css';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import NavBar from './components/NavBar';

export const UserContext = React.createContext();

class App extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule');
  }

  onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signIn':
        console.log('signed in');
        this.getUserData();
        break;
      case 'signUp':
        console.log('signed up');
        // this.getUserData();
        break;
      case 'signOut':
        console.log('signed out');
        this.setState({ user: null });
        break;
      default:
        return;
    }
  };

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }) : this.setState({ user: null });
  };

  handleSignOut = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  render() {
    const { user } = this.state;

    return !user ? (
      <Authenticator theme={theme} />
    ) : (
      <UserContext.Provider value={{ user }}>
        <Router>
          <>
            <div className='ui container'>
              <NavBar user={user} handleSignOut={this.handleSignOut} />
              <Container className='main'>
                <Route exact path='/' component={HomePage} />
                <Route path='/profile' component={ProfilePage} />
                <Route
                  path='/markets/:marketId'
                  component={({ match }) => (
                    <MarketPage marketId={match.params.marketId} />
                  )}
                />
              </Container>
            </div>
          </>
        </Router>
      </UserContext.Provider>
    );
  }
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: '#adebad'
  },
  button: {
    ...AmplifyTheme.button,
    backgroundColor: 'var(--amazonOrange)'
  }
};

export default App;
