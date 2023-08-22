// const matterContainer = document.querySelector("#matter-container");

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Bounds = Matter.Bounds;
const showWireframes = false;
const lettersAreStatic = true;

const matterContainer = document.getElementById("matter-container");
const THICCNESS = 60;


const MOBILE_THRESHOLD = 480;
const SMALL_SCREEN_THRESHOLD = 900;
const MEDIUM_SCREEN_THRESHOLD = 1200;

function ResponsiveSize(client, mobile, small, medium, large) {
    if (client < MOBILE_THRESHOLD) return mobile;
    if (client < SMALL_SCREEN_THRESHOLD) return small;
    if (client < MEDIUM_SCREEN_THRESHOLD) return medium;
    return large;
}

// let next_pos = Vector.create(matterContainer.clientWidth - 50, matterContainer.clientHeight / 2);
let firstLineY =  250;
let firstLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - 20, firstLineY),
    Vector.create(matterContainer.clientWidth - 50, matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, 500)
);


let secondLineY =  firstLineY + 120;
let secondLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - 20,secondLineY),
    Vector.create(matterContainer.clientWidth - 50, secondLineY),
    Vector.create(matterContainer.clientWidth - 50, 100 + matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, 50 + 500)
);

let thirdLineY =  secondLineY + 350;
let thirdLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - 20, thirdLineY),
    Vector.create(matterContainer.clientWidth - 50, thirdLineY + matterContainer.clientHeight  / 3),
    Vector.create(matterContainer.clientWidth - 50, thirdLineY + matterContainer.clientHeight  / 3),
    Vector.create(matterContainer.clientWidth - 50, thirdLineY + 500)
);

let fourthLineY =  thirdLineY + 120;
let fourthLineX =  130;
let fourthLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - fourthLineX, fourthLineY),
    Vector.create(matterContainer.clientWidth - 50, fourthLineY + matterContainer.clientHeight  / 3),
    Vector.create(matterContainer.clientWidth - 50, fourthLineY + matterContainer.clientHeight  / 3),
    Vector.create(matterContainer.clientWidth - 50, fourthLineY + 500)
);



let ResponsiveScale = ResponsiveSize(matterContainer.clientWidth, 0.4, 0.5, 1.3, 1.6);
let scale = ResponsiveScale * 0.2;


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

    constructor(width, height, path, spaceFromRight = 0, yOffset = 0, canCollide = true) {
        this.spaceFromRight = spaceFromRight * ResponsiveScale;
        this.yOffset = yOffset * ResponsiveScale;
        this.width = width;
        this.height = height;
        this.path = path;
        this.body = null;
        this.canCollide = canCollide;
        letterInfo.members.push(this);

    }
}


function makeLetter(lInfo, offset) {
    try {
        let imageDims = letterInfo.getsize(lInfo.path);
        imageDims.x *= scale;
        imageDims.y *= scale;
        offset.x -= lInfo.spaceFromRight;
        let body = Bodies.rectangle(offset.x, offset.y + lInfo.yOffset, imageDims.x, imageDims.x, {
            render: {
                sprite: {
                    texture: lInfo.path,
                    xScale: scale,
                    yScale: scale
                }
            },
            isStatic: lettersAreStatic,
            isSensor: !lInfo.canCollide,
        });
        console.log("Here");

        lInfo.body = body;
        Composite.add(engine.world, body);

    } catch (e) {
        console.log(e);
        console.log("path: " + lInfo.path);
    }

}


let firstLine = [
    new letterInfo(1154, 1468, "Assets/עבודות_גדולות_אותיות/ע.png", 0), // const ע = { width: 1154, height: 1468 };
    new letterInfo(1030, 1458, "Assets/עבודות_גדולות_אותיות/ב.png", 230), // const ב = { width: 1030, height: 1458 };
    new letterInfo(480, 1469, "Assets/עבודות_גדולות_אותיות/ו1.png", 160),// const ו1 = { width: 480, height: 1469 };
    new letterInfo(466, 478, "Assets/עבודות_גדולות_אותיות/נק1.png", 0, -200), // const נק1 = { width: 466, height: 478 };
    new letterInfo(1027, 1472, "Assets/עבודות_גדולות_אותיות/ד1.png", 160), // const ד1 = { width: 1027, height: 1472 };
    new letterInfo(508, 1450, "Assets/עבודות_גדולות_אותיות/ו2.png", 160),// const ו2 = { width: 508, height: 1450 };
    new letterInfo(466, 478, "Assets/עבודות_גדולות_אותיות/נק2.png", 0, -200), // const נק2 = { width: 466, height: 478 };
    new letterInfo(1104, 1482, "Assets/עבודות_גדולות_אותיות/ת1.png", 173), // const ת1 = { width: 1104, height: 1482 };
];

