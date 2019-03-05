import React, { Component } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';

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

  render() {
    const { user } = this.state;

    return <Authenticator theme={theme} />;
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
