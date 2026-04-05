class ElementArrow {
    static ArrowDirection = Object.freeze({
        UP: "UP",
        DOWN: "DOWN",
        LEFT: "LEFT",
        RIGHT: "RIGHT"
    });

    constructor(parent, child) {
        DraggableElement.arrowMap.put(parent, child, this);
        this.parent = parent;
        this.child = child;
        this.lineDiv = this.createLine();
        this.arrow = this.createArrow();
    }

    update() {
        this.lineDiv.remove();
        this.lineDiv = this.createLine();
    }

    createLine() {
        const lineBox = document.createElement("div");
        lineBox.classList.add("borderDiv");

        // If it's the first line, a key will not exist, obviously
        // If it's the second line, it must be the other around, because an error would be thrown earlier.
        // Okay this is janky, but it's the second line if it's not the first line, and the first line always has the top class.
        const secondLine =
            DraggableElement.arrowMap.keyExists(this.child, this.parent) &&
            DraggableElement.arrowMap.get(this.child, this.parent).lineDiv.classList.contains("top");

        const div1 = this.parent.html.getBoundingClientRect();
        const div2 = this.child.html.getBoundingClientRect();

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
        return lineBox;

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

    createArrow() {

    }

    delete() {
        this.lineDiv.remove();
    }
}