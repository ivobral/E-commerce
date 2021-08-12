import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = value =>
  emailRegex.test(value) ? "" : "Please enter a valid email.";

const AddressForm = ({ checkoutToken, test }) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    email: "",
    city: "",
    zip: ""
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }; 

  const handleFormSubmit = (event) => {
    event.preventDefault();
    //console.log(values);
    test({ values, shippingCountry, shippingSubdivision, shippingOption });
  };

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>Shipping address</Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="firstName" 
                label="First name" 
                required 
                value={values.firstName}
                onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="lastName" 
                label="Last name" 
                required 
                value={values.lastName}
                onChange={handleChange} 
                />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="address1" 
                label="Address" 
                required 
                value={values.address1}
                onChange={handleChange} 
                />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                type="email" 
                name="email" 
                label="Email" 
                required 
                validator={emailValidator} 
                vlaue={values.email} 
                onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="city" 
                label="City" 
                required 
                value={values.city}
                onChange={handleChange} 
                />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="zip" 
                label="Zip / Postal code" 
                required 
                value={values.zip}
                onChange={handleChange}                
                />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Country</InputLabel>
            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
              {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Subdivision</InputLabel>
            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
              {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Options</InputLabel>
            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
              {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            </Grid>

          </Grid>

          <br />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
            <Button type="submit" variant="contained" color="primary">Next</Button>
          </div>
          
        </form>
    </>
  );
};

export default AddressForm;
