import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  FormControl, FormHelperText, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
}));

// Pane for users to confirm their county if there is more than one to a zip
const CountyPane = (props) => {
  const { zipId, setZipId } = props;
  const [value, setValue] = useState('');
  const [countyError, setCountyError] = useState(false);

  const classes = useStyles();

  const handleSubmit = () => {
    // validates user input is done correctly
    if (value === '') {
      setCountyError(true);
    // If all is ok, zipId state can be set
    } else {
      setCountyError(false);
      setZipId([value]);
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <div className={classes.section}>
        <Typography gutterBottom variant="body2">
          Please confirm your county.
        </Typography>
        <FormControl className={classes.formControl} error={countyError}>
          <InputLabel id="county-select-label">County</InputLabel>
          <Select
            labelId="county-select-label"
            id="county-simple-select"
            value={value}
            onChange={handleChange}
          >
            {zipId.map((zip) => (
              <MenuItem key={zip.id} value={zip.id}>{zip.county}</MenuItem>
            ))}
          </Select>
          {countyError && <FormHelperText>This is required!</FormHelperText>}

        </FormControl>
      </div>
      <div className={classes.section}>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </div>

    </div>
  );
};

export default CountyPane;

CountyPane.propTypes = {
  zipId: PropTypes.arrayOf(
    PropTypes.shape({
      city: PropTypes.string,
      county: PropTypes.string,
      id: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
    }),
  ).isRequired,
  setZipId: PropTypes.func.isRequired,
};
