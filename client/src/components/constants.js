const CANVAS_SIZE = [800,600];
const SNAKE_START = [[10,7],[10,8]];
const FRUIT_START = [8,3];
const SPEED = 250;
const SCALE = 25;
const DIRECTIONS = {
    38: [0,-1], //up
    40: [0,1], //down
    37: [-1,0], //left
    39: [1,0] //right
};
export {
    CANVAS_SIZE,
    SNAKE_START,
    FRUIT_START,
    SPEED,
    SCALE,
    DIRECTIONS
}