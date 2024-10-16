import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "The Influencer Program";
document.title = gameName;

//header
const header = document.createElement("h1");
header.innerHTML = gameName;
header.style.color = "#FACADE";
app.append(header);

//Adding button that will be doing the incrementing
const button = document.createElement("button");
button.innerText = "▶️";
button.style.backgroundColor = "red";
app.append(button);

//Adding counter
let viewCounter: number = 0;
const viewDisplay = document.createElement("div");  //Text display
app.append(viewDisplay);
viewDisplay.innerHTML = "VIEWS: " + viewCounter;
button.addEventListener('click', () => {  //increment counter and update text on click
  viewCounter++;
  update();
})

//Adding passive incrementing
let passiveCounter: number = 1;
setInterval(() => {
  viewCounter += passiveCounter;
  update();
}, 1000);

function update() :void{
  viewDisplay.innerHTML = "VIEWS: " + viewCounter;
}