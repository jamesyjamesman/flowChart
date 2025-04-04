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
    deleteElement();
    }
})

function deleteElement() {
  //this code block is used below, could be a function (and then could just do element.remove upstairs)
  let element = document.elementFromPoint(mouseX, mouseY);
  if (element.nodeName !== "BODY") {
    while (element.className !== "parentDiv") {
      element = element.parentElement;
    }
  } else {
    element = null;
    return;
  }
  element.remove();
}

let ids = [1];
let idNum;
let descriptionNewId;
let headerNewId;
let length;
let divNewId;
let divMoveNewId

function add(placeAtCursor) {
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
    document.body.setAttribute("style", "user-select: none;");
    isDown = true;
    offset = {
      left: div.offsetLeft - e.clientX,
      top: div.offsetTop - e.clientY
    };
  }, true);

  document.addEventListener('mouseup', function () {
    isDown = false;
    document.body.removeAttribute("style");
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

function divBox(div1, div2) {
  div1 = div1.getBoundingClientRect();
  div2 = div2.getBoundingClientRect();

  if (div2.top < div1.top) {
    let temp = div1;
    div1 = div2;
    div2 = temp;
  }

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
  console.log(`Top left: ${left}, ${top}\nBottom right: ${left + width}, ${top + height}`)
  const newDiv = $(`<div style="left: ${left + 'px'}; top: ${top + 'px'}; width: ${width + 'px'}; height: ${height + 'px'}" class="borderDiv" id="bounds"></div>`)

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

  //This outputs a different set of coordinates than the above log??
  let newNewDiv = document.getElementById("bounds");
  let divBounds = newNewDiv.getBoundingClientRect();
  console.log(divBounds.left, divBounds.top);
  console.log(divBounds.right, divBounds.bottom);
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
    temp = document.elementFromPoint(event.clientX, event.clientY);
    if (temp.nodeName !== "BODY") {
      while (temp.className !== "parentDiv") {
        temp = temp.parentElement;
      }
    } else {
      temp = null;
      return;
    }
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
