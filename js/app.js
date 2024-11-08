function changeElement(id) {
  let oldText = document.getElementById(id);
  let newText = prompt("What would you like to change the description to?");
  if (newText === "" || newText === null) {
    newText = oldText.innerText
  }
  document.getElementById(id).innerHTML = newText;
}

let buttonIds = [1];
let headerIds = [1];
let lockIds = [1];
let IdNum;
let buttonNewId;
let headerNewId;
let lockNewId;
let length;
let divNewId;

function add() {
  length = buttonIds.length - 1;
  IdNum = buttonIds[length] + 1;
  buttonIds.push(IdNum);
  headerIds.push(IdNum);
  lockIds.push(IdNum);
  buttonNewId = "button" + IdNum;
  headerNewId = "header" + IdNum;
  lockNewId = "lock" + IdNum;
  divNewId = "div" + IdNum;

  // create a new div element
  const newDiv = document.createElement("div");
  const newHeader = document.createElement("button");
  const newBreak = document.createElement("br")
  const newButton = document.createElement("button");
  const newLock = document.createElement("button");

  const headerContent = document.createTextNode("Header sample");
  const buttonContent = document.createTextNode("Button sample");

  newButton.appendChild(buttonContent);
  newButton.id = buttonNewId;
  newButton.type = "button";
  newButton.setAttribute("onclick", "changeElement(id)");
  newHeader.appendChild(headerContent);
  newHeader.id = headerNewId;
  newHeader.type = "button";
  newHeader.setAttribute("class", "header");
  newHeader.setAttribute("onclick", "changeElement(id)")
  newLock.id = lockNewId
  newLock.type = "button";
  newLock.setAttribute("class", "unlocked");
  newLock.setAttribute("onclick", "lock(id)")
  newDiv.id = divNewId;
  newDiv.setAttribute("onmouseover", "moveElement(id)")
  newDiv.appendChild(newHeader);
  newDiv.appendChild(newBreak);
  newDiv.appendChild(newButton);
  newDiv.appendChild(newLock);

  // add the newly created element and its content into the DOM
  document.body.appendChild(newDiv);
}

function moveElement(divId) {
  let mousePosition;
  let offset = [0, 0];
  let isDown = false;
  let div;

  div = document.getElementById(divId);

  let divLock = div.querySelector('[onclick="lock(id)"]');

  div.addEventListener('mousedown', function (e) {
    document.body.setAttribute("style", "user-select: none;");
    if (divLock.className === "locked") {
      console.log(divLock.className);
      return;
    }
    isDown = true;
    offset = [
      div.offsetLeft - e.clientX,
      div.offsetTop - e.clientY
    ];
  }, true);

  document.addEventListener('mouseup', function () {
    isDown = false;
    document.body.removeAttribute("style");
  }, true);

  document.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (isDown) {
      mousePosition = {

        x: event.clientX,
        y: event.clientY

      };
      if (mousePosition.x + offset[0] > 0) {
        div.style.left = (mousePosition.x + offset[0]) + 'px';
      } else {
        div.style.left = '0px';
      }
      if (mousePosition.y + offset[1] > 0) {
        div.style.top = (mousePosition.y + offset[1]) + 'px';
      } else {
        div.style.top = '0px';
      }
    }
  }, true);
}

function drawLine(div1, div2) {
  div1 = div1 || document.getElementById("div1");
  div2 = div2 || document.getElementById("div2");
  div1 = div1.getBoundingClientRect();
  div2 = div2.getBoundingClientRect();
  let div1x = div1.right;
  let div1y = (div1.top + div1.bottom) / 2;
  let div2x = div2.left;
  let div2y = (div2.top + div2.bottom) / 2;
  console.log(div1x, div1y, div2x, div2y);
  const newSVG = document.createElement("svg");
  // const newSVG = document.getElementById("svg");
  newSVG.setAttribute("height", "1000");
  newSVG.setAttribute("width", "1000");
  const newLine = document.createElement("line");
  newLine.setAttribute("x1", div1x.toString());
  newLine.setAttribute("y1", div1y.toString());
  newLine.setAttribute("x2", div2x.toString());
  newLine.setAttribute("y2", div2y.toString());
  newSVG.appendChild(newLine);

  document.body.appendChild(newSVG);
}

function lock(id) {
  let element = document.getElementById(id)
  if (element.className === "locked") {
    element.setAttribute("class", "unlocked")
  } else {
    element.setAttribute("class", "locked")
  }
}
