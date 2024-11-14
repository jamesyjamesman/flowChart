let ids = [1];
let idNum;
let descriptionNewId;
let headerNewId;
let lockNewId;
let length;
let divNewId;
let divMoveNewId

function add() {
  length = ids.length - 1;
  idNum = ids[length] + 1;
  ids.push(idNum);
  descriptionNewId = "button" + idNum;
  headerNewId = "header" + idNum;
  lockNewId = "lock" + idNum;
  divNewId = "div" + idNum;
  divMoveNewId = "divMove" + idNum;

  let divMove = $(`<div class="move" onmouseover="moveElement(id)" id=${divMoveNewId}>::<br>::</div>`)
  let title = $(`<input class='header' type='text' placeholder="Title" id=${headerNewId}>`);
  let description = $(`<textarea placeholder="Description" id=${descriptionNewId}></textarea>`);
  let lock = $(`<button type='button' onclick=lock(id) class='unlocked' id=${lockNewId}></button>`);
  let div = $(`<div onmouseover=moveElement(id) id=${divNewId}></div>`);

  $(div).append(divMove, title, $("<br>"), description, lock);
  $("body").append(div);
}

function moveElement(divId) {
  let mousePosition;
  let offset = [0, 0];
  let isDown = false;
  let div;
  console.log(divId);

  div = document.getElementById(divId).parentElement;

  let divLock = div.querySelector('[onclick="lock(id)"]');

  div.addEventListener('mousedown', function (e) {
    document.body.setAttribute("style", "user-select: none;");
    //TODO: make it only run if only the div is hovered over
    if (divLock.className === "locked") {
      return;
    }
    isDown = true;
    offset = {
      left: div.offsetLeft - e.clientX,
      top: div.offsetTop - e.clientY
    };
  }, true);

  document.addEventListener('mouseup', function () {
    isDown = false;
    document.body.removeAttribute("style");
    div = null;
  }, true);

  document.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (isDown) {
      mousePosition = {

        x: event.clientX,
        y: event.clientY

      };
      if (mousePosition.x + offset.left > 0) {
        div.style.left = (mousePosition.x + offset.left) + 'px';
      } else {
        div.style.left = '0px';
      }
      if (mousePosition.y + offset.top > 0) {
        div.style.top = (mousePosition.y + offset.top) + 'px';
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
