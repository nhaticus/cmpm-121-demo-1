import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

/* GLOBAL VARIABLES */
let viewsCount: number;
let counterGrowthRate: number;
let viewsDisplay: HTMLDivElement;
let passiveGrowthDisplay: HTMLDivElement;
let helperText: HTMLDivElement;
//Use for updating increments every frame also for anything that needs to be updated each frame
let lastTimeStamp: number;

/* FOR SHAKY TEXT */
let angle = 0;
let rotation = 1;
const speed = 5; // Degrees/angle of shake per frame
const maxAngle = 10; // Maximum angle for shaking in degrees

/* HELPER FUNCTIONS */

// Creates a text using the paramater and return a text block element
function addText(text: string): HTMLDivElement {
  const textBox = document.createElement("div");
  textBox.style.color = gameConfig.styles.headerColor;
  textBox.innerText = text;
  app.append(textBox);
  return textBox;
}

//Adding button that will be doing the incrementing
function createIncermentalButton(text: string, config: GameConfig) {
  const tmpButton = document.createElement("button");
  tmpButton.innerText = text;
  tmpButton.style.backgroundColor = config.styles.buttonColor;
  app.append(tmpButton);

  tmpButton.addEventListener("click", incrementalButtonHandler);
}

function incrementalButtonHandler() {
  //Implementing clicking increment by 1
  incrementViewsCount(1);
}

function incrementViewsCount(x: number): void {
  viewsCount += x;
  viewsDisplay.innerText = `\nVIEWS: ${viewsCount.toFixed(2)}\n`;
  updateButtons(); // Check if upgrades is available when number grows
}

function incrementRates(x: number): void {
  counterGrowthRate += x;
  passiveGrowthDisplay.innerText = `VIEWS/SEC: ${counterGrowthRate.toFixed(2)}\n\n`;
}

function updateGame(timeStamp: number): void {
  if (lastTimeStamp === 0) {
    lastTimeStamp = timeStamp;
  }
  const timeElapsed = timeStamp - lastTimeStamp; //Time since last frame
  const tmp = counterGrowthRate * (timeElapsed / 1000);
  incrementViewsCount(tmp);
  lastTimeStamp = timeStamp;

  requestAnimationFrame(updateGame); //Loop
}

/*  UPGRADE HANDLING FUNCTIONS  */
// Function to create buttons for each upgrade
function createUpgradeButtons(config: GameConfig) {
  const appDiv = document.getElementById("app");

  if (appDiv) {
    config.upgrades.forEach((upgrade, index) => {
      // Create a container div for each upgrade
      const upgradeContainer = document.createElement("div");

      // Create a button for each upgrade
      const button = document.createElement("button");
      button.innerText = `${upgrade.level} ${upgrade.name} - Cost: ${upgrade.cost}`;
      button.id = `upgrade-${index}`;
      button.title = upgrade.description;

      // Add click event listener to handle button click
      button.addEventListener("click", () => {
        handleUpgrade(upgrade);
      });
      upgradeContainer.appendChild(button);

      const rateDisplay = document.createElement("p");
      rateDisplay.innerText = `${upgrade.rate} Views/sec `;
      rateDisplay.style.color = gameConfig.styles.headerColor;
      upgradeContainer.appendChild(rateDisplay);

      appDiv.appendChild(upgradeContainer);
    });
  }
}

// Function to handle click events
function handleUpgrade(upgrade: Upgrade) {
  incrementRates(upgrade.rate);
  incrementViewsCount(-upgrade.cost);
  upgrade.cost = upgrade.cost * 1.15;
  upgrade.level++;
}

// Function to disable/enable buttons runs whenever views is incremented
function updateButtons(): void {
  gameConfig.upgrades.forEach((upgrade, index) => {
    const button = document.getElementById(
      `upgrade-${index}`
    ) as HTMLButtonElement;
    if (button) {
      button.innerText = `${upgrade.level} ${upgrade.name} - Cost: ${upgrade.cost.toFixed(2)}`;
      button.disabled = viewsCount < upgrade.cost;
    }
  });
}

