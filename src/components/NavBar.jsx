import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Container, Button, Icon } from 'semantic-ui-react';

import NewMarketModal from './NewMarketModal';

const NavBar = ({ user, handleSignOut }) => {
  const [modal, setModal] = useState(false);

  const closeModal = () => {
    setModal(false);
  };

  return (
    <>
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item as={Link} to='/' header>
            <Icon name='globe' size='large' />
            MarketPlace
          </Menu.Item>

          <Menu.Item>
            <Button color='teal' onClick={() => setModal(true)}>
              <Icon name='add circle' />
              Create Market
            </Button>
          </Menu.Item>

          <Menu.Item position='right'>Hello, {user.username}</Menu.Item>
          <Menu.Item as={Link} to='/profile'>
            <Icon name='cog' size='large' />
          </Menu.Item>
          <Menu.Item>
            <Button icon color='teal' floated='right' onClick={handleSignOut}>
              <Icon name='sign out' />
              Sign Out
            </Button>
            {/* <Button content='Sign Out' floated='right' color='teal' /> */}
          </Menu.Item>
        </Container>
        <NewMarketModal
          showModal={modal}
          closeModal={closeModal}
          username={user.username}
        />
        {/* <NewMarketModal showModal={modal} /> */}
      </Menu>
    </>
  );
};

export default NavBar;
