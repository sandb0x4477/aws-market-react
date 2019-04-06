import React, { useState } from 'react';
import { Icon, Button, Segment, Grid, Confirm } from 'semantic-ui-react';

import Loading from '../Loading';

const ProfileCard = ({ user, userAttributes }) => {
  // console.log('user', user);
  const [confirm, setConfrim] = useState(false);

  if (!user || !userAttributes) return <Loading />;

  const handleDeleteProfile = async () => {
    try {
      await user.deleteUser();
      setConfrim(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Segment attached='bottom'>
        <Segment.Group>
          <Segment attached>
            <Grid verticalAlign='middle'>
              <Grid.Column width={1}>
                <Icon name='user' size='large' color='teal' />
              </Grid.Column>
              <Grid.Column width={11}>
                <span>Username: {user.username}</span>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment attached>
            <Grid verticalAlign='middle'>
              <Grid.Column width={1}>
                <Icon name='id card' size='large' color='teal' />
              </Grid.Column>
              <Grid.Column width={11}>
                <span>Id: {userAttributes.sub}</span>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment attached>
            <Grid verticalAlign='middle'>
              <Grid.Column width={1}>
                <Icon name='envelope' size='large' color='teal' />
              </Grid.Column>
              <Grid.Column width={11}>
                <span>Email: {userAttributes.email}</span>
              </Grid.Column>
              {/*<Grid.Column width={4}>*/}
              {/*  {userAttributes.email_verified ? (*/}
              {/*    <Button floated={'right'} color='teal' size='tiny' content='Change' />*/}
              {/*  ) : (*/}
              {/*    <Button*/}
              {/*      floated={'right'}*/}
              {/*      color='teal'*/}
              {/*      size='tiny'*/}
              {/*      content='Verify email'*/}
              {/*    />*/}
              {/*  )}*/}
              {/*</Grid.Column>*/}
            </Grid>
          </Segment>
          <Segment attached>
            <Grid verticalAlign='middle'>
              <Grid.Column width={1}>
                <Icon name='phone' size='large' color='teal' />
              </Grid.Column>
              <Grid.Column width={11}>
                <span>Phone: {userAttributes.phone_number}</span>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment attached>
            <Grid verticalAlign='middle'>
              <Grid.Column width={1}>
                <Icon name='dont' size='large' color='red' />
              </Grid.Column>
              <Grid.Column width={11}>
                <span>Delete Your Account</span>
              </Grid.Column>
              <Grid.Column width={4}>
                <Button
                  floated={'right'}
                  color='red'
                  size='tiny'
                  content='Delete'
                  onClick={() => setConfrim(true)}
                />
              </Grid.Column>
            </Grid>
          </Segment>
        </Segment.Group>
      </Segment>
      <Confirm
        content='This will permanently delete your account. Continue?'
        cancelButton='Never mind'
        confirmButton="Let's do it"
        open={confirm}
        onCancel={() => setConfrim(false)}
        onConfirm={handleDeleteProfile}
      />
    </>
  );
};

export default ProfileCard;
