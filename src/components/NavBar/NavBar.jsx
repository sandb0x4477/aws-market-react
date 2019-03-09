import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Container, Button, Icon, Dropdown } from 'semantic-ui-react';

import NewMarketModal from './NewMarketModal';

const NavBar = ({ user, handleSignOut }) => {
  const [modal, setModal] = useState(false);

  const greetings = `Hello, ${user.username}`;

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

          <Menu.Item position='right'>
            <Dropdown pointing='top right' text={greetings}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to='/profile' text='Profile' icon='cog' />
                <Dropdown.Item text='Sign Out' icon='power' onClick={handleSignOut} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Container>
        {/* Modal create new Market */}
        <NewMarketModal
          showModal={modal}
          closeModal={closeModal}
          username={user.username}
        />
      </Menu>
    </>
  );
};

export default NavBar;
