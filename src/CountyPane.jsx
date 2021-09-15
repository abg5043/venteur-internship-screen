import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
}));

const CountyPane = (props) => {
  const { zipId, setZipId } = props;
  const [value, setValue] = useState('');

  const classes = useStyles();

  const handleSubmit = () => {
    setZipId([value]);
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
        <FormControl className={classes.formControl}>
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
        </FormControl>
      </div>
      <div className={classes.section}>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </div>

    </div>
  );
};

export default CountyPane;
