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
  const [isCorrectFormat, setIsCorrectFormat] = useState(true);
  const [isMissingFields, setIsMissingFields] = useState(true);
  const [status, setStatus] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [country, setCountry] = useState(null);
  const [distanceToNorthPole, setDistanceToNorthPole] = useState(null);
  const [distanceToMoon, setDistanceToMoon] = useState(null);

  Geocode.setApiKey(API_key);
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  function isLatitudeFormattedCorrectly(lat) {
    return isFinite(lat) && Math.abs(lat) <= 90;
  }

  function isLongitudeFormattedCorrectly(lng) {
    return isFinite(lng) && Math.abs(lng) <= 180;
  }

  const findLocationBtn = () => {
    if (!isMissingFields && isCorrectFormat) {
      console.log("lat: " + typeof(latitude) + " lat: " + latitude);
      console.log("lng: " + typeof(longitude) + " lng: " + longitude);
      Geocode.fromLatLng(latitude, longitude).then(
        (response) => {
          const address = response.results[0].formatted_address;
          setFormattedAddress(address);
          setCountry(getCountryFromFormattedAddress(address));
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
            setCountry(getCountryFromFormattedAddress(address));
          }
        )
        console.log("distance to north pole: ", _distanceToNorthPole);
        setDistanceToNorthPole(_distanceToNorthPole/1000);
        setDistanceToMoon(null);
      });
  }

  const getCountryFromFormattedAddress = (formatted_address) => {
    var value = formatted_address.split(",");
    var count = value.length;
    return value[count-1];
  }

  const getDistanteMoonFromGPS = () => {
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
            setCountry(getCountryFromFormattedAddress(address));
          }
        )
        setDistanceToMoon(Math.round(sunCalc.getMoonPosition(new Date(), position.coords.latitude, position.coords.longitude)['distance']));
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }
  }

  const getDistanceMoonFromLatLng = () => {
    if (!isMissingFields && isCorrectFormat) {
      setDistanceToMoon(Math.round(sunCalc.getMoonPosition(new Date(), latitude, longitude)['distance']));
    }
  }

  const verifyInformation = () => {
    if (longitude === '' || latitude === '') {
      setIsMissingFields(true);
      return;
    }
    else {
      setIsMissingFields(false);

      if (isLatitudeFormattedCorrectly(latitude) && isLongitudeFormattedCorrectly(longitude)) {
        // api call
        setIsCorrectFormat(true);

      } else {
        setIsCorrectFormat(false);
      }
      return;
    }
  }

  useEffect(() => {
    verifyInformation();
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
            error={true}
            >Latitude and/or Longitude information is missing *</FormLabel>):<></>}
          {!isCorrectFormat ? (<FormLabel 
            id="incorrect-format-warning"
            color='warning'
            error={true}
            >Latitude and/or Longitude is not in correct form *</FormLabel>):<></>}
        </form>          
        <div className='App__DistanceButtons'>
          <button
            id="find-location"
            onClick={findLocationBtn}>
              Find Location
          </button>
          <button
            id="calc-distance-to-moon-manual"
            onClick={getDistanceMoonFromLatLng}>
              Distance to Moon
          </button>
          <button
            id="north-pole-distance-btn"
            onClick={calculateDistanceToNorthPole}>
              Distance to North Pole <br/>(From GPS)
          </button>
          <button
            id="calc-distance-to-moon-auto"
            onClick={getDistanteMoonFromGPS}>
              Calculate Distance to Moon &nbsp;(From GPS)
          </button>
        </div>
        
        <div className='App_Information'>
          {/* display information */}
          <div className='App_InformationLabels'>
            <InputLabel>Latitude:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="auto-latitude"
                        value={latitude}>{latitude}</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Longitude:&nbsp;&nbsp;</InputLabel>
            <InputLabel id="auto-longitude"
                        value={longitude}>{longitude}</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <FormLabel
              color='primary'
              >Location:&nbsp;&nbsp;</FormLabel>
            <FormLabel 
                id="city"
                color='primary'
                value={formattedAddress}
              >{formattedAddress}</FormLabel>
          </div>
          <div className='App_InformationLabels'>
            <FormLabel
              color='primary'
              >Country:&nbsp;&nbsp;</FormLabel>
            <FormLabel 
              id="country"
              color='primary'
              value={country}
            >{country}</FormLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Distance to North Pole:&nbsp;&nbsp;</InputLabel>
            <InputLabel 
              id="north-pole-distance"
              value={distanceToNorthPole}>{distanceToNorthPole}</InputLabel>
            <InputLabel>&nbsp;km</InputLabel>
          </div>
          <div className='App_InformationLabels'>
            <InputLabel>Distance to Moon:&nbsp;&nbsp;</InputLabel>
            <InputLabel 
              id="distance-to-moon"
              value={distanceToMoon}
              >{distanceToMoon}</InputLabel>
            <InputLabel>&nbsp;km</InputLabel>
          </div>
        </div>
    </div>
  );
}

export default App;
