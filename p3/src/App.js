import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Geocode from 'react-geocode';
var sunCalc = require('suncalc');
const geolib = require('geolib');
var API_key='AIzaSyD-_iRPdJV5WRTyf2EDbyc-vfbuFTr05W4';

// https://www.npmjs.com/package/react-geocode
// https://javascript.plainenglish.io/how-to-use-the-geolocation-api-in-your-react-app-54e87c9c6c94

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState(null);
  const [isCorrectFormat, setIsCorrectFormat] = useState(true);
  const [isMissingFields, setIsMissingFields] = useState(true);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [country, setCountry] = useState(null);
  const [distanceToNorthPole, setDistanceToNorthPole] = useState(null);
  const [distanceToMoon, setDistanceToMoon] = useState(null);

  Geocode.setApiKey(API_key);
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  let pattern = new RegExp('^-?([1-8]?[0-9]|[1-9]0)\\.{1}\\d{1,6}'); // fix this!!!
  function isLatitude(lat) {
    return isFinite(lat) && Math.abs(lat) <= 90;
  }

  function isLongitude(lng) {
    return isFinite(lng) && Math.abs(lng) <= 180;
  }

  const findLocationBtn = () => {
    if (!isMissingFields && isCorrectFormat) {
      console.log("lat: " + typeof(latitude) + " lat: " + latitude);
      console.log("lng: " + typeof(longitude) + " lng: " + longitude);
      Geocode.fromLatLng(latitude, longitude).then(
        (response) => {
          console.dir(response);
          const address = response.results[0].formatted_address;
          setFormattedAddress(address);
          console.log("address: ", address);
          var add = response.results[0].formatted_address;
          var value = add.split(",");
          var count = value.length;
          setCountry(value[count-1]);
        }
      )
    }
  }

  const calculateDistanceToNorthPole = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        const _distanceToNorthPole = geolib.getDistance(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }, 
          {
            latitude: 90.0000000,
            longitude: 0.0000000,
          }
        );
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          (response) => {
            const address = response.results[0].formatted_address;
            setFormattedAddress(address);
            console.log("address: ", address);
            var add = response.results[0].formatted_address;
            var value = add.split(",");
            var count = value.length;
            setCountry(value[count-1]);
          }
        )
        console.log("distance to north pole: ", _distanceToNorthPole);
        setDistanceToNorthPole(_distanceToNorthPole/1000);
        setDistanceToMoon(null);
      });
  }

  const getDistanteMoonAuto = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        setStatus(null);
        console.log(position);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          (response) => {
            const address = response.results[0].formatted_address;
            setFormattedAddress(address);
            console.log("address: ", address);
            var add = response.results[0].formatted_address;
            var value = add.split(",");
            var count = value.length;
            setCountry(value[count-1]);
          }
        )
        setDistanceToMoon(Math.round(sunCalc.getMoonPosition(new Date(), position.coords.latitude, position.coords.longitude)['distance']));
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }
  }

  const getDistanceMoonCustom = () => {
    if (!isMissingFields && isCorrectFormat) {
      setDistanceToMoon(Math.round(sunCalc.getMoonPosition(new Date(), latitude, longitude)['distance']));
    }
  }

  const validateInformation = () => {
    if (longitude === '' || latitude === '') {
      setIsMissingFields(true);
      return;
    }
    else {
      setIsMissingFields(false);

      if (isLatitude(latitude) && isLongitude(longitude)) {
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
        </form>
        <button
          id="find-location"
          onClick={findLocationBtn}>
            Find Location
        </button>
          
        <div className='App__DistanceButtons'>
          <button
            id="north-pole-distance-btn"
            onClick={calculateDistanceToNorthPole}>
              Distance to North Pole
          </button>

          <button
            id="calc-distance-to-moon-manual"
            onClick={getDistanceMoonCustom}>
              Distance to Moon
          </button>

          <button
            id="calc-distance-to-moon-auto"
            onClick={getDistanteMoonAuto}>
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
            <FormLabel
              color='primary'
              >Location:&nbsp;&nbsp;</FormLabel>
            <FormLabel 
                id="city"
                color='primary'
              >{formattedAddress}</FormLabel>
            {/* <InputLabel>Location:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="city">{formattedAddress}</InputLabel> */}
          </div>
          <div className='App_InformationLabels'>
            <FormLabel
              color='primary'
              >Country:&nbsp;&nbsp;</FormLabel>
            <FormLabel 
              id="country"
              color='primary'
            >{country}</FormLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Distance to North Pole:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="north-pole-distance">{distanceToNorthPole}</InputLabel>
            <InputLabel>&nbsp;km</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Distance to Moon:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="distance-to-moon">{distanceToMoon}</InputLabel>
            <InputLabel>&nbsp;km</InputLabel>
          </div>
        </div>
    </div>
  );
}

export default App;
