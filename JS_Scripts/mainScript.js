// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Bounds = Matter.Bounds,
    Constraint = Matter.Constraint;
const showWireframes = false;
const lettersAreStatic = true;

const matterContainer = document.getElementById("matter-container");
const THICCNESS = 60;


const MOBILE_THRESHOLD = 480;
const SMALL_SCREEN_THRESHOLD = 900;

const MEDIUM_SCREEN_THRESHOLD = 1199; 

function ResponsiveSize(client, mobile, small, medium, large) {
    if (client < MOBILE_THRESHOLD) return mobile;
    if (client < SMALL_SCREEN_THRESHOLD) return small;
    if (client < MEDIUM_SCREEN_THRESHOLD) return medium;
    return large;
}

// let next_pos = Vector.create(matterContainer.clientWidth - 50, matterContainer.clientHeight / 2);
let firstLineY = 250;
let firstLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - 20, firstLineY),
    Vector.create(matterContainer.clientWidth - 50, matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, 500)
);


let secondLineY = firstLineY + 120;
let secondLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - 20, secondLineY),
    Vector.create(matterContainer.clientWidth - 50, secondLineY),
    Vector.create(matterContainer.clientWidth - 50, 100 + matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, 50 + 500)
);

let thirdLineY = secondLineY + 350;
let thirdLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - 20, thirdLineY),
    Vector.create(matterContainer.clientWidth - 50, thirdLineY + matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, thirdLineY + matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, thirdLineY + 500)
);

let fourthLineY = thirdLineY + 120;
let fourthLineX = 130;
let fourthLineOffset = ResponsiveSize(matterContainer.clientWidth,
    Vector.create(matterContainer.clientWidth - fourthLineX, fourthLineY),
    Vector.create(matterContainer.clientWidth - 50, fourthLineY + matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, fourthLineY + matterContainer.clientHeight / 3),
    Vector.create(matterContainer.clientWidth - 50, fourthLineY + 500)
);


let ResponsiveScale = ResponsiveSize(matterContainer.clientWidth, 0.4, 0.5, 1.3, 1.6);
let scale = ResponsiveScale * 0.2;

let inflateScale = 3;

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

    removeLeash() {
        this.leash.bodyB = null;
    }


    isPointedAt(value) {
        if (this.body === null) return;
        if (value === this.isPointed) return;
        if (value) {
            if (!this.isPointed) {

                this.body.render.sprite.xScale = inflateScale * scale;
                this.body.render.sprite.yScale = inflateScale * scale;
                Matter.Body.scale(this.body, inflateScale, inflateScale, {x: this.body.position.x, y: this.body.position.y});
                this.isPointed = value;
            }
            this.timer = 0;
        } else { // not pointed
            this.timer += 100;
            if (!this.isPointed) return;
            if (this.timer > 2000) {
                this.body.render.sprite.xScale = scale;
                this.body.render.sprite.yScale = scale;
                Matter.Body.scale(this.body, 1/inflateScale, 1/inflateScale, {x: this.body.position.x, y: this.body.position.y});
                this.isPointed = value;
            }
        }
    }

    constructor(width, height, path, spaceFromRight = 0, yOffset = 0, canCollide = true) {
        this.spaceFromRight = spaceFromRight * ResponsiveScale;
        this.yOffset = yOffset * ResponsiveScale;
        this.width = width;
        this.height = height;
        this.path = path;
        this.body = null;
        this.leash = null;
        this.canCollide = canCollide;
        this.isPointed = false;
        this.timer = 0;
        letterInfo.members.push(this);

    }
}

function putOnLeash(letter, position) {
    var anchor = {x: position.x, y: position.y};
    letter.leash = Constraint.create({
        pointA: anchor,
        bodyB: letter.body,
        // length: 2.5,
        stiffness: 0.001,
        damping: 0.05,
        render: {
            visible: true
        }
    });

    Composite.add(engine.world, letter.leash);
}


var colliderShrinkFactor = 0.7;

