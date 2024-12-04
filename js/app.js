let boxes = [[], []];
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
    isDown = true;
    document.body.setAttribute("style", "user-select: none;");
    offset = {
      left: div.offsetLeft - e.clientX,
      top: div.offsetTop - e.clientY
    };
  }, true);

  divMove.addEventListener('mouseup', function () {
    isDown = false;
    document.body.removeAttribute("style");
    // changeBorders(div);
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
      changeBorders(div);
    }
  }, true);
}
function changeBorders(div) {
    let indexNum = boxes[0].indexOf(div);
    console.log(boxes[0])
    if (indexNum === -1) {return}
    console.log(indexNum)
    for (let i = 0; i <= boxes[1][indexNum].length - 1; i++) {
      let boxId = div.getAttribute("data-connector")
      console.log(boxId)
      document.getElementById(boxId).remove();
      let divs = document.querySelectorAll(`[data-connector=${boxId}]`);
      divBox(divs[0], divs[1]);
    }
}
let boxIds = [0];

function divBox(div1, div2) {
  console.log(div1, div2)
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
  let newId;
  if (div1Element.hasAttribute("data-connector")) {
    newId = div1Element.getAttribute("data-connector");
  } else {
    let arrayLength = boxIds.length - 1;
    let idNum = boxIds[arrayLength] + 1;
    boxIds.push(idNum);
    newId = "box" + idNum;
    // console.log(`Top left: ${left}, ${top}\nBottom right: ${left + width}, ${top + height}`)
    div1Element.setAttribute("data-connector", newId);
    div2Element.setAttribute("data-connector", newId);
  }

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
  console.log(newDiv)
  $("body").append(newDiv);

  data_setters(div1Element, div2Element);
  data_setters(div2Element, div1Element);

  function data_setters(div1Element, div2Element) {
    // Check if array exists to add to!
    let index;
    if (boxes[0].indexOf(div1Element) < 0) {
      boxes[0].push(div1Element);
      boxes[1].push([div2Element]);
    } else {
      index = boxes[0].indexOf(div1Element);
      if (boxes[1][index].indexOf(div2Element) < 0) {
        boxes[1][index].push(div2Element);
      }
    }
  }
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
