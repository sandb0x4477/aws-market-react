import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { API, graphqlOperation, Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { Container } from 'semantic-ui-react';

import './App.css';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
// import MarketPage from './pages/MarketPage';
import NavBar from './components/NavBar/NavBar';
import MarketPageTest from './pages/MarketPageTest';

import { getUser } from './graphql/queries';
import { registerUser } from './graphql/mutations';

export const UserContext = React.createContext();

class App extends Component {
  state = {
    user: null,
    userAttributes: null
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
        this.registerNewUser(capsule.payload.data);
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
    // console.log('user:', user);
    user
      ? this.setState({ user }, () => this.getUserAttributes(this.state.user))
      : this.setState({ user: null });
  };

  getUserAttributes = async authUserData => {
    const attributesArr = await Auth.userAttributes(authUserData);
    const attributesObj = Auth.attributesToObject(attributesArr);
    this.setState({ userAttributes: attributesObj });
  };

  registerNewUser = async signInData => {
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    };
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));
    // if we can't get a user (meaning the user hasn't been registered before), then we execute registerUser
    if (!data.getUser) {
      console.log('Registering new user....:', signInData);
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.signInUserSession.idToken.payload.email,
          registered: true
        };
        const newUser = await API.graphql(
          graphqlOperation(registerUser, { input: registerUserInput })
        );
        console.log({ newUser });
      } catch (err) {
        console.error('Error registering new user', err);
      }
    }
  };

  handleSignOut = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  render() {
    const { user, userAttributes } = this.state;

    return !user ? (
      <Authenticator theme={theme} />
    ) : (
      <UserContext.Provider value={{ user, userAttributes }}>
        <Router>
          <>
            <div className='ui container'>
              <NavBar user={user} handleSignOut={this.handleSignOut} />
              <Container className='main'>
                <Route exact path='/' component={HomePage} />
                <Route
                  path='/profile'
                  component={ProfilePage}
                  user={user}
                  userAttributes={userAttributes}
                />
                <Route
                  path='/markets/:marketId'
                  component={({ match }) => (
                    <MarketPageTest
                      marketId={match.params.marketId}
                      userAttributes={userAttributes}
                      user={user}
                    />
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
