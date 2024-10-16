import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "The Influencer Program";
document.title = gameName;

//header
const header = document.createElement("h1");
header.innerHTML = gameName;
header.style.color = "white";
app.append(header);

//Adding button that will be doing the incrementing
const button = document.createElement("button");
button.innerText = "▶️";
button.style.backgroundColor = "red";
app.append(button);

// Helper functions
function incrementViewsCount(x: number): void {
  viewsCount += x;
  viewsDisplay.innerText = `VIEWS: ${viewsCount.toFixed(2)}`;
}

function addText(text: string): HTMLDivElement {
  const textBox = document.createElement("div");
  textBox.innerText = text;
  app.append(textBox);
  return textBox;
}
// update fucntion
function updateGame(timeStamp: number): void {
  if (lastTimeStamp === 0) {
    lastTimeStamp = timeStamp;
  }
  const timeElapsed = timeStamp - lastTimeStamp; //Time since last frame
  const tmp = (counterGrowthRate * timeElapsed) / 1000; //Calculates the amount of frames passed in respect to
  incrementViewsCount(tmp);
  lastTimeStamp = timeStamp;

  requestAnimationFrame(updateGame); //Loop

  updateButton();
  passiveGrowthDisplay.innerText = `VIEWS PER SECOND: ${counterGrowthRate}`;
}

function updateButton(): void {
  if (viewsCount < 10) {
    upgrade1.disabled = true;
  } else {
    upgrade1.disabled = false;
  }
}

// Variables
let viewsCount: number = 0; //Global counter variable
let counterGrowthRate: number = 0; //Default value should be 0
let lastTimeStamp: number = 0; //For continuous growth

//Adding counter
const viewsDisplay = addText(`VIEWS: ${viewsCount.toFixed(2)}`); //Text display
button.addEventListener("click", () => {
  //Implementing clicking increment by 1
  incrementViewsCount(1);
});

//Adding passive incrementing
const passiveGrowthDisplay = addText(`VIEWS PER SECOND: ${counterGrowthRate}`); //auto clicking display

requestAnimationFrame(updateGame); //Starts the loop to run every frame

//Adding a buy option for auto clicking
const upgrade1 = document.createElement("button");
upgrade1.innerText = "FAN 10 VIEWS\n 0.1 VPS";
app.append(upgrade1);

upgrade1.addEventListener("click", () => {
  incrementViewsCount(-10);
  counterGrowthRate += 1;
});
