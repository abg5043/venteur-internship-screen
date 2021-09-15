import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {FormControl, FormHelperText, InputLabel, ListItem, ListItemText, MenuItem, Select,} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {FixedSizeList} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';


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

const PolicyPane = (props) => {
  const {policies, gender, smoker, age, zipId} = props;
  const [quotedProducts, setQuotedProducts] = useState();
  const [policyId, setPolicyId] = useState();
  const [benefitAmt, setBenefitAmt] = useState();
  const [benefitError, setBenefitError] = useState(false);
  const [benefitErrorMessage, setBenefitErrorMessage] = useState('');
  const [term, setTerm] = useState();
  const [termError, setTermError] = useState(false);
  const [productError, setProductError] = useState(false);

  const products = [];

  policies.forEach(policy => {
    if (!products.includes(policy.carrierName)) {
      products.push(policy.carrierName);
    }
  })
  products.sort();

  const renderRows = (props) => {
    const {style, index} = props;

    if (quotedProducts === undefined) {
      return (

          <ListItem button style={style} key={index}>
            <ListItemText
                primary={products[index]}
            />
          </ListItem>
      )
    } else {
      return (
          {/*<ListItem button style={style} key={index}>
            <ListItemText
                primary={products[index]}
            />
          </ListItem>*/}
      )
    }

  }


  const classes = useStyles();

  function isNormalInteger(str) {
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
  }

  const handleEnrollPost = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        zipCountyId: zipId[0].id,
        age,
        gender,
        smoker,
        policyId: policies[0].id,
        benefitAmount: policies[0].maxBenefitAmount - 1,
      }),
    };

    fetch('http://tech-screen.venteur.co/Policies/Enroll', requestOptions);
  };

  const handleSubmit = () => {
    if (!isNormalInteger(benefitAmt) || benefitAmt < 1 || benefitAmt > 999999 || term === undefined) {
      if (!isNormalInteger(benefitAmt) || benefitAmt < 1 || benefitAmt > 999999) {
        setBenefitError(true);
        setBenefitErrorMessage('Please enter a valid benefit');
      } else if (isNormalInteger(benefitAmt) || benefitAmt > 1 || benefitAmt < 999999)
        setBenefitError(false);
      setBenefitErrorMessage('');

      if (term === undefined) {
        setTermError(true);
      } else if (term !== undefined) {
        setTermError(false);
      }
    } else {
      setBenefitError(false);
      setBenefitErrorMessage('');
      setTermError(false);
    }
    ;

  }

  const renderElements = () => {
    //If user has not submitted preferences for term length and benefit amount
    if (quotedProducts !== undefined) {
      return (
          <div>
            <div className={classes.section}>
              <Typography gutterBottom variant="body2">
                Please select a policy by policy number.
              </Typography>
              <FormControl className={classes.formControl} error={productError}>
                <InputLabel id="policy-select-label">Policy</InputLabel>
                <Select
                    labelId="policy-select-label"
                    id="policy-simple-select"
                    value={policyId}
                    onChange={(event) => {
                      setPolicyId(event.target.value);
                    }}
                >


                  //INSERT MAP HERE WITH: NAME: PRICE
                  //HAVE THE USER SELECT EXACTLY THIS ARRAY OR JUST THE NAMES

                </Select>
                {productError && <FormHelperText>This is required!</FormHelperText>}
              </FormControl>
            </div>
            <div className={classes.section}>
              <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
      )
    } else {
      //If user has submitted their preferences for policies, return this
      return (
          <div>
            <div className={classes.section}>
              <Typography gutterBottom variant="body2">
                Please enter your desired term (10 years, 20 years, 30 years, or whole life) and benefit amount ($1 –
                $999,999).
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
            <div>
              <Typography gutterBottom variant="h5">
                Available products
              </Typography>
            </div>
            <div className={classes.rows}>
              <AutoSizer>
                {({height, width}) => (
                    <FixedSizeList
                        height={height}
                        width={width}
                        itemSize={46}
                        itemCount={products.length}>
                      {renderQuotedProducts}
                    </FixedSizeList>
                )}
              </AutoSizer>
            </div>
          </div>
      )

    }

  }

  return (<div>
        {renderElements()}
        <div>
          <Typography gutterBottom variant="h5">
            Available products
          </Typography>
        </div>
        <div className={classes.rows}>
          <AutoSizer>
            {({height, width}) => (
                <FixedSizeList
                    height={height}
                    width={width}
                    itemSize={46}
                    itemCount={products.length}>
                  {renderRows}
                </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      </div>
  );
}

export default PolicyPane;
