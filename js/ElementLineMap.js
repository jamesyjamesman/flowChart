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

        this.keys.push([key1, key2]);
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

    // Remove from data structure AND line from page (which isn't good practice maybe, but it is faster)
    remove(key1, key2) {
        for (let i = 0; i < this.keys.length; i++) {
            if ((this.keys[i][0] === key1 && this.keys[i][1] === key2)) {
                this.values[i].remove(); // Side effect
                this.keys.splice(i, 1);
                this.values.splice(i, 1);
                return;
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