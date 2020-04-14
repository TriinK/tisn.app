import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import SwipeableViews from 'react-swipeable-views';

import { getUser, putUser, getInterests } from '../../logic/api';
import { inputDate } from '../../logic/date-time';
import { uploadFile } from '../../logic/file-upload';

import { useUser, useSetUser } from '../UserProvider/UserProvider';

import UserForm from '../UserForm/UserForm';
import UserInterestsForm from '../UserInterestsForm/UserInterestsForm';

import Style from '../Style/Style';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const UserTabs = ({ match }) => {
  const history = useHistory();
  const style = Style();
  const currentUser = useUser();
  const setCurrentUser = useSetUser();

  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [allInterests, setAllInterests] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatar, setAvatar] = useState('');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = match.params.id;
  useEffect(() => {
    if (id && currentUser) {
      setLoading(true);
      if (currentUser._id === id) {
        setUser(currentUser);
        setLoading(false);
      } else if (currentUser.admin) {
        getUser(id)
          .then((data) => setUser(data.user))
          .catch((error) => setError(error.message))
          .finally(() => setLoading(false));
      } else {
        history.push(`/users/${currentUser._id}/edit`);
      }
    }
  }, [id, currentUser, history]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(inputDate(user.dateOfBirth));
      setAvatar(user.avatar);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    getInterests()
      .then((data) => setAllInterests(data.interests))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && allInterests) {
      setLoading(true);
      setInterests(
        allInterests.filter((interest) =>
          user.interests.some(
            (userInterest) => userInterest._id === interest._id
          )
        )
      );
      setLoading(false);
    }
  }, [user, allInterests]);

  const handleNameChange = (name) => setName(name);

  const handleEmailChange = (email) => setEmail(email);

  const handleDateOfBirthChange = (dateOfBirth) => setDateOfBirth(dateOfBirth);

  const handleFileUpload = (file) => {
    if (file) {
      setLoading(true);
      uploadFile(file)
        .then((data) => setAvatar(data.uploadedFile.secure_url))
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  };

  const handleInterestsChange = (interests) => setInterests(interests);

  const handleEditClick = () => {
    setLoading(true);
    putUser(id, {
      name,
      email,
      dateOfBirth,
      avatar,
      interests,
    })
      .then((data) => {
        if (currentUser._id === id) {
          setCurrentUser(data.user);
        }
        history.push(`/users/${id}`);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">Edit</Typography>
          </Grid>
          <Grid item>
            <Paper>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={(event, newValue) => setValue(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Details" />
                  <Tab label="Interests" />
                  <Tab label="Settings" />
                </Tabs>
              </AppBar>
              {user && (
                <SwipeableViews
                  index={value}
                  onChangeIndex={(index) => setValue(index)}
                >
                  <TabPanel value={value} index={0}>
                    <UserForm
                      name={name}
                      handleNameChange={handleNameChange}
                      email={email}
                      handleEmailChange={handleEmailChange}
                      dateOfBirth={dateOfBirth}
                      handleDateOfBirthChange={handleDateOfBirthChange}
                      avatar={avatar}
                      handleFileUpload={handleFileUpload}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <UserInterestsForm
                      allInterests={allInterests}
                      interests={interests}
                      handleInterestsChange={handleInterestsChange}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Typography
                      variant="body1"
                      className={`${style.center} ${style.formInput}`}
                    >
                      Settings
                    </Typography>
                  </TabPanel>
                </SwipeableViews>
              )}
            </Paper>
          </Grid>
          <Grid item>
            <Button
              className={style.buttons}
              variant="outlined"
              color="primary"
              onClick={() => history.push(`/users/${id}`)}
            >
              Cancel
            </Button>
            <Button
              className={style.buttons}
              variant="contained"
              color="primary"
              onClick={() => handleEditClick()}
              disabled={loading || !name || !email || !dateOfBirth}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default UserTabs;