let secondLine = [
    new letterInfo(773, 1421, "Assets/עבודות_גדולות_אותיות/ג.png", 0), // const ג = { width: 773, height: 1421 };
    new letterInfo(1128, 1397, "Assets/עבודות_גדולות_אותיות/ד2.png", 185), // const ד2 = { width: 1128, height: 1397 };
    new letterInfo(455, 1383, "Assets/עבודות_גדולות_אותיות/ו3.png", 170), // const ו3 = { width: 455, height: 1383 };
    new letterInfo(478, 490, "Assets/עבודות_גדולות_אותיות/נק-ירוק1.png", 0, -200), // const נק-ירוק1 = { width: 478, height: 490 };
    new letterInfo(1069, 1793, "Assets/עבודות_גדולות_אותיות/ל.png", 160, -30), // const ל = { width: 1069, height: 1793 };
    new letterInfo(442, 1420, "Assets/עבודות_גדולות_אותיות/ו4.png", 160), // const ו4 = { width: 442, height: 1420 };
    new letterInfo(482, 490, "Assets/עבודות_גדולות_אותיות/נק-ירוק2.png", 0, -200), // const נק-ירוק2 = { width: 482, height: 490 };
    new letterInfo(1235, 1438, "Assets/עבודות_גדולות_אותיות/ת2.png", 180), // const ת2 = { width: 1235, height: 1438 };
    new letterInfo(1403, 66, "Assets/קול_קורא_אותיות/פתיחת_שנה_טקסט.png", -600, 300, false), // const פתיחת_שנה_טקסט = { width: 1403, height: 66 };
];

let thirdLine = [
    new letterInfo(1431, 2035, "Assets/קול_קורא_אותיות/שחור_ק1.png", 0), // const שחור_ק1 = { width: 1431, height: 2035 };
    new letterInfo(493, 1452, "Assets/קול_קורא_אותיות/שחור_ו1.png", 200, -60), // const שחור_ו1 = { width: 493, height: 1452 };
    new letterInfo(447, 447, "Assets/קול_קורא_אותיות/נק5.png", 0, -260), // const נק5 = { width: 447, height: 447 };
    new letterInfo(1223, 1817, "Assets/קול_קורא_אותיות/שחור_ל.png", 180 , -95), // const שחור_ל = { width: 1223, height: 1817 };
];

let fourthLine = [
    new letterInfo(1248, 2013, "Assets/קול_קורא_אותיות/שחור_ק2.png", 0), // const שחור_ק2 = { width: 1248, height: 2013 };
    new letterInfo(390, 1441, "Assets/קול_קורא_אותיות/שחור_ו2.png", 170, -60), // const שחור_ו2 = { width: 390, height: 1441 };
    new letterInfo(447, 436, "Assets/קול_קורא_אותיות/נק_אדום.png", 0, -260), // const נק_אדום = { width: 447, height: 436 };
    new letterInfo(1053, 1462, "Assets/קול_קורא_אותיות/שחור_ר.png", 150, -60), // const שחור_ר = { width: 1053, height: 1462 };
    new letterInfo(1350, 1453, "Assets/קול_קורא_אותיות/שחור_א.png", 220,-60), // const שחור_א = { width: 1350, height: 1453 };
    new letterInfo(447, 436, "Assets/קול_קורא_אותיות/אוצרים_אדם_נגה_טקסט.png", -130, 40, false), // const נק_אדום = { width: 447, height: 436 };
];

// const אוצרים_אדם_נגה_טקסט = { width: 318, height: 481 };


// const פתיחת_שנה_טקסט = { width: 1403, height: 66 };


var i = 0;
let finishedBuildingWorld = false;

function BuildLines() {
    if (i >= firstLine.length + secondLine.length + thirdLine.length + fourthLine.length) {
        finishedBuildingWorld = true;
        return
    }
    if (i < firstLine.length) {
        makeLetter(firstLine[i], firstLineOffset);
        console.log("first line offset is " + firstLineOffset.x + " " + firstLineOffset.y);
    } else  if (i < firstLine.length + secondLine.length){
        makeLetter(secondLine[i - firstLine.length], secondLineOffset);
        console.log("second line offset is " + secondLineOffset.x + " " + secondLineOffset.y);
    }
    else if (i < firstLine.length + secondLine.length + thirdLine.length){
        makeLetter(thirdLine[i - firstLine.length - secondLine.length], thirdLineOffset);
        console.log("third line offset is " + thirdLineOffset.x + " " + thirdLineOffset.y);
    }
    else {
        makeLetter(fourthLine[i - firstLine.length - secondLine.length - thirdLine.length], fourthLineOffset);
        console.log("fourth line offset is " + fourthLineOffset.x + " " + fourthLineOffset.y);
    }
    i++;
}


setInterval(BuildLines, 100);


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
    for (var i = 0; i < letterInfo.members.length; i++) {
        let body = letterInfo.members[i].body;
        Matter.Body.setStatic(body, false);
    }
    engine.world.gravity.y = 0.5;
    console.log("gravity is on!");
}

window.addEventListener("touchstart", () => collapseLetters());
window.addEventListener("mousedown", () => collapseLetters());







