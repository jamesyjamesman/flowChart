class DraggableElement {
    static elements = [];

    constructor(id) {
        this.id = id;
        this.siblings = [];
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

    addSibling(draggableElement) {
        this.siblings.push(draggableElement);
        if (!draggableElement.siblings.includes(this)) {
            draggableElement.siblings.push(this);
        }
    }

    static getJSOFromDOM(htmlElement) {
        const idNum = parseInt(htmlElement.id.match(/\d+/));
        console.log(idNum);
        DraggableElement.elements.forEach(element => {
            if (element.id === idNum) {
                return element;
            }
        })
        throw new Error("Javascript object not found!");
    }
}