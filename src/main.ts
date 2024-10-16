import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "The Influencer Program";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
header.style.color = "#FACADE";
app.append(header);

const button = document.createElement("button");
button.innerText = "▶️";
button.style.backgroundColor = "red"
app.append(button)
