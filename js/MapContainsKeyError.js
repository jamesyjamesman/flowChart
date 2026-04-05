class MapContainsKeyError extends Error {
    constructor(message="Map already contains that pair of keys!") {
        super(message);
    }
}