interface Upgrade {
  name: string;
  cost: number;
  rate: number;
  level: number;
  description: string;
}

interface GameConfig {
  name: string;
  styles: {
    headerColor: string;
    buttonColor: string;
  };

  initialState: {
    views: number;
    growthRate: number;
  };

  upgrades: Upgrade[];
}

const gameConfig: GameConfig = {
  name: "The Influencer Program",
  styles: {
    headerColor: "black",
    buttonColor: "red",
  },

  initialState: {
    views: 0,
    growthRate: 0,
  },
  upgrades: [
    {
      name: "Lurker(s)",
      cost: 10,
      rate: 0.1,
      level: 0,
      description: "WOW! an occasional viewer that watches once in a while",
    },
    {
      name: "Subscriber(s)",
      cost: 100,
      rate: 2,
      level: 0,
      description:
        "Someone finds you interesting and kept watching... that's rare",
    },
    {
      name: "Collaboration(s)",
      cost: 1000,
      rate: 50,
      level: 0,
      description:
        "A massive video collaboration with a famous STAR! look at those views!!! how did you land that",
    },
    {
      name: "Superfan(s)",
      cost: 10000,
      rate: 1250,
      level: 0,
      description:
        "Grow a cult of devoted followers that eat, sleep, watch you, and repeat",
    },
    {
      name: "Bot(s)",
      cost: 99999999.99,
      rate: 9999999999,
      level: 0,
      description: "Really bro... BOTS??? you really fell off",
    },
  ],
};

function initGame(config: GameConfig) {
  document.title = config.name;

  /*  HEADER  */
  const header = document.createElement("h1");
  header.innerHTML = config.name;
  header.style.color = config.styles.headerColor;
  app.append(header);

  /*  SETTING INITIAL VALUES */
  lastTimeStamp = 0;

  viewsCount = gameConfig.initialState.views;
  counterGrowthRate = config.initialState.growthRate;

  viewsDisplay = addText(`\nVIEWS: ${viewsCount.toFixed(2)}\n`);
  passiveGrowthDisplay = addText(
    `VIEWS/SEC: ${counterGrowthRate.toFixed(2)}\n\n`
  );

  /* SHAKY HELPER TEXT  */
  helperText = addText("CLICK FOR VIEWS");
  shakeAnimation();
  /*  CLICKER BUTTON FOR INCREMENTAL GAME */
  createIncermentalButton("▶️", gameConfig);

  /*  UPGRADE BUTTONS FOR THE GAME */
  createUpgradeButtons(config);

  /*  STARTS GAME UPDATE  */
  requestAnimationFrame(updateGame);
}

initGame(gameConfig);

/* COLOR CHANGING BACKGROUND INSPIRED BY https://scso-ucsc.github.io/Incremental-Game-Development/ */

function interpolateColor(
  startColor: number[],
  endColor: number[],
  factor: number
) {
  const result = startColor.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
  }
  return result;
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const color1 = [125, 0, 0];
const color2 = [185, 0, 0];
let factor: number = 0;
let direction: number = 1;

function animateBackground() {
  factor += direction * 0.01;
  if (factor >= 1 || factor <= 0) {
    direction *= -1;
    factor = Math.max(0, Math.min(1, factor));
  }
  const newColor = interpolateColor(color1, color2, factor);
  document.body.style.backgroundColor = rgbToHex(
    newColor[0],
    newColor[1],
    newColor[2]
  );
  requestAnimationFrame(animateBackground);
}

animateBackground();

/* SHAKY TEXT INSPIRED BY https://scso-ucsc.github.io/Incremental-Game-Development/ */
function shakeAnimation() {
  angle += rotation * (speed);

  if (angle > maxAngle || angle < -maxAngle) {
    rotation *= -1;
  }

  // Apply rotation to the element
  helperText.style.transform = `rotate(${angle}deg)`;
      requestAnimationFrame(shakeAnimation);
}
