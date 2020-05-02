import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import { getEvents } from '../../logic/api';

import EventCard from '../EventCard/EventCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Home = () => {
  const style = Style();

  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEvents()
      .then((data) => setEvents(data.events))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          {events &&
            events.length > 0 &&
            events.map((event) => (
              <Grid item key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))}
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Home;
