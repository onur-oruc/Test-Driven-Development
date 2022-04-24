const { Builder, By, Key, util } = require("selenium-webdriver");
const assert = require("assert");
const { accessSync } = require("fs");


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyFields(driver) {
    await driver.get("http://localhost:3000/");

    // missing longitude or latitude
    missingWarning;
    await driver.findElement(By.id("longitude")).sendKeys("");
    await driver.findElement(By.id("latitude")).sendKeys("");
    let longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    let latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    driver.findElement(driver.By.id("find-location")).click();
    driver.findElement(driver.By.id('missing-field')).then(function(webElement) {
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

    // correct longitude and latitude format
    await driver.findElement(By.id("longitude")).sendKeys("abc");
    await driver.findElement(By.id("latitude")).sendKeys("14%2^~.");
    incorrectFormat;
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    driver.findElement(driver.By.id("find-location")).click();
    driver.findElement(driver.By.id('incorrect-format')).then(function(webElement) {
        incorrectFormat = true;
    }, function(err) {
        if (err.state && err.state === 'no such element') {
            incorrectFormat = false;
        }
    });
    try {
        assert.strictEqual(incorrectFormat, true);
    } catch(error) {
        console.log("Error: ", error);
    }

    // -90 to 90 for latitude and -180 to 180 for longitude.
    // correct longitude latitude
    await driver.findElement(By.id("longitude")).sendKeys("4.896029");
    await driver.findElement(By.id("latitude")).sendKeys("52.377956");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    driver.findElement(driver.By.id("find-location")).click();
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, true);
    } catch(error) {
        console.log("Error: ", error);
    }

    // correct longitude incorrect latitude
    await driver.findElement(By.id("longitude")).sendKeys("39.411991445");
    await driver.findElement(By.id("latitude")).sendKeys("-190");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    driver.findElement(driver.By.id("find-location")).click();
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, true);
    } catch(error) {
        console.log("Error: ", error);
    }

    // incorrect longitude correct latitude
    await driver.findElement(By.id("longitude")).sendKeys("-190");
    await driver.findElement(By.id("latitude")).sendKeys("38.65886925");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    driver.findElement(driver.By.id("find-location")).click();
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, true);
    } catch(error) {
        console.log("Error: ", error);
    }

    // incorrect longitude incorrect latitude
    await driver.findElement(By.id("longitude")).sendKeys("-200");
    await driver.findElement(By.id("latitude")).sendKeys("-200");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    driver.findElement(driver.By.id("find-location")).click();
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, true);
    } catch(error) {
        console.log("Error: ", error);
    }
    
    // correct longitude and correct latitude
    await driver.findElement(By.id("longitude")).sendKeys("4.896029");
    await driver.findElement(By.id("latitude")).sendKeys("52.377956");
    longitude = await driver.findElement(By.id('longitude')).getAttribute("value");
    latitude = await driver.findElement(By.id('latitude')).getAttribute("value");
    driver.findElement(driver.By.id("find-location")).click();
    city = await driver.findElement(By.id('city')).getAttribute("value");
    try {
        assert.strictEqual(longitude <= 180 && longitude >=-180, true);
        assert.strictEqual(latitude <= 90 && latitude >=-90, true);
        assert.strictEqual(city, "Amsterdam");
    } catch(error) {
        console.log("Error: ", error);
    }
}

async function verifyAutoLocationAndDistanceToTerrestrialNorthPole(driver) {
    await driver.get("http://localhost:3000/");
    
}


async function verifyMoonDistance(driver) {   
    await driver.get("http://localhost:3000/");

}

async function main() {
    let chrome = await new Builder().forBrowser("chrome").build();
    await sleep(300);
    await verifyFields(chrome);
}

main()