import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
var sunCalc = require('suncalc');

function App() {
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [isCorrectFormat, setIsCorrectFormat] = useState(true);
  const [isMissingFields, setIsMissingFields] = useState(true);

  let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
  const onSubmit = () => {
   
  }

  const validateInformation = () => {
    if (longitude === '' || latitude === '') {
      setIsMissingFields(true);
      return;
    }
    else {
      setIsMissingFields(false);

      if (pattern.test(longitude) && pattern.test(latitude)) {
        // api call
        setIsCorrectFormat(true);

      } else {
        setIsCorrectFormat(false);
      }
      return;
    }
  }

  useEffect(() => {
    validateInformation();
  }, [latitude, longitude]);

  return (
    <div className='App'>
        <form className='App_form'>
          <TextField 
            id="latitude" 
            label={"Latitude"}
            variant="outlined"
            onChange={(e) => setLatitude(e.target.value)}
          />
          <br/>
          <TextField 
            id="longitude" 
            label={"Longitude"}
            variant="outlined"
            onChange={(e) => setLongitude(e.target.value)}
          />
          {isMissingFields ? (<FormLabel 
            id="missing-field"
            color='warning'
            >Latitude and/or Longitude information is missing *</FormLabel>):<></>}
          {!isCorrectFormat ? (<FormLabel 
            id="incorrect-format-warning"
            color='warning'
            >Latitude and/or Longitude is not in correct form *</FormLabel>):<></>}
          <button
            id="find-location"
            onClick={onSubmit}>
              Find Location
          </button>
        </form>

        <div className='App__DistanceButtons'>
          <button
            id="north-pole-distance-btn">
              Distance to North Pole
          </button>

          <button
            id="calc-distance-to-moon-manual">
              Distance to Moon
          </button>

          <button
            id="calc-distance-to-moon-manual">
              Calculate Distance to Moon (Automatically)
          </button>
        </div>
        
        <div className='App_Information'>
          {/* display information */}
          <div className='App_InformationLabels'>
            <InputLabel>Latitude:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="auto-latitude">{latitude}</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Longitude:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="auto-longitude">{longitude}</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Location:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="city">Amsterdam</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Distance to North Pole:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="north-pole-distance">3</InputLabel>
            <InputLabel>&nbsp;miles</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Distance to Moon:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="distance-to-moon">33</InputLabel>
            <InputLabel>&nbsp;miles</InputLabel>
          </div>
        </div>
    </div>
  );
}

export default App;
