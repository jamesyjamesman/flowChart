let ids = [1];
let idNum;
let descriptionNewId;
let headerNewId;
let length;
let divNewId;
let divMoveNewId

function add() {
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
  let div = $(`<div onmouseover=moveElement(id) id=${divNewId}></div>`);

  $(div).append(divMove, title, $("<br>"), description);
  $("body").append(div);
}

function moveElement(divId) {
  let mousePosition;
  let offset = [0, 0];
  let isDown = false;
  let div;
  console.log(divId);

  div = document.getElementById(divId).parentElement;

  div.addEventListener('mousedown', function (e) {
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

function divBox(div1, div2) {
  div1 = div1 || document.getElementById("div1");
  div2 = div2 || document.getElementById("div2");
  div1 = div1.getBoundingClientRect();
  div2 = div2.getBoundingClientRect();
  let div1_coords = [[div1.left, div1.top], [div1.right, div1.bottom]]
  let div2_coords = [[div2.left, div2.top], [div2.right, div2.bottom]]
  let newDivCoords = [[(div1_coords[0][0] + div1_coords[1][0])/2, (div1_coords[0][1] + div1_coords[1][1])/2], [(div2_coords[0][0] + div2_coords[1][0])/2, (div2_coords[0][1] + div2_coords[1][1])/2]]
  let left = newDivCoords[0][0];
  let top = newDivCoords[0][1];
  let width = newDivCoords[1][0] - newDivCoords[0][0];
  let height = newDivCoords[1][1] - newDivCoords[0][1];

  //If statements effectively rearrange based on which div is topmost and leftmost (cannot have negative widths or lengths)
  if (width < 0) {
    left += width;
    width = Math.abs(width)
  }
  if (height < 0) {
    top += height;
    height = Math.abs(height);
  }
  const newDiv = $(`<div style="left: ${left + 'px'}; top: ${top + 'px'}; width: ${width + 'px'}; height: ${height + 'px'}" class="borderDiv"></div>`)
  $("body").append(newDiv);
}


// This doesn't work!
// function connections() {
//   let div1, div2;
//   while (true) {
//     document.addEventListener('mousedown', function () {
//       div1 = document.elementFromPoint(event.clientX, event.clientY);
//       break;
//     }, true);
//   }
//   while (true) {
//     document.addEventListener('mousedown', function () {
//       div2 = document.elementFromPoint(event.clientX, event.clientY);
//       break;
//     }, true);
//   }
//   divBox(div1, div2);
// }