function makeLetter(lInfo, offset) {
    console.log("making letter " + lInfo.path);
    try {
        let imageDims = letterInfo.getsize(lInfo.path);
        imageDims.x *= scale;
        imageDims.y *= scale;
        offset.x -= lInfo.spaceFromRight;
        let body = Bodies.rectangle(offset.x, offset.y + lInfo.yOffset, imageDims.x * colliderShrinkFactor, imageDims.y * colliderShrinkFactor, {
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

        lInfo.body = body;
        putOnLeash(lInfo, {x: offset.x, y: offset.y + lInfo.yOffset});
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
    new letterInfo(466, 478, "Assets/עבודות_גדולות_אותיות/נק1.png", 0, -200, false), // const נק1 = { width: 466, height: 478 };
    new letterInfo(1027, 1472, "Assets/עבודות_גדולות_אותיות/ד1.png", 160), // const ד1 = { width: 1027, height: 1472 };
    new letterInfo(508, 1450, "Assets/עבודות_גדולות_אותיות/ו2.png", 160),// const ו2 = { width: 508, height: 1450 };
    new letterInfo(466, 478, "Assets/עבודות_גדולות_אותיות/נק2.png", 0, -200, false), // const נק2 = { width: 466, height: 478 };
    new letterInfo(1104, 1482, "Assets/עבודות_גדולות_אותיות/ת1.png", 173), // const ת1 = { width: 1104, height: 1482 };
];

let secondLine = [
    new letterInfo(773, 1421, "Assets/עבודות_גדולות_אותיות/ג.png", 0), // const ג = { width: 773, height: 1421 };
    new letterInfo(1128, 1397, "Assets/עבודות_גדולות_אותיות/ד2.png", 185), // const ד2 = { width: 1128, height: 1397 };
    new letterInfo(455, 1383, "Assets/עבודות_גדולות_אותיות/ו3.png", 170), // const ו3 = { width: 455, height: 1383 };
    new letterInfo(478, 490, "Assets/עבודות_גדולות_אותיות/נק-ירוק1.png", 0, -200, false), // const נק-ירוק1 = { width: 478, height: 490 };
    new letterInfo(1069, 1793, "Assets/עבודות_גדולות_אותיות/ל.png", 160, -30), // const ל = { width: 1069, height: 1793 };
    new letterInfo(442, 1420, "Assets/עבודות_גדולות_אותיות/ו4.png", 160), // const ו4 = { width: 442, height: 1420 };
    new letterInfo(482, 490, "Assets/עבודות_גדולות_אותיות/נק-ירוק2.png", 0, -200, false), // const נק-ירוק2 = { width: 482, height: 490 };
    new letterInfo(1235, 1438, "Assets/עבודות_גדולות_אותיות/ת2.png", 180), // const ת2 = { width: 1235, height: 1438 };
    new letterInfo(1403, 66, "Assets/קול_קורא_אותיות/פתיחת_שנה_טקסט.png", -600, 300, false), // const פתיחת_שנה_טקסט = { width: 1403, height: 66 };
];

let thirdLine = [
    new letterInfo(1431, 2035, "Assets/קול_קורא_אותיות/שחור_ק1.png", 0), // const שחור_ק1 = { width: 1431, height: 2035 };
    new letterInfo(493, 1452, "Assets/קול_קורא_אותיות/שחור_ו1.png", 200, -60), // const שחור_ו1 = { width: 493, height: 1452 };
    new letterInfo(447, 447, "Assets/קול_קורא_אותיות/נק5.png", 0, -260, false), // const נק5 = { width: 447, height: 447 };
    new letterInfo(1223, 1817, "Assets/קול_קורא_אותיות/שחור_ל.png", 180, -95), // const שחור_ל = { width: 1223, height: 1817 };
];

let fourthLine = [
    new letterInfo(1248, 2013, "Assets/קול_קורא_אותיות/שחור_ק2.png", 0), // const שחור_ק2 = { width: 1248, height: 2013 };
    new letterInfo(390, 1441, "Assets/קול_קורא_אותיות/שחור_ו2.png", 170, -60), // const שחור_ו2 = { width: 390, height: 1441 };
    new letterInfo(447, 436, "Assets/קול_קורא_אותיות/נק_אדום.png", 0, -260, false), // const נק_אדום = { width: 447, height: 436 };
    new letterInfo(1053, 1462, "Assets/קול_קורא_אותיות/שחור_ר.png", 150, -60), // const שחור_ר = { width: 1053, height: 1462 };
    new letterInfo(1350, 1453, "Assets/קול_קורא_אותיות/שחור_א.png", 220, -60), // const שחור_א = { width: 1350, height: 1453 };
    new letterInfo(447, 436, "Assets/קול_קורא_אותיות/אוצרים_אדם_נגה_טקסט.png", -130, 40, false), // const נק_אדום = { width: 447, height: 436 };
];

// const אוצרים_אדם_נגה_טקסט = { width: 318, height: 481 };


// const פתיחת_שנה_טקסט = { width: 1403, height: 66 };


let i = 0;
let finishedBuildingWorld = false;
var buildProccess = null;

function BuildLines() {
    while(i < firstLine.length + secondLine.length + thirdLine.length + fourthLine.length) {
        // if (i >= firstLine.length + secondLine.length + thirdLine.length + fourthLine.length) {
        //
        // }
        if (i < firstLine.length) {
            makeLetter(firstLine[i], firstLineOffset);
            console.log("first line offset is " + firstLineOffset.x + " " + firstLineOffset.y);
        } else if (i < firstLine.length + secondLine.length) {
            makeLetter(secondLine[i - firstLine.length], secondLineOffset);
            console.log("second line offset is " + secondLineOffset.x + " " + secondLineOffset.y);
        } else if (i < firstLine.length + secondLine.length + thirdLine.length) {
            makeLetter(thirdLine[i - firstLine.length - secondLine.length], thirdLineOffset);
            console.log("third line offset is " + thirdLineOffset.x + " " + thirdLineOffset.y);
        } else if (i < firstLine.length + secondLine.length + thirdLine.length + fourthLine.length) {
            makeLetter(fourthLine[i - firstLine.length - secondLine.length - thirdLine.length], fourthLineOffset);
            console.log("fourth line offset is " + fourthLineOffset.x + " " + fourthLineOffset.y);
        }
        i++;
    }
    finishedBuildingWorld = true;
    // clearInterval(buildProccess);
    // return
}

BuildLines();





// buildProccess = setInterval(BuildLines, 100);


var ground = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    matterContainer.clientHeight + THICCNESS / 2,
    27184,
    THICCNESS,
    {
        isStatic: true,
        // color: "red"
    }
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

let collapse = false;
let collapseTime = 20;
let collapseInterval = null;

function collapseTimer() {
    if (!collapse) return;
    console.log("collapse time is " + collapseTime);
    collapseTime--;
    if (collapseTime === 0) {
        collapseLetters();
    }


    if (collapseTime === -30) {
        document.getElementById('bottom').scrollIntoView({behavior: "auto" });
        clearInterval(collapseInterval);
        clearInterval(searchTouch);

    }
}

collapseInterval = setInterval(collapseTimer, 200);

window.addEventListener("resize", () => handleResize(matterContainer));

let hasCollided = false;

function collapseLetters() {
    if (hasCollided) return;
    if (!finishedBuildingWorld) return;
    hasCollided = true;

    for (var i = 0; i < letterInfo.members.length; i++) {
        let body = letterInfo.members[i].body;
        Matter.Body.setStatic(body, false);
    }
    engine.world.gravity.y = 0.5;
    console.log("gravity is on!");
    setInterval(dropSlowly, 200);
}

function invokeCollision() {
    collapse = true;

}


let counter = 0;
let dropInterval = null ;

function dropSlowly() {
    counter++
    if (counter > 25) {
        clearInterval(dropInterval);
        return;
    }
    var randomIndex = Math.floor(Math.random() * letterInfo.members.length);
    var randomIndex2 = Math.floor(Math.random() * letterInfo.members.length);
    letterInfo.members[randomIndex].removeLeash();
    letterInfo.members[randomIndex2].removeLeash();
}

window.addEventListener("touchstart", function (event) {
    invokeCollision();
});
//     invokeCollision();
//     mouseposition = {x:event.mouse.clientX, y: event.mouse.clientY};
// } );
// window.addEventListener("mousedown", () => invokeCollision());


function SoftBody(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
    var Common = Matter.Common,
        Composites = Matter.Composites,
        Bodies = Matter.Bodies;

    particleOptions = Common.extend({inertia: Infinity}, particleOptions);
    constraintOptions = Common.extend({stiffness: 0.2, render: {type: 'line', anchors: false}}, constraintOptions);

    var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

    softBody.label = 'Soft Body';

    return softBody;
};

var pos = {x: 500, y: 2000};

function cloth(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
    var Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Composites = Matter.Composites;

    var group = Body.nextGroup(true);
    particleOptions = Common.extend({
        inertia: Infinity,
        friction: 0.00001,
        collisionFilter: {group: group},
        render: {visible: false}
    }, particleOptions);
    constraintOptions = Common.extend({stiffness: 0.06, render: {type: 'line', anchors: false}}, constraintOptions);

    var cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = 'Cloth Body';

    return cloth;
};
var cloth1 = cloth(pos.x, pos.y, 30, 10, 5, 5, false, 8);
for (var j = 0; j < 30; j++) {
    cloth1.bodies[j].isStatic = true;
}

for (var k = 0; k < cloth1.bodies.length; k++) {
    cloth1.bodies[k].collisionFilter = {group: 0x0010, category: 0x0010, mask: 0x0010}
}

Composite.add(engine.world, cloth1);

var circl = Bodies.circle(pos.x, pos.y, 80, {mass: 1, render: {visible: true}});
var rect = Bodies.rectangle(pos.x + 60, pos.y, 80, 80, {mass: 1, render: {visible: true}});
// var circ2= Bodies.circle(pos.x+60, pos.y, 80,{mass: 1,render: { visible: true }});

// console.log("mass" +circl.mass);
// Matter.Body.setMass(circl,1);
// console.log("mass" +circl.mass);


var rope1 = Constraint.create({
    bodyA: cloth1.bodies[30],
    bodyB: circl,
    length: 0.5,
    damping: 0.01,
    stiffness: 0.01,
    render: {
        visible: true
    }
});
var rope2 = Constraint.create({
    bodyA: cloth1.bodies[35],
    bodyB: rect,
    length: 0.01,
    damping: 0.01,
    stiffness: 0.05,
    render: {
        visible: true
    }
});

Composite.add(engine.world, [circl, rope1, rect, rope2]);


// var softBody = SoftBody(pos.x, pos.y, 3, 5, 20, 20, true, 10, { friction: 0.001, frictionStatic: 0.1, render: { visible: true } }, { stiffness: 0.1, render: { lineWidth: 1 } });
// // putOnLeash(softBody, {x: matterContainer.clientWidth/2, y: matterContainer.clientHeight/2})
// Composite.add(engine.world, softBody);


// Matter.Events.on(engine, 'afterUpdate', function (event) {
//     var time = engine.timing.timestamp,
//         timeScale = (event.delta || (1000 / 60)) / 1000;
//
//
//     // Composite.translate(stack, {
//     //     x: Math.sin(time * 0.001) * 10 * timeScale,
//     //     y: 0
//     // });
//     //
//     // Composite.rotate(softBody, Math.sin(time * 0.001) * 0.75 * timeScale, {
//     //     x: 300,
//     //     y: 300
//     // });
//
//     // var scaler = 1+ (Math.sin(time * 0.001) * 0.35 * timeScale);
//     // var spriteScaler =  (1+Math.sin( time * 0.001)*0.5)*0.1;
//
//     // console.log("scaler is " + spriteScaler+ " and og scale is "+ scale);
//
//
//     for (var t = 0; t < letterInfo.members.length; t++) {
//         var letter = letterInfo.members[t];
//         if (letter.body != null) {
//             Matter.Body.setAngle(letterInfo.members[t].body, 0);
//             if (letter.isPointed) {
//                 console.log("pointed");
//                 letter.body.render.sprite.xScale = 2 * scale;
//                 letter.body.render.sprite.yScale = 2 * scale;
//                 Matter.Body.scale(letter.body, scale * 2, scale * 2, {
//                     x: letter.body.position.x,
//                     y: letter.body.position.y
//                 });
//             }
//             // else{
//             //     letter.body.render.sprite.xScale = scale;
//             //     letter.body.render.sprite.yScale = scale;
//             //     Matter.Body.scale(letter.body, scale,scale,  {x: letter.body.position.x, y:letter.body.position.y});
//             // }
//         }
//     }
//
//     // if (selctedBody!=null && selctedBody.body!=null){
//     //     selctedBody.body.render.sprite.xScale = scaler*0.2;
//     //     selctedBody.body.render.sprite.yScale = scaler*0.2;
//     //     Matter.Body.scale(selctedBody.body, scaler, scaler, {x: selctedBody.body.position.x, y:selctedBody.body.position.y});
//     //
//     //     // Matter.Body.scale(selctedBody.body, scale, scale)
//     // }
//
//     // if (selctedBody==null || selctedBody.body==null) return;
//     // Matter.Body.scale(selctedBody.body, scaler,scaler,  {x: selctedBody.body.position.x, y:selctedBody.body.position.y});
//     // console.log("scale is " + scaler);
//     // selctedBody.body.render.sprite.xScale = spriteScaler;
//     // selctedBody.body.render.sprite.yScale = spriteScaler;
// });

let mousepos = Vector.create(0, 0);

Matter.Events.on(mouseConstraint, 'mousemove', function (event) {
        //For Matter.Query.point pass "array of bodies" and "mouse position"
        mousepos = Vector.create(event.mouse.position.x, event.mouse.position.y)
    }
);

// Extract bodies from LettersInfo.members
var bodies = null;

// Then use this bodies array in your query

function searchTouches() {

    mousepos = mouse.position;
    if (mousepos === null) return;
    // console.log("searching touches at " + mousepos.x + " " + mousepos.y);
    if (!finishedBuildingWorld) return;
    if (bodies === null) {
        bodies = letterInfo.members.map(member => member.body);
    }
    var foundPhysics = Matter.Query.point(bodies, mousepos);
    letterInfo.members.forEach(member => {
        if (!hasCollided)Matter.Body.setAngle(member.body, 0);

        if (foundPhysics.includes(member.body)) {
            member.isPointedAt(true)
        } else {
            member.isPointedAt(false)
        }
    });
}

let searchTouch =setInterval(searchTouches, 30);








