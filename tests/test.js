const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

function extractUserNamePassword(text) {
  const passwordIndex = text.search("Password");
  const usernameString = text.substring("Username :".length, passwordIndex - 1);
  const passwordString = text.substring(passwordIndex + "Password :".length);

  return [usernameString, passwordString];
}

async function example() {
  //To wait for browser to build and launch properly
  let driver = await new Builder().forBrowser("chrome").build();

  //To fetch website
  await driver.get(
    "http://www.way2automation.com/angularjs-protractor/registeration/#/login"
  );
  

  //recursive function to refresh the page if any web element is not loaded
  async function executeProcess() {
    try {
      //getting username and password text
      const text = await driver.findElement(By.className("alert")).getText();

      //extracting username and password from text
      const [usernameString, passwordString] = extractUserNamePassword(text);

      //fill username input 1
      await driver.findElement(By.name("username")).sendKeys(usernameString);

      //fill password input
      await driver.findElement(By.name("password")).sendKeys(passwordString);

      //fill username input 2
      await driver
        .findElement(By.name("formly_1_input_username_0"))
        .sendKeys(usernameString);

      //click the button
      await driver.findElement(By.className("btn")).click();
    } catch (error) {
      await driver.navigate().refresh();
      await executeProcess();
    }
  }

  await executeProcess();

  //exiting browser after 5 seconds
  setTimeout(async () => {
    await driver.quit();
  }, 5000);
}

example();
