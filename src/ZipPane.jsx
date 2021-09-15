import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
  },
}));

const ZipPane = (props) => {
  const [zip, setZip] = useState();
  const [zipError, setZipError] = useState(false);
  const [zipErrorMessage, setZipErrorMessage] = useState('');

  const { setZipId } = props;
  const classes = useStyles();

  const handleSubmit = () => {
    const zipId = [];

    if (zip === undefined || zip.length !== 5) {
      setZipError(true);
      setZipErrorMessage('Please enter a valid zip code');
    } else if (zip !== undefined) {
      setZipError(false);
      setZipErrorMessage('');

      const url = `http://tech-screen.venteur.co/zipcounties?zip=${zip}`;
      fetch(url)
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            setZipError(true);
            setZipErrorMessage('Please enter a valid zip code');
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
          return data;
        })
        .then((data) => {
          for (let i = 0; i < data.length; i += 1) {
            zipId.push(data[i]);
          }
          if (zipId.length > 1) {
            setZipId(zipId);
          } else {
            setZipId([zipId[0].id]);
          }
        });
    }
  };

  return (
    <div>
      <div className={classes.section}>
        <Typography gutterBottom variant="body2">
          Please enter your zip code
        </Typography>
        <TextField
          className={classes.textField}
          id="zipcode-text-box"
          label="Zip Code"
          type="Zip Code"
          onChange={(e) => {
            setZip(e.target.value);
          }}
          error={zipError}
          helperText={zipErrorMessage}
        />
      </div>
      <div className={classes.section2}>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </div>

    </div>
  );
};

export default ZipPane;

ZipPane.propTypes = {
  setZipId: PropTypes.func.isRequired,
};
