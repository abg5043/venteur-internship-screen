import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  FormControl, FormHelperText, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));

const UserInfoPane = (props) => {
  const {
    setPolicies,
    zipId,
    gender,
    setGender,
    age,
    setAge,
    smoker,
    setSmoker,
  } = props;

  const [ageError, setAgeError] = useState(false);
  const [ageErrorMessage, setAgeErrorMessage] = useState('');
  const [genderError, setGenderError] = useState(false);
  const [smokerError, setSmokerError] = useState(false);

  const classes = useStyles();

  function isNormalInteger(str) {
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
  }

  const handleSubmit = () => {
    if (!isNormalInteger(age) || gender === '' || smoker === '') {
      if (!isNormalInteger(age)) {
        setAgeError(true);
        setAgeErrorMessage('Please enter a valid age');
      } else if (isNormalInteger(age)) {
        setAgeError(false);
        setAgeErrorMessage('');
      }

      if (gender === '') {
        setGenderError(true);
      } else if (gender !== '') {
        setGenderError(false);
      }

      if (smoker === '') {
        setSmokerError(true);
      } else if (smoker !== '') {
        setSmokerError(false);
      }
    } else {
      setAgeError(false);
      setSmokerError(false);
      setGenderError(false);
      setAgeErrorMessage('');

      fetch('http://tech-screen.venteur.co/policies/quote', {
        method: 'POST',
        body: JSON.stringify({
          zipCountyId: zipId[0],
          age: Math.floor(age),
          gender,
          smoker,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setPolicies(json);
        });
    }
  };

  return (
    <div>
      <div className={classes.section}>
        <Typography gutterBottom variant="body2">
          Please enter your age, gender, and smoker status.
        </Typography>
        <TextField
          className={classes.textField}
          id="age-text-box"
          label="Age"
          type="Age"
          onChange={(e) => {
            setAge(e.target.value);
          }}
          error={ageError}
          helperText={ageErrorMessage}
        />
        <FormControl className={classes.formControl} error={genderError}>
          <InputLabel id="gender-select-label">Gender</InputLabel>
          <Select
            labelId="gender-select-label"
            id="gender-simple-select"
            value={gender}
            onChange={(event) => {
              setGender(event.target.value);
            }}
          >
            <MenuItem key="male" value="male">Male</MenuItem>
            <MenuItem key="female" value="female">Female</MenuItem>
          </Select>
          {genderError && <FormHelperText>This is required!</FormHelperText>}
        </FormControl>
        <FormControl className={classes.formControl} error={smokerError}>
          <InputLabel id="smoker-select-label">Smoker Status</InputLabel>
          <Select
            labelId="smoker-select-label"
            id="smoker-simple-select"
            value={smoker}
            onChange={(event) => {
              setSmoker(event.target.value);
            }}
          >
            <MenuItem key="nonsmoker" value="nonsmoker">Nonsmoker</MenuItem>
            <MenuItem key="smoker" value="smoker">Smoker</MenuItem>
          </Select>
          {smokerError && <FormHelperText>This is required!</FormHelperText>}

        </FormControl>
      </div>
      <div className={classes.section}>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </div>

    </div>
  );
};

export default UserInfoPane;

UserInfoPane.propTypes = {
  setPolicies: PropTypes.func.isRequired,
  zipId: PropTypes.arrayOf(PropTypes.string).isRequired,
  gender: PropTypes.string.isRequired,
  setGender: PropTypes.func.isRequired,
  age: PropTypes.string,
  setAge: PropTypes.func.isRequired,
  smoker: PropTypes.string.isRequired,
  setSmoker: PropTypes.func.isRequired,
};
