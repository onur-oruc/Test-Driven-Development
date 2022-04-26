const { Builder, By, Key, util } = require("selenium-webdriver");
const assert = require("assert");
var sunCalc = require('suncalc');
const { Navigator } = require('node-navigator');
const navigator = new Navigator();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyFields(driver) {
    await driver.get("http://localhost:3000/");
    // missing longitude or latitude

    //boths are missing
    let missingWarning;
    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    let longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    let latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    await driver.findElement(By.id("find-location")).click();
    await driver.findElement(By.id('missing-field')).then(function(webElement) {
        missingWarning = true;
    }, function(err) {
        if (err.state && err.state === 'no such element') {
            missingWarning = false;
        }
    });
    try {
        assert.strictEqual(longitude.toString(), "");
        assert.strictEqual(latitude.toString(), "");
        assert.strictEqual(missingWarning, true);
        console.log("Test case for missing field warning passed");
    } catch(error) {
        console.log("Error: ", error);
    }

    // incorrect longitude and latitude format
    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("abc");
    await driver.findElement(By.id("latitude")).sendKeys("14%2^~.");
    let incorrectFormat;
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    await driver.findElement(By.id("find-location")).click();
    await driver.findElement(By.id('incorrect-format')).then(function(err) {  
    }, function(err) {
        incorrectFormat = true;
        if (err.state && err.state === 'no such element') {
            incorrectFormat = false;
        }
        try {
            assert(incorrectFormat);
            console.log("Test case for incorrect format warning passed");
        } catch(error) {
            console.log("Error: ", error);
        }
    });

    // -90 to 90 for latitude and -180 to 180 for longitude.
    // correct longitude latitude
    const correctFormattedLatLng = [
        {
            latitude: 52.370216,
            longitude: 4.895168,
            country: 'Netherlands'
        },
        {
            latitude: 45.440845,
            longitude: 12.315515,
            country: 'Italy'
        },
        {  
            latitude: 51.507351,
            longitude: -0.127758,
            country: 'UK'
        },
        {   
            latitude: -35.280937,
            longitude: 149.130005,
            country: 'Australia'
        },
        {
            latitude: -34.603683,
            longitude: -58.381557,
            country: 'Argentina'
        }
    ]
    let isCorrectFormatTestsPassed = true;
    for(let i = 0; i < correctFormattedLatLng.length; i++) {
        lon = correctFormattedLatLng[i].longitude;
        lat = correctFormattedLatLng[i].latitude 
        await driver.findElement(By.id("longitude")).clear();
        await driver.findElement(By.id("latitude")).clear();       
        await driver.findElement(By.id("longitude")).sendKeys(lon);
        await driver.findElement(By.id("latitude")).sendKeys(lat);
        longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
        latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
        await driver.findElement(By.id("find-location")).click();
        try {
            assert.strictEqual(longitude <= 180 && longitude >=-180, true);
            assert.strictEqual(latitude <= 90 && latitude >=-90, true);
        } catch(error) {
            isCorrectFormatTestsPassed = false;
            console.log("Error: ", error);
        }
    }
    if (isCorrectFormatTestsPassed) {
        console.log("Test case for correct formatted inputs passed");
    } else {
        console.log("Test case for correct formatted inputs failed");
    }

    // correct range of longitude, incorrect range of latitude
    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("39.411991445");
    await driver.findElement(By.id("latitude")).sendKeys("-190");
    await driver.findElement(By.id("find-location")).click();
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, false);
        console.log("Test case for out of range latitude (negative) passed");
    } catch(error) {
        console.log("Error: ", error);
        console.log("Test case for out of range latitude (negative) failed");
    }

    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("39.411991445");
    await driver.findElement(By.id("latitude")).sendKeys("190");
    await driver.findElement(By.id("find-location")).click();
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, false);
        console.log("Test case for out of range latitude (positive) passed");
    } catch(error) {
        console.log("Error: ", error);
        console.log("Test case for out of range latitude (positive) failed");
    }


    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("100.411991445");
    await driver.findElement(By.id("latitude")).sendKeys("85.000000");
    await driver.findElement(By.id("find-location")).click();
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, false);
        console.log("Test case for out of range latitude (positive) passed");
    } catch(error) {
        console.log("Error: ", error);
        console.log("Test case for out of range latitude (positive) failed");
    }

    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("-100.411991445");
    await driver.findElement(By.id("latitude")).sendKeys("85.000000");
    await driver.findElement(By.id("find-location")).click();
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, false);
        console.log("Test case for out of range latitude (positive) passed");
    } catch(error) {
        console.log("Error: ", error);
        console.log("Test case for out of range latitude (positive) failed");
    }

    // incorrect range of longitude correct range of latitude
    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("-190");
    await driver.findElement(By.id("latitude")).sendKeys("38.65886925");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    await driver.findElement(By.id("find-location")).click();
    try {
        assert.strictEqual((longitude <= 180) && (longitude >=-180), false);
        assert((latitude <= 90) && (latitude >=-90));
        console.log("Test case for out of range longitude (negative) passed");
    } catch(error) {
        console.log("Error: ", error);
        console.log("Test case for out of range longitude (negative) failed");
    }

    // incorrect range of longitude and latitude
    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("-200");
    await driver.findElement(By.id("latitude")).sendKeys("-200");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    await driver.findElement(By.id("find-location")).click();
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, false);
        assert.strictEqual(latitude <= 90 && latitude >=-90, false);
        console.log("Test case for out of range latitude and longitude passed");
    } catch(error) {
        console.log("Error: ", error);
        console.log("Test case for out of range latitude and longitude failed");
    }
    
    // correct longitude and correct latitude
    let isCorrectCountry = true;
    for(let i = 0; i < correctFormattedLatLng.length; i++) {
        await driver.findElement(By.id("longitude")).clear();
        await driver.findElement(By.id("latitude")).clear();
        await driver.findElement(By.id("latitude")).sendKeys(correctFormattedLatLng[i].latitude);
        await driver.findElement(By.id("longitude")).sendKeys(correctFormattedLatLng[i].longitude);
        await driver.findElement(By.id("find-location")).click();

        driver.findElement(By.id('country')).getText().then(function(country) {
            try {
                assert.strictEqual(country, correctFormattedLatLng[i].country);
            } catch(error) {
                console.log("Error: ", error);
                isCorrectCountry = false;
                console.log("Test case for country: " + correctFormattedLatLng[i].country + " failed"); 
            }
        });
    }
    if (isCorrectCountry) {
        console.log("Test case for country passed");
    }
}


