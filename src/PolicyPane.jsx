import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  FormControl, FormHelperText, InputLabel, ListItem, ListItemText, MenuItem, Select,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
  },
  rows: {
    width: '100%',
    height: 500,
  },
  textField: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));

// Pane for users to see, choose, and enroll in policies
const PolicyPane = (props) => {
  const {
    policies, gender, smoker, age, zipId, setSuccessAlert, setFailAlert,
  } = props;
  const [quotedProducts, setQuotedProducts] = useState();
  const [policyId, setPolicyId] = useState('');
  const [benefitAmt, setBenefitAmt] = useState();
  const [benefitError, setBenefitError] = useState(false);
  const [benefitErrorMessage, setBenefitErrorMessage] = useState('');
  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);
  const [policyIdError, setPolicyIdError] = useState(false);

  const classes = useStyles();

  // filters through policies to find distinct carriers
  const carriers = [];
  policies.forEach((policy) => {
    if (!carriers.includes(policy.carrierName)) {
      carriers.push(policy.carrierName);
    }
  });
  carriers.sort();

  // Function for rendering rows of product table
  const renderRows = (renderProps) => {
    const { style, index } = renderProps;
    /* If user has not yet stated their term and benefit preferences,
     * just return the list of providers
     */
    if (quotedProducts === undefined) {
      return (
        <ListItem button style={style} key={index}>
          <ListItemText
            primary={carriers[index]}
          />
        </ListItem>
      );
    }
    /* If user has stated their term and benefit preferences,
     * return the list of providers and their costs
     */
    return (
      <ListItem button style={style} key={index}>
        <ListItemText
          primary={quotedProducts[index].name}
          secondary={`$${quotedProducts[index].annualPremium} per year ($${
            (quotedProducts[index].annualPremium / 12).toFixed(2)} per month)`}
        />
      </ListItem>
    );
  };

  // Function for validating integers
  const isNormalInteger = (str) => {
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
  };

  // Handles user's attempt to enroll in policy and subsequent API call
  const handleEnrollPost = () => {
    // validates user input is done correctly
    if (policyId === '') {
      setPolicyIdError(true);
    } else {
      setPolicyIdError(false);
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          zipCountyId: zipId[0],
          age,
          gender,
          smoker,
          policyId,
          benefitAmount: benefitAmt,
        }),
      };

      fetch('http://tech-screen.venteur.co/Policies/Enroll', requestOptions)
        .then((response) => {
          if (response.ok) {
            setSuccessAlert(true);
          } else {
            setFailAlert(true);
          }
        });
    }
  };

  // Handles user's submission of benefit amounts and term limits; generates quotes for the user
  const handleSubmit = () => {
    // Tests if you have any invalid or missing inputs inputs
    if (!isNormalInteger(benefitAmt)
        || benefitAmt < 1
        || benefitAmt > 999999
        || term === ''
    ) {
      // Sets error if benefit is invalid or missing and corrects error if not
      if (!isNormalInteger(benefitAmt) || benefitAmt < 1 || benefitAmt > 999999) {
        setBenefitError(true);
        setBenefitErrorMessage('Please enter a valid benefit');
      } else if (isNormalInteger(benefitAmt) || benefitAmt > 1 || benefitAmt < 999999) {
        setBenefitError(false);
        setBenefitErrorMessage('');
      }

      // Sets error if term missing and corrects error if not
      if (term === '') {
        setTermError(true);
      } else if (term !== undefined) {
        setTermError(false);
      }

      // If all is fine with inputs, reset the error messages and filter the data
    } else {
      setBenefitError(false);
      setBenefitErrorMessage('');
      setTermError(false);

      // filters the policies based on user input for term and benefitAmount
      const tempArr = [];
      policies.forEach((policy) => {
        if (
          !tempArr.includes(policy.carrierName)
            && policy.minBenefitAmount <= benefitAmt
            && policy.maxBenefitAmount > benefitAmt
            && policy.term.toLowerCase() === term.toLowerCase()
        ) {
          tempArr.push(
            {
              name: policy.carrierName,
              id: policy.id,
              annualPremium: ((benefitAmt / 5000.00) * policy.annualPremiumRate).toFixed(2),
            },
          );
        }
      });
      // sets the state for quotes
      setQuotedProducts(tempArr);
    }
  };

  // Conditionally renders elements depending on if user has stated their term/benefit preferences
  const renderElements = () => {
    // If user has submitted preferences for term length and benefit amount, return this
    if (quotedProducts !== undefined) {
      return (
        <div>
          <div className={classes.section}>
            <Typography gutterBottom variant="body2">
              Please select a policy from the ones below by provider name.
            </Typography>
            <FormControl className={classes.formControl} error={policyIdError}>
              <InputLabel id="policy-select-label">Policy</InputLabel>
              <Select
                labelId="policy-select-label"
                id="policy-simple-select"
                value={policyId}
                onChange={(event) => {
                  setPolicyId(event.target.value);
                }}
              >
                {quotedProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                ))}
              </Select>
              {policyIdError && <FormHelperText>This is required!</FormHelperText>}
            </FormControl>
          </div>
          <div className={classes.section}>
            <Button variant="contained" onClick={handleEnrollPost}>Submit</Button>
          </div>
        </div>
      );
    }
    // If user has not submitted their preferences for benefits and term amount, return this
    return (
      <div>
        <div className={classes.section}>
          <Typography gutterBottom variant="body2">
            Please enter your desired term (10 years, 20 years, 30 years, or whole life) and
            benefit amount ($1 – $999,999).
          </Typography>
          <TextField
            className={classes.textField}
            id="benefit-text-box"
            label="Benefit Amount"
            type="Benefit Amount"
            onChange={(e) => {
              setBenefitAmt(e.target.value);
            }}
            error={benefitError}
            helperText={benefitErrorMessage}
          />
          <FormControl className={classes.formControl} error={termError}>
            <InputLabel id="term-select-label">Term</InputLabel>
            <Select
              labelId="term-select-label"
              id="term-simple-select"
              value={term}
              onChange={(event) => {
                setTerm(event.target.value);
              }}
            >
              <MenuItem key="years10" value="years10">10 Years</MenuItem>
              <MenuItem key="years20" value="years20">20 Years</MenuItem>
              <MenuItem key="years30" value="years30">30 Years</MenuItem>
              <MenuItem key="wholelife" value="wholelife">Whole Life</MenuItem>
            </Select>
            {termError && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
        </div>
        <div className={classes.section}>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderElements()}
      <div>
        <Typography gutterBottom variant="h5">
          Available products
        </Typography>
      </div>
      <div className={classes.rows}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={46}
              itemCount={carriers.length}
            >
              {renderRows}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default PolicyPane;

PolicyPane.propTypes = {
  policies: PropTypes.arrayOf(
    PropTypes.shape({
      annualPremiumRate: PropTypes.number,
      carrierName: PropTypes.string,
      id: PropTypes.string,
      maxBenefitAmount: PropTypes.number,
      minBenefitAmount: PropTypes.number,
      term: PropTypes.string,
      zipCountyId: PropTypes.string,
    }),
  ).isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  smoker: PropTypes.string.isRequired,
  zipId: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSuccessAlert: PropTypes.func.isRequired,
  setFailAlert: PropTypes.func.isRequired,
};
