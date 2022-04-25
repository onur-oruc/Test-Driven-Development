const { Builder, By, Key, util } = require("selenium-webdriver");
const assert = require("assert");
const { accessSync } = require("fs");
var sunCalc = require('suncalc');
const { Navigator } = require('node-navigator');
const { clear } = require("console");
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
        } catch(error) {
            console.log("Error: ", error);
        }
    });

    // -90 to 90 for latitude and -180 to 180 for longitude.
    // correct longitude latitude
    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("4.896029");
    await driver.findElement(By.id("latitude")).sendKeys("52.377956");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    await driver.findElement(By.id("find-location")).click();
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, true);
    } catch(error) {
        console.log("Error: ", error);
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
    } catch(error) {
        console.log("Error: ", error);
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
    } catch(error) {
        console.log("Error: ", error);
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
    } catch(error) {
        console.log("Error: ", error);
    }
    
    // correct longitude and correct latitude
    await driver.findElement(By.id("longitude")).clear();
    await driver.findElement(By.id("latitude")).clear();
    await driver.findElement(By.id("longitude")).sendKeys("4.896029");
    await driver.findElement(By.id("latitude")).sendKeys("52.377956");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    await driver.findElement(By.id("find-location")).click();
    let city = await driver.findElement(By.id('city')).getAttribute("value").then(function(err) {  
    }, function(err) {
        try {
            assert.strictEqual(longitude <= 180 && longitude >=-180, true);
            assert.strictEqual(latitude <= 90 && latitude >=-90, true);
            assert.strictEqual(city, "Amsterdam");
        } catch(error) {
            console.log("Error: ", error);
        }
    });

}

async function verifyAutoLocationAndDistanceToTerrestrialNorthPole(driver) {
    await driver.get("http://localhost:3000/");
    
    let test_case2_success=true;
    await driver.findElement(By.id("north-pole-distance")).click();
    let longitude = await driver.findElement(By.id('auto-longitude')).getAttribute("value");
    let latitude = await driver.findElement(By.id('auto-latitude')).getAttribute("value");
    let northPoleDistance = await driver.findElement(By.id('north-pole-distance')).getAttribute("value");
    let lon;
    let lat;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.longitude;
            lat = position.latitude;
        });
    }
    try {
        assert.strictEqual(longitude, lon);
        assert.strictEqual(latitude, lat);
    } catch(error) {
        console.log("Error: ", error);
        test_case2_success=false;
    }

    try {
        assert.strictEqual(northPoleDistance, "3,459.30");
    } catch(error) {
        console.log("Error: ", error);
        test_case2_success=false;
    }

    if (test_case2_success) {
        console.log("Test case 2 passed");
    } else {
        console.log("Test case 2 failed");
    }
}


async function verifyMoonDistance(driver) {   
    await driver.get("http://localhost:3000/");
    
    const locationsAndMoonDistances = [
        {
            latitude: 4.896029,
            longitude: 52.377956,
            realDistance: sunCalc.getMoonPosition(new Date(), 4.896029, 52.377956)['distance']
        },
        {
            latitude: 45.4408,
            longitude: 12.3155,
            realDistance: sunCalc.getMoonPosition(new Date(), 45.4408, 12.3155)['distance']
        },
        {  
            latitude: 36.6592,
            longitude: 29.1263,
            realDistance: sunCalc.getMoonPosition(new Date(), 36.6592, 29.1263)['distance']
        },
        {   
            latitude: 51.5072,
            longitude: 0.1276,
            realDistance: sunCalc.getMoonPosition(new Date(), 51.5072, 0.1276)['distance']
        },
        {
            latitude: 50.4501,
            longitude: 30.5234,
            realDistance: sunCalc.getMoonPosition(new Date(), 50.4501, 30.5234)['distance']
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
            assert.strictEqual(distanceToMoon, locationsAndMoonDistances[i].realDistance);
            console.log("test is passed")
        } catch(error) {
            console.log("Error: ", error);
            console.log("Error: ", "Manuel: Calculated distance to moon does not match real distance to moon");
        }
    }
    
    await sleep(5000)

    // auto location
    // driver.findElement(By.id("calc-distance-to-moon-auto")).click();
    // let longitude = await driver.findElement(By.id('auto-longitude')).getAttribute("value");
    // let latitude = await driver.findElement(By.id('auto-latitude')).getAttribute("value");
    // distanceToMoon = await driver.findElement(By.id('distance-to-moon')).getAttribute("value");
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //         lon = position.coords.longitude;
    //         lat = position.coords.latitude;
    //     });
    // }
    // try {
    //     assert.strictEqual(longitude, lon);
    //     assert.strictEqual(latitude, lat);
    // } catch(error) {
    //     console.log("Error: ", error);
    //     console.log("Error: ", "Displayed longitude and latitude do not match real values");
    // }
    // try {
    //     assert.Equal(distanceToMoon, sunCalc.getMoonPosition(new Date(), lon, lat)['distance']);
    // } catch(error) {
    //     console.log("Error: ", error);
    //     console.log("Error: ", "Auto: Calculated distance to moon does not match real distance to moon");
    // }
    // driver.findElement(By.id("calc-distance-to-moon-auto")).click();
}

async function main() {
    let chrome = await new Builder().forBrowser("chrome").build();
    await verifyFields(chrome);
    //await verifyAutoLocationAndDistanceToTerrestrialNorthPole(chrome);
    //await verifyMoonDistance(chrome);
    // let lon;
    // let lat;
    
    // navigator.geolocation.getCurrentPosition((position) => {
    //     lon = position.longitude;
    //     lat = position.latitude;
    //     console.log("latitude: ", lat);
    //     console.log("longitude: ", lon);
    //     console.log("distance: " + sunCalc.getMoonPosition(new Date(), lat,  lon).distance);
        
    // });

    await chrome.quit();
}

main()