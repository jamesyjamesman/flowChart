createFirstElement();

let mouseX, mouseY;
let makingLine = false;

document.addEventListener("mousemove", function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("keydown", function(e) {
    let activeElement = document.activeElement;
    // Input fields
    if (activeElement.className === "header") {
      // Various choices to try to match the length of the input to length of the characters
      if (activeElement.value.length === 0) {
        activeElement.style.width = '28px';
      } else {
        if (e.key === "Backspace") {
          activeElement.style.width = document.activeElement.value.length * 28 - 28 + 'px';
        } else if (e.key.length !== 1) {
          activeElement.style.width = document.activeElement.value.length * 28 + 'px'; //27 is slightly not enough, 28 is too much
        } else {
          activeElement.style.width = document.activeElement.value.length * 28 + 28 + 'px';
        }
      }
    // Do nothing if it is a textarea
  } else if (activeElement.nodeName === "TEXTAREA") {
  } else if (e.key === "n") {
    add(true);
  } else if (e.key === "l" && !makingLine) {
    connections();
  } else if (e.key === "Backspace" || e.key === "Delete") {
        const hoveredElement = findParentFromMouse();
        if (hoveredElement !== null) {
            DraggableElement.getJSOFromDOM(hoveredElement).delete();
        }
    }
})

function findParentFromMouse() { // Can only return a div with class "parentDiv"
  let element = document.elementFromPoint(mouseX, mouseY);
  // Ensuring the amount of classes is less than 1 excludes the connecting div
  if (element.nodeName !== "HTML" && element.nodeName !== "BODY" && element.classList.length <= 1) {
      while (element.className !== "parentDiv") {
      element = element.parentElement;
    }
  } else {
    element = null;
  }
  return element;
}

function add(placeAtCursor) {
    const newObject = new DraggableElement();
    const divElement = newObject.html;
    if (placeAtCursor) {
        divElement.style.left = `${mouseX + 'px'}`;
        divElement.style.top = `${mouseY + 'px'}`;
    }
    document.body.append(divElement);
}

function changeBorders(div) {
    const divObject = DraggableElement.getJSOFromDOM(div);
    divObject.updateLines();
}

function drawArrow(div, side) {
  div = div.getBoundingClientRect();
  let x, y, divClass;
    if (side === "top") {
      x = (div.left + div.right) / 2;
      y = div.top;
      divClass = "arrowTop";
  } else if (side === "left") {
      x = div.left;
      y = (div.top + div.bottom) / 2;
      divClass = "arrowLeft"
  } else if (side === "bottom") {
      x = (div.left + div.right) / 2;
      y = div.bottom;
      divClass = "arrowBottom";
  } else if (side === "right") {
      x = div.right;
      y = (div.top + div.bottom) / 2;
      divClass = "arrowRight"
  }
    $("body").append(`<div style="left: ${x + 'px'}; top: ${y + 'px'}" class="${divClass} arrow"></div>`);
}

function connections() {
    disableFields(true);

    function disableFields(disable) {
        let inputs = Array.from(document.querySelectorAll(".header"));
        let textAreas = Array.from(document.querySelectorAll("textarea"));
        let changing = inputs.concat(textAreas);
        changing.forEach(element => {
            if (disable) {
                element.classList.add("disabled");
            } else {
                element.classList.remove("disabled");
            }
        });
    }

    document.body.classList.add("grey");
    let div1 = null, div2 = null, temp = null;
    document.addEventListener('keydown', (e) => listenForEscape(e))
    document.addEventListener('mousedown', linkDivs, true); //idk what this option is for

    function listenForEscape(e) {
        if (e.key === "Escape") endConnections();
    }

    function linkDivs() {
        temp = findParentFromMouse();
        if (temp === null) return;
        if (div1 === null) {
            div1 = temp;
            div1.style.borderColor = "green";
        } else if (div1 === temp) {
            alert("You cannot link the same element!");
        } else {
            div2 = temp;

            const parentJSO = DraggableElement.getJSOFromDOM(div1);
            const childJSO = DraggableElement.getJSOFromDOM(div2);
            try {
                parentJSO.addChild(childJSO);
                parentJSO.drawLine(childJSO);

                endConnections();
            } catch (e) { // Maybe define or use more specific error in case something else happens
                alert("Cannot link elements that are already linked!");
            }
        }
    }

    function endConnections() {
        if (div1 != null) div1.style.borderColor = "";
        document.body.classList.remove("grey");
        disableFields(false);
        document.removeEventListener('keydown', listenForEscape);
        document.removeEventListener('mousedown', linkDivs, true);
    }
}

function createFirstElement() {
    const firstHTML = new DraggableElement().html;
    const input = firstHTML.querySelector("input");
    input.value = "Flowchart Tool!";
    input.style.width = "440px";

    const textArea = firstHTML.querySelector("textarea");
    textArea.style.width = "440px";
    textArea.style.height = "66px";
    document.body.append(firstHTML);
}