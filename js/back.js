class DraggableElement {
    static elements = [];
    static arrowMap = new ElementLineMap();

    constructor(id) {
        this.id = id;
        this.children = [];
        this.parents = [];
        this.lines = [];
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

        const divMove = document.createElement("div");
        divMove.classList.add("move");
        divMove.addEventListener("mouseover", () => {moveElement(divMoveNewId)}) // might need to just be divMoveNewId or whatever
        divMove.id = divMoveNewId;
        divMove.innerHTML += "::<br>::";

        div.append(divMove, title, document.createElement("br"), description);
        return div;
    }

    addChild(draggableElement) {
        this.children.push(draggableElement);
        if (!draggableElement.parents.includes(this)) {
            draggableElement.addParent(this);
        }
    }

    addParent(draggableElement) {
        this.parents.add(draggableElement);
        if (!draggableElement.children.includes(this)) {
            draggableElement.addChild(this);
        }
    }

    drawLines() {
        this.children.forEach(child => {
            const div1 = this.html.getBoundingClientRect();
            const div2 = child.html.getBoundingClientRect();

            const div1Center = [(div1.left + div1.right)/2, (div1.top + div1.bottom)/2];
            const div2Center = [(div2.left + div2.right/2), (div2.top + div2.bottom)/2];

            // Rearrangement here

            const lineBox = document.createElement("div");
            lineBox.classList.add("fullBorder");
            lineBox.width = Math.abs(div1Center[0] - div2Center[0]);
            lineBox.height = Math.abs(div1Center[1] - div2Center[1]);

            lineBox.left = div1Center[0];
            lineBox.top = div1Center[1];

            DraggableElement.arrowMap.put(this, child, lineBox);
            document.body.append(lineBox);

            // let styleLeft = false;
            // let leftOnly = false;
            // let topOnly = false;
            //
            // if (newDivCoords[0][0] < div2.right && newDivCoords[0][0] > div2.left) {
            //     leftOnly = true;
            //     left = (2*left + width) / 2;
            //     width = 1;
            // }
            //
            // if (newDivCoords[0][1] > div2.top && newDivCoords[0][1] < div2.bottom) {
            //     topOnly = true;
            //     top = (2*top + height) / 2;
            //     height = 1;
            // }
            //
            // //If statements effectively rearrange based on which div is topmost and leftmost (cannot have negative widths or lengths)
            // if (width < 0) {
            //     left += width;
            //     width = Math.abs(width)
            //     styleLeft = true;
            // }
            // if (height < 0) {
            //     top += height;
            //     height = Math.abs(height);
            // }
            // let newId;
            // if (newBox) {
            //     let arrayLength = boxIds.length - 1;
            //     let idNum = boxIds[arrayLength] + 1;
            //     boxIds.push(idNum);
            //     newId = "box" + idNum;
            // } else {
            //     newId = oldId;
            // }
            //
            // if (topOnly) {
            //     newDiv.addClass("top");
            // }
            // else if (leftOnly) {
            //     newDiv.addClass("left")
            // }
            // else if (styleLeft) {
            //     newDiv.addClass("left");
            //     newDiv.addClass("top");
            // } else {
            //     newDiv.addClass("right");
            //     newDiv.addClass("top");
            // }
            // $("body").append(newDiv);
        });
    }

    getFamily() {
        return this.children.concat(this.parents);
    }

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