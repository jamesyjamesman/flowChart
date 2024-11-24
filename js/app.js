let divPairs = [[],[],[]];
let connecting = false;
let mouseX, mouseY;
let makingLine = false;
document.addEventListener("mousemove", function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("keydown", function(e) {
    if (document.activeElement.className === "header") {
      if (document.activeElement.value.length === 0) {
        document.activeElement.style.width = '28px';
      } else {
        if (e.key === "Backspace") {
          document.activeElement.style.width = document.activeElement.value.length * 28 - 28 + 'px';
        } else if (e.key.length !== 1) {
          document.activeElement.style.width = document.activeElement.value.length * 28 + 'px'; //27 is slightly not enough, 28 is too much
        } else {
          document.activeElement.style.width = document.activeElement.value.length * 28 + 28 + 'px';
        }
      }
  } else if (document.activeElement.nodeName === "TEXTAREA") {
  } else if (e.key === "n") {
    add(true);
  } else if (e.key === "l" && !makingLine) {
    connections();
  } else if (e.key === "Backspace" || e.key === "Delete") {
    let pastElement = findParentFromMouse();
    if (pastElement) {
      pastElement.remove();
    }
    }
})

function findParentFromMouse() {
  let element = document.elementFromPoint(mouseX, mouseY);
  if (element.nodeName !== "HTML" && element.nodeName !== "BODY") {
    while (element.className !== "parentDiv") {
      element = element.parentElement;
    }
  } else {
    element = null;
  }
  return element;
}

let ids = [1];

function add(placeAtCursor) {
  let idNum;
  let descriptionNewId;
  let headerNewId;
  let length;
  let divNewId;
  let divMoveNewId

  length = ids.length - 1;
  idNum = ids[length] + 1;
  ids.push(idNum);

  descriptionNewId = "button" + idNum;
  headerNewId = "header" + idNum;
  divNewId = "div" + idNum;
  divMoveNewId = "divMove" + idNum;

  let divMove = $(`<div class="move" onmouseover="moveElement(id)" id=${divMoveNewId}>::<br>::</div>`)
  let title = $(`<input class='header' type='text' placeholder="Title" id=${headerNewId}>`);
  let description = $(`<textarea placeholder="Description" id=${descriptionNewId}></textarea>`);
  let div = $(`<div id=${divNewId} class="parentDiv"></div>`);

  $(div).append(divMove, title, $("<br>"), description);
  $("body").append(div);
  if (placeAtCursor) {
        let divId = document.getElementById(divNewId);
        divId.setAttribute("style", `left: ${mouseX + 'px'}; top: ${mouseY + 'px'}`)
  }
}

function moveElement(divId) {
  let mousePosition;
  let offset = [0, 0];
  let isDown = false;
  let div;
  let divMove;

  divMove = document.getElementById(divId);
  div = divMove.parentElement;

  divMove.addEventListener('mousedown', function (e) {
    if (connecting) {return}
    console.log("mousedown!")
    document.body.setAttribute("style", "user-select: none;");
    isDown = true;
    offset = {
      left: div.offsetLeft - e.clientX,
      top: div.offsetTop - e.clientY
    };
  }, true);

  divMove.addEventListener('mouseup', function () {
    isDown = false;
    document.body.removeAttribute("style");
    changeBorders(div);
  }, true);

  document.addEventListener('mousemove', function (event) {
    if (connecting) {return}
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
function changeBorders(div) {
  if (divPairs[0][0]) {
    let indexNum = divPairs[0].indexOf(div.id);
    let i = 0;
    console.log(indexNum, i, divPairs[2][0])
    while (i <= divPairs[1][indexNum].length - 1) {
      divBox(document.getElementById(divPairs[0][indexNum]), document.getElementById(divPairs[1][indexNum][i]));
      document.getElementById(divPairs[2][indexNum]).remove();
      divPairs[2].shift();
      i++;
    }
  }
}
let boxIds = [0];

function divBox(div1, div2) {
  if (div2.getBoundingClientRect().top < div1.getBoundingClientRect().top) {
    let temp = div1;
    div1 = div2;
    div2 = temp;
  }
  let div1Element = div1;
  let div2Element = div2;
  div1 = div1.getBoundingClientRect();
  div2 = div2.getBoundingClientRect();

  let div1Coords = [[div1.left, div1.top], [div1.right, div1.bottom]]
  let div2Coords = [[div2.left, div2.top], [div2.right, div2.bottom]]
  let newDivCoords = [[(div1Coords[0][0] + div1Coords[1][0])/2, (div1Coords[0][1] + div1Coords[1][1])/2], [(div2Coords[0][0] + div2Coords[1][0])/2, (div2Coords[0][1] + div2Coords[1][1])/2]]

  let left = newDivCoords[0][0];
  let top = newDivCoords[0][1];
  let width = newDivCoords[1][0] - newDivCoords[0][0];
  let height = newDivCoords[1][1] - newDivCoords[0][1];
  let styleLeft = false;
  let leftOnly = false;
  let topOnly = false;

  if (newDivCoords[0][0] < div2.right && newDivCoords[0][0] > div2.left) {
    leftOnly = true;
    left = (2*left + width) / 2;
    width = 1;
  }

  if (newDivCoords[0][1] > div2.top && newDivCoords[0][1] < div2.bottom) {
    topOnly = true;
    top = (2*top + height) / 2;
    height = 1;
  }

  //If statements effectively rearrange based on which div is topmost and leftmost (cannot have negative widths or lengths)
  if (width < 0) {
    left += width;
    width = Math.abs(width)
    styleLeft = true;
  }
  if (height < 0) {
    top += height;
    height = Math.abs(height);
  }

  let arrayLength = boxIds.length - 1;
  let idNum = boxIds[arrayLength] + 1;
  boxIds.push(idNum);
  let newId = "box" + idNum;
  // console.log(`Top left: ${left}, ${top}\nBottom right: ${left + width}, ${top + height}`)
  const newDiv = $(`<div style="left: ${left + 'px'}; top: ${top + 'px'}; width: ${width + 'px'}; height: ${height + 'px'}" class="borderDiv" id=${newId}></div>`)

  if (topOnly) {
    newDiv.addClass("top");
  }
  else if (leftOnly) {
    newDiv.addClass("left")
  }
  else if (styleLeft) {
    newDiv.addClass("left");
    newDiv.addClass("top");
  } else {
    newDiv.addClass("right");
    newDiv.addClass("top");
  }
  $("body").append(newDiv);

  let length;
  let tempElement = div1Element;
  let tempElement2 = div2Element;
  for (let i = 0; i <= 1; i++) {
    divPairs[0].push(tempElement.id)
    divPairs[2].push(newId);
    length = divPairs[0].length - 1;
    console.log(length);
    try {
      if (divPairs[1][length][0]) {
        divPairs[1][length].push(tempElement2.id);
      }
    } catch {
      divPairs[1].push([tempElement2.id]);
    }
    tempElement = div2Element;
    tempElement2 = div1Element;
  }
  console.log(divPairs[2][1])
// console.log(arrayLength);
//   try {
//     if (divPairs[2][arrayLength][0] !== undefined) {
//       divPairs[2][arrayLength].push(newId);
//       console.log(divPairs[2][arrayLength][100]);
//     }
//   } catch {
//     divPairs[2][arrayLength].push([newId]);
//     console.log(divPairs[2][arrayLength][0]);
//   }

  //This outputs a different set of coordinates than the above log??
  // let newNewDiv = document.getElementById("bounds");
  // let divBounds = newNewDiv.getBoundingClientRect();
  // console.log(divBounds.left, divBounds.top);
  // console.log(divBounds.right, divBounds.bottom);
}

function connections() {
  connecting = true;
  $("body").addClass("grey");
  let div1 = null, div2 = null, temp = null;
  let listening = true;
  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
      if (div1) {
        div1.style.borderColor = "";
      }
      div1 = temp = div2 = null;
      $("body").removeClass("grey");
      connecting = false;
      listening = false;
    }
  })
  document.addEventListener('mousedown', function () {
    if (!listening) {
      return
    }
    temp = findParentFromMouse()
    if (div1 === null) {
      div1 = temp;
      div1.style.borderColor = "green";
    } else if (div1 === temp) {
      alert("You cannot link the same element!");
      div2 = null;
    } else {
      div1.style.borderColor = "";
      div2 = temp;
      listening = false;
      divBox(div1, div2);
      div1 = div2 = temp = null;
      $("body").removeClass("grey");
      connecting = false;
    }
  }, true);
}