async function verifyAutoLocationAndDistanceToTerrestrialNorthPole(driver) {
    await driver.get("http://localhost:3000/");

    let test_case2_success=true;
    let lon;
    let lat;
    let expectedDistance
    let northPoleDistance
    await driver.findElement(By.id("north-pole-distance-btn")).click()

    northPoleDistance = await driver.findElement(By.id('north-pole-distance')).getText().then((response) => {
        console.log("response: " , response);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                lon = position.longitude;
                lat = position.latitude;
                expectedDistance = (90-lat)*111
                try {
                    assert((Math.abs(expectedDistance-response)/expectedDistance)<=1);
                } catch(error) {
                    console.log("Error: ", error);
                    test_case2_success=false;
                }
                if (test_case2_success) {
                    console.log("Test case 2 passed");
                } else {
                    console.log("Test case 2 failed");
                }
            });
        }
    })
}


async function verifyMoonDistance(driver) {   
    await driver.get("http://localhost:3000/");
    
    const locationsAndMoonDistances = [
        {
            latitude: 52.370216,
            longitude: 4.895168,
            realDistance: sunCalc.getMoonPosition(new Date(), 52.370216, 4.895168)['distance']
        },
        {
            latitude: 45.440845,
            longitude: 12.315515,
            realDistance: sunCalc.getMoonPosition(new Date(), 45.440845, 12.315515)['distance']
        },
        {  
            latitude: 51.507351,
            longitude: -0.127758,
            realDistance: sunCalc.getMoonPosition(new Date(), 51.507351, -0.127758)['distance']
        },
        {   
            latitude: -35.280937,
            longitude: 149.130005,
            realDistance: sunCalc.getMoonPosition(new Date(), -35.280937, 149.130005)['distance']
        },
        {
            latitude: -34.603683,
            longitude: -58.381557,
            realDistance: sunCalc.getMoonPosition(new Date(), -34.603683, -58.381557)['distance']
        }
    ]

    let distanceToMoon;
    let lon;
    let lat;
    // manual location

    for(let i = 0; i < locationsAndMoonDistances.length; i++) {
        lon = locationsAndMoonDistances[i].longitude;
        lat = locationsAndMoonDistances[i].latitude 
        await driver.findElement(By.id("longitude")).clear();
        await driver.findElement(By.id("latitude")).clear();       
        await driver.findElement(By.id("longitude")).sendKeys(lon);
        await driver.findElement(By.id("latitude")).sendKeys(lat);
        await driver.findElement(By.id("calc-distance-to-moon-manual")).click();
        distanceToMoon = await driver.findElement(By.id('distance-to-moon')).getAttribute("value");
        try {
            assert.strictEqual(distanceToMoon, Math.round(locationsAndMoonDistances[i].realDistance).toString());
            console.log("Test with custom location is passed")
        } catch(error) {
            console.log("Error: ", error);
            console.log("Error: ", "Manuel: Calculated distance to moon does not match real distance to moon");
        }
    }

    // auto location
    driver.findElement(By.id("calc-distance-to-moon-auto")).click();
    let longitude = await driver.findElement(By.id('auto-longitude')).getAttribute("value");
    let latitude = await driver.findElement(By.id('auto-latitude')).getAttribute("value");
    distanceToMoon = await driver.findElement(By.id('distance-to-moon')).getAttribute("value");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
        });
    }
    try {
        assert.strictEqual(distanceToMoon, Math.round(sunCalc.getMoonPosition(new Date(), lon, lat)['distance']).toString());
    } catch(error) {
        console.log("Error: ", error);
        console.log("Error: ", "Auto: Calculated distance to moon does not match real distance to moon");
    }
}

async function main() {
    let chrome = await new Builder().forBrowser("chrome").build();
    await verifyFields(chrome);
    await verifyAutoLocationAndDistanceToTerrestrialNorthPole(chrome);
    await verifyMoonDistance(chrome);

    await chrome.quit();
}

main()