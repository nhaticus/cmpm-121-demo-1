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

//Adding counter
let viewsCount: number = 0;
const viewsDisplay = document.createElement("div"); //Text display
app.append(viewsDisplay);
viewsDisplay.innerHTML = "VIEWS: " + viewsCount;
button.addEventListener("click", () => {
  //increment counter and update text on click
  incrementViewsCount(1);
});

// Helper function to increase the views count along with updating the text
function incrementViewsCount(x: number): void {
  viewsCount += x;
  viewsDisplay.innerHTML = `VIEWS: ${viewsCount.toFixed(1)}`;
}

//Adding passive incrementing
const counterGrowthRate: number = 1;

let lastTimeStamp: number = 0;
function continuousGrowth(timeStamp: number): void {
  if (lastTimeStamp === 0) {
    lastTimeStamp = timeStamp;
  }
  const timeElapsed = timeStamp - lastTimeStamp;  //Time since last frame
  const tmp = counterGrowthRate * timeElapsed / 1000; // tmp essentially equals to 1 / frame per sec
  incrementViewsCount(tmp);
  lastTimeStamp = timeStamp;
  

  requestAnimationFrame(continuousGrowth);  //Loop
}
requestAnimationFrame(continuousGrowth);  //Start the animation loop

