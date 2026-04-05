class ElementArrow {
    static ArrowDirection = Object.freeze({
        UP: "UP",
        DOWN: "DOWN",
        LEFT: "LEFT",
        RIGHT: "RIGHT"
    });

    constructor(parent, child) {
        this.lineDiv = this.createLine();
        this.arrow = this.createArrow();
        this.parent = parent;
        this.child = child;
    }

    createLine() {
        // move DraggableElement.drawLine() here

    }

    createArrow() {

    }
}