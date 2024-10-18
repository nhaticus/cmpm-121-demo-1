import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "The Influencer Program";
document.title = gameName;

//header
const header = document.createElement("h1");
header.innerHTML = gameName;
header.style.color = "white";
app.append(header);

function addText(text: string): HTMLDivElement {
  const textBox = document.createElement("div");
  textBox.innerText = text;
  app.append(textBox);
  return textBox;
}

//Adding button that will be doing the incrementing
const button = document.createElement("button");
button.innerText = "▶️";
button.style.backgroundColor = "red";
app.append(button);
button.addEventListener("click", () => {
  //Implementing clicking increment by 1
  incrementViewsCount(1);
});

let viewsCount: number = 0; //Global counter variable
//Adding display for views
const viewsDisplay = addText(`\nVIEWS: ${viewsCount.toFixed(2)}\n`); //Text display

function incrementViewsCount(x: number): void {
  viewsCount += x;
  viewsDisplay.innerText = `\nVIEWS: ${viewsCount.toFixed(2)}\n`;
  updateButtons(); // Check if upgrades is available when number grows
}

let counterGrowthRate: number = 0; //Default value should be 0
const passiveGrowthDisplay = addText(
  `VIEWS/SEC: ${counterGrowthRate.toFixed(2)}\n\n`,
);

function incrementRates(x: number): void {
  counterGrowthRate += x;
  passiveGrowthDisplay.innerText = `VIEWS/SEC: ${counterGrowthRate.toFixed(2)}\n\n`;
}

//Use for updating increments every frame also for anything that needs to be updated each frame
let lastTimeStamp: number = 0;
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

requestAnimationFrame(updateGame); //Starts the loop to run every frame

// Creating Upgrade interface with useful properties
interface Upgrade {
  name: string;
  cost: number;
  rate: number;
  level: number;
  description: string;
}

// List of Upgrades
const upgradeList: Upgrade[] = [
  { name: "Lurker(s)", cost: 10, rate: 0.1, level: 0, description: "WOW! an occasional viewer that watches once in a while"},
  { name: "Subscriber(s)", cost: 100, rate: 2, level: 0, description: "Someone finds you interesting and kept watching... that's rare"},
  { name: "Collaboration(s)", cost: 1000, rate: 50, level: 0, description: "A massive video collaboration with a famous STAR! look at those views!!! how did you land that" },
  { name: "Superfan(s)", cost: 10000, rate: 1250,level: 0, description: "Grow a cult of devoted followers that eat, sleep, watch you, and repeat"},
  { name: "Bot(s)", cost: 99999999.99, rate: 9999999999,level: 0, description: "Really bro... BOTS??? you really fell off"}
];

// Function to create buttons for each upgrade
function createUpgradeButtons() {
  const appDiv = document.getElementById("app");

  if (appDiv) {
    upgradeList.forEach((upgrade, index) => {
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
  upgradeList.forEach((upgrade, index) => {
    const button = document.getElementById(
      `upgrade-${index}`,
    ) as HTMLButtonElement;
    if (button) {
      button.innerText = `${upgrade.level} ${upgrade.name} - Cost: ${upgrade.cost.toFixed(2)}`;
      button.disabled = viewsCount < upgrade.cost;
    }
  });
}

// Initialize buttons
createUpgradeButtons();
