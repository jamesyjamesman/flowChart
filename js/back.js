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

        const divMove = $(`<div class="move" onmouseover="moveElement(id)" id=${divMoveNewId}>::<br>::</div>`)
        const title = $(`<input class='header' type='text' placeholder="Title" id=${headerNewId}>`);
        const description = $(`<textarea placeholder="Description" id=${descriptionNewId}></textarea>`);
        const div = $(`<div id=${divNewId} class="parentDiv"></div>`);

        div.append(divMove, title, $("<br>"), description);
        return div;
    }

    addChild(draggableElement) {
        this.children.push(draggableElement);
        if (!draggableElement.parents.includes(this)) {
            draggableElement.parents.push(this);
        }
    }

    addParent(draggableElement) {
        this.parents.add(draggableElement);
        if (!draggableElement.children.includes(this)) {
            draggableElement.children.push(this);
        }
    }

    drawLines() {
        this.children.forEach(child => {
            const div1 = this.html.getBoundingClientRect();
            const div2 = child.html.getBoundingClientRect();

            let div1Coords = [[div1.left, div1.top], [div1.right, div1.bottom]]
            let div2Coords = [[div2.left, div2.top], [div2.right, div2.bottom]]
            let newDivCoords = [[(div1Coords[0][0] + div1Coords[1][0])/2, (div1Coords[0][1] + div1Coords[1][1])/2], [(div2Coords[0][0] + div2Coords[1][0])/2, (div2Coords[0][1] + div2Coords[1][1])/2]];

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
            if (newBox) {
                let arrayLength = boxIds.length - 1;
                let idNum = boxIds[arrayLength] + 1;
                boxIds.push(idNum);
                newId = "box" + idNum;
            } else {
                newId = oldId;
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
            $("body").append(newDiv);
        });
    }

    static getJSOFromDOM(htmlElement) {
        const idNum = parseInt(htmlElement.id.match(/\d+/));
        console.log(idNum);
        console.log(this.elements);
        for (let i = 0; i < DraggableElement.elements.length; i++) {
            const element = DraggableElement.elements[i];
            if (element.id === idNum) {
                console.log(element);
                console.log(typeof element);
                return element;
            }
        }
        // DraggableElement.elements.forEach(element => {
        //     console.log(element.id);
        //     if (element.id === idNum) {
        //         console.log("returned!");
        //         return element;
        //     }
        // });
        // console.log("how am i here");
        throw new Error("Javascript object not found!");
    }
}

// Very slow map
class ElementLineMap {

    constructor() {
        this.keys = []; //2D array of objects such that keys = [][2];
        this.values = [];
    }

    // ORDERED!
    put(key1, key2, value) {
        if (this.keyExists(key1, key2)) {
            throw new Error("Key already exists!");
        }

        this.keys.push({key1, key2});
        this.values.push(value);
    }

    get(key1, key2) {
        for (let i = 0; i < this.keys.length; i++) {
            if ((this.keys[i][0] === key1 && this.keys[i][1] === key2)) {
                return this.values[i];
            }
        }

        return null;
    }

    getKeysByValue(value) {
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] === value) return this.keys[i];
        }

        return null;
    }

    remove(key1, key2) {
        for (let i = 0; i < this.keys.length; i++) {
            if ((this.keys[i][0] === key1 && this.keys[i][1] === key2)) {
                this.keys.splice(i, 1);
                this.values.splice(i, 1);
            }
        }
        throw new Error("Element not found!");
    }

    keyExists(key1, key2) {
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i][0] === key1 && this.keys[i][1] === key2) {
                return true;
            }
        }
        return false;
    }
}