// const matterContainer = document.querySelector("#matter-container");
const showWireframes = false;
const lettersAreStatic = true;

const matterContainer = document.getElementById("matter-container");
const THICCNESS = 60;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Bounds = Matter.Bounds;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0.00;

// create a renderer
var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: "transparent",
        wireframes: showWireframes,
        showAngleIndicator: false
    }
});

// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);


let scale = .2;
let next_pos = Vector.create(matterContainer.clientWidth - 50, matterContainer.clientHeight / 2);

let spaceBetweenLetters = 0;

class letterInfo {
    static members = [];

    static getsize(path) {
        for (let i = 0; i < letterInfo.members.length; i++) {
            if (letterInfo.members[i].path === path) {
                return Vector.create(letterInfo.members[i].width, letterInfo.members[i].height);
            }
        }
        return Vector.create(0, 0);
    }

    constructor(width, height, path, spaceFromRight = 0) {
        this.spaceFromRight = spaceFromRight;
        this.width = width;
        this.height = height;
        this.path = path;
        this.body =null;
        letterInfo.members.push(this);

    }
}


function makeLetter(lInfo) {
    try {
        let imageDims = letterInfo.getsize(lInfo.path);
        imageDims.x *= scale;
        imageDims.y *= scale;
        next_pos.x -= lInfo.spaceFromRight;
        console.log("pos: " + next_pos.x + " " + next_pos.y);
        let body = Bodies.rectangle(next_pos.x, next_pos.y, imageDims.x, imageDims.x, {
            render: {
                sprite: {
                    texture: lInfo.path,
                    xScale: scale,
                    yScale: scale
                }
            },
            isStatic: lettersAreStatic
        });
        console.log("Here");

        // let bounds = Bounds.create(body.vertices);
        // while (Bounds.contains(bounds, next_pos)) {
        //     next_pos.x -= 10;
        //     console.log("next_pos: " + next_pos.x + " " + next_pos.y);
        // }
        lInfo.body = body;
        Composite.add(engine.world, body);

    } catch (e) {
        console.log(e);
        console.log("path: " + lInfo.path);
    }

}


// const ת2 = { width: 1235, height: 1438 };
// const נק1 = { width: 466, height: 478 };
// const נק2 = { width: 466, height: 478 };
// const ג = { width: 773, height: 1421 };
// const ו4 = { width: 442, height: 1420 };
// const ו3 = { width: 455, height: 1383 };
// const ל = { width: 1069, height: 1793 };
// const נק-ירוק2 = { width: 482, height: 490 };
// const ד2 = { width: 1128, height: 1397 };
// const נק-ירוק1 = { width: 478, height: 490 };
firstLine = [
    new letterInfo(1154, 1468, "Assets/עבודות_גדולות_אותיות/ע.png", 0), // const ע = { width: 1154, height: 1468 };
    new letterInfo(1030, 1458, "Assets/עבודות_גדולות_אותיות/ב.png",230), // const ב = { width: 1030, height: 1458 };
    new letterInfo(480, 1469, "Assets/עבודות_גדולות_אותיות/ו1.png", 160),// const ו1 = { width: 480, height: 1469 };
    new letterInfo(1027, 1472, "Assets/עבודות_גדולות_אותיות/ד1.png", 160), // const ד1 = { width: 1027, height: 1472 };
    new letterInfo(508, 1450, "Assets/עבודות_גדולות_אותיות/ו2.png",160),// const ו2 = { width: 508, height: 1450 };
    new letterInfo(1104, 1482, "Assets/עבודות_גדולות_אותיות/ת1.png",173), // const ת1 = { width: 1104, height: 1482 };
];

var i = 0;
let finishedBuildingWorld = false;

function MakeFirstLine() {
    if (i >= firstLine.length) {
        finishedBuildingWorld = true;
        return
    }

    makeLetter(firstLine[i]);
    i++;
    // makeLetter(firstLine[1]);
    // makeLetter(firstLine[2]);
    // makeLetter(firstLine[3]);
    // makeLetter(firstLine[4]);
    // makeLetter(firstLine[5]);

}


MakeFirstLine();

setInterval(MakeFirstLine, 1000);


var ground = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    matterContainer.clientHeight + THICCNESS / 2,
    27184,
    THICCNESS,
    {isStatic: true}
);

let leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5,
    {
        isStatic: true
    }
);

let rightWall = Bodies.rectangle(
    matterContainer.clientWidth + THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5,
    {isStatic: true}
);

// add all of the bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall]);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(engine.world, mouseConstraint);

// allow scroll through the canvas
mouseConstraint.mouse.element.removeEventListener(
    "mousewheel",
    mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
    "DOMMouseScroll",
    mouseConstraint.mouse.mousewheel
);


// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize(matterContainer) {
    // set canvas size to new values
    render.canvas.width = matterContainer.clientWidth;
    render.canvas.height = matterContainer.clientHeight;

    // reposition ground
    Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
            matterContainer.clientWidth / 2,
            matterContainer.clientHeight + THICCNESS / 2
        )
    );

    // reposition right wall
    Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
            matterContainer.clientWidth + THICCNESS / 2,
            matterContainer.clientHeight / 2
        )
    );
}

window.addEventListener("resize", () => handleResize(matterContainer));

function collapseLetters() {
    if (!finishedBuildingWorld) return;
    for (var i =0; i< letterInfo.members.length; i++){
        let body = letterInfo.members[i].body;
        Matter.Body.setStatic(body, false);
    }
    engine.world.gravity.y = 0.5;
    console.log("gravity is on!");
}
window.addEventListener("touchstart",()=>collapseLetters());
window.addEventListener("mousedown",()=>collapseLetters());







