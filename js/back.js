class DraggableElement {
    static elements = [];
    static arrowMap = new ElementLineMap();

    constructor() {
        this.id = DraggableElement.elements.length === 0 ? 1 : DraggableElement.elements[DraggableElement.elements.length-1].id + 1;
        this.children = [];
        this.parents = [];
        this.html = this.createHTML();
        DraggableElement.elements.push(this);
    }

    createHTML() {
        const descriptionNewId = "button" + this.id;
        const headerNewId = "header" + this.id;
        const divNewId = "div" + this.id;
        const divMoveNewId = "divMove" + this.id;

        const div = document.createElement("div");
        div.id = divNewId;
        div.classList.add("parentDiv");

        const title = document.createElement("input");
        title.classList.add("header");
        title.type = "text";
        title.placeholder = "Title";
        title.id = headerNewId;

        const description = document.createElement("textarea");
        description.placeholder = "Description";
        description.id = descriptionNewId;
        description.value =
        `Hit the "N" key to make a new element at your mouse position. ` +
        `Hit the "L" key to connect two elements, and "Escape" to cancel. ` +
        `Hit "Delete" or "Backspace" to delete the element you're hovering over. ` +
        `Poke around and have fun!`;

        const divMove = document.createElement("div");
        divMove.classList.add("move");
        divMove.id = divMoveNewId;
        divMove.innerHTML += "::<br>::";

        div.append(divMove, title, document.createElement("br"), description);

        this.applyEventListeners(div, divMove);

        return div;
    }

    applyEventListeners(div, divMove) {
        let mousePosition;
        let offset = [0, 0];
        let isDown = false;

        div.addEventListener('mouseup', onDivRelease, true);
        // Mouseup doesn't fire if the cursor leaves the page, or if it's in the rounded borders I think.
        divMove.addEventListener('mousedown', (event) => onDivGrab(event), true);
        document.addEventListener('mousemove', (event) => onDivMove(event), true);

        function onDivGrab(event) {
            isDown = true;
            document.body.classList.add("noUserSelect");
            offset = {
                left: div.offsetLeft - event.clientX,
                top: div.offsetTop - event.clientY
            };
        }

        function onDivRelease() {
            isDown = false;
            document.body.classList.remove("noUserSelect");
        }

        function onDivMove(event) {
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
        }
    }

    addChild(draggableElement) {
        this.children.push(draggableElement);
        if (!draggableElement.parents.includes(this)) {
            draggableElement.addParent(this);
        }
    }

    addParent(draggableElement) {
        this.parents.push(draggableElement);
        if (!draggableElement.children.includes(this)) {
            draggableElement.addChild(this);
        }
    }

    // I wonder if there's a better way of doing this
    delete() {

        this.html.remove();

        for (let i = 0; i < DraggableElement.elements.length; i++) {
            if (DraggableElement.elements[i] === this) {
                DraggableElement.elements.splice(i, 1);
                break;
            }
            if (i === DraggableElement.elements.length - 1) {
                throw new Error("Can't delete element that doesn't exist!");
            }
        }

        for (let i = 0; i < this.parents.length; i++) {
            for (let j = 0; j < this.parents[i].children.length; j++) {
                if (this.parents[i].children[j] === this) {
                    DraggableElement.arrowMap.remove(this.parents[i], this);
                    this.parents[i].children.splice(j, 1);
                    break;
                }
            }
        }

        for (let i = 0; i < this.children.length; i++) {
            for (let j = 0; j < this.children[i].parents.length; j++) {
                if (this.children[i].parents[j] === this) {
                    DraggableElement.arrowMap.remove(this, this.children[i]);
                    this.children[i].parents.splice(j, 1);
                    break;
                }
            }
        }
    }

    updateLines() {
        this.children.forEach(child => this.changeLine(child));
        this.parents.forEach(parent => parent.changeLine(this));
    }

    changeLine(child) {
        DraggableElement.arrowMap.get(this, child).remove();
        DraggableElement.arrowMap.remove(this, child);
        this.drawLine(child);
    }

    drawLine(child) {

        const lineBox = document.createElement("div");
        lineBox.classList.add("borderDiv");

        DraggableElement.arrowMap.put(this, child, lineBox);

        // If it's the first line, a key will not exist, obviously
        // If it's the second line, it must be the other around, because an error would be thrown earlier.
        // Okay this is janky but it's the second line if it's not the first line, and the first line always has the top class.
        const secondLine =
            DraggableElement.arrowMap.keyExists(child, this) &&
            DraggableElement.arrowMap.get(child, this).classList.contains("top");

        const div1 = this.html.getBoundingClientRect();
        const div2 = child.html.getBoundingClientRect();

        // Average left, right, bottom, and top to get the center point
        const div1Center = [(div1.left + div1.right)/2, (div1.top + div1.bottom)/2];
        const div2Center = [(div2.left + div2.right)/2, (div2.top + div2.bottom)/2];

        if (div1Center[0] < div2Center[0] && div1Center[1] < div2Center[1]) { // 1 top left, 2 bottom right
            topLeftBottomRight(div1Center, div2Center);
        } else if (div1Center[0] > div2Center[0] && div1Center[1] < div2Center[1]) { // 1 top right, 2 bottom left
            bottomLeftTopRight(div1Center, div2Center);
        } else if (div1Center[0] > div2Center[0] && div1Center[1] > div2Center[1]) { // 1 bottom right, 2 top left
            topLeftBottomRight(div2Center, div1Center);
        } else if (div1Center[0] < div2Center[0] && div1Center[1] > div2Center[1]) { // 1 bottom left, 2 top right
            bottomLeftTopRight(div2Center, div1Center);
        } else {
            console.log("We couldn't decide how to orient your line!");
            topLeftBottomRight(div1Center, div2Center);
        }

        document.body.append(lineBox);
        // Return

        function topLeftBottomRight(div1Center, div2Center) {
            if (secondLine) {
                lineBox.classList.add("left");
                lineBox.classList.add("bottom");
            } else {
                lineBox.classList.add("right");
                lineBox.classList.add("top");
            }

            lineBox.style.width = div2Center[0] - div1Center[0] + "px";
            lineBox.style.height = div2Center[1] - div1Center[1] + "px";

            lineBox.style.left = div1Center[0] + "px";
            lineBox.style.top = div1Center[1] + "px";
        }

        function bottomLeftTopRight(div1Center, div2Center) {
            if (secondLine) {
                lineBox.classList.add("right");
                lineBox.classList.add("bottom");
            } else {
                lineBox.classList.add("left");
                lineBox.classList.add("top");
            }

            lineBox.style.width = div1Center[0] - div2Center[0] + "px";
            lineBox.style.height = div2Center[1] - div1Center[1] + "px";

            lineBox.style.left = div2Center[0] + "px";
            lineBox.style.top = div1Center[1] + "px";
        }
    }

    getFamily() {
        return this.children.concat(this.parents);
    }

    // This function is inherently evil but I will use it for now
    static getJSOFromDOM(htmlElement) {
        const idNum = parseInt(htmlElement.id.match(/\d+/));
        for (let i = 0; i < DraggableElement.elements.length; i++) {
            const element = DraggableElement.elements[i];
            if (element.id === idNum) {
                return element;
            }
        }
        throw new Error("Javascript object not found!");
    }
}