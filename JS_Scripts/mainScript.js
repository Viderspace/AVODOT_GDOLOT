// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Constraint = Matter.Constraint;

const showWireframes = false;
const lettersAreStatic = false;

const container1 = document.getElementById("matter-container");

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0.1;

// create a renderer
var render1 = Render.create({
    element: container1,
    engine: engine,
    options: {
        width: container1.clientWidth,
        height: container1.clientHeight,
        background: "transparent",
        wireframes: showWireframes,
        showAngleIndicator: false
    }
});


let mouse = Matter.Mouse.create(render1.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

// Composite.add(engine.world, mouseConstraint);

// allow scroll through the canvas
// mouseConstraint.mouse.element.removeEventListener(
//     "mousewheel",
//     mouseConstraint.mouse.mousewheel
// );
// mouseConstraint.mouse.element.removeEventListener(
//     "DOMMouseScroll",
//     mouseConstraint.mouse.mousewheel
// );




// run the renderer
Render.run(render1);

// create runner
var runner = Runner.create();


// run the engine
Runner.run(runner, engine);
engine.positionIterations = 10;

function handleResize(container1) {
    // set canvas size to new values
    render1.canvas.width = container1.clientWidth;
    render1.canvas.height = container1.clientHeight;
}



window.addEventListener("resize", () => handleResize(container1));



// window.addEventListener("touchstart", function (event) {
//     invokeCollision();
// });

let mousepos = Vector.create(0, 0);

Matter.Events.on(mouseConstraint, 'mousemove', function (event) {
        //For Matter.Query.point pass "array of bodies" and "mouse position"
        mousepos = Vector.create(event.mouse.position.x, event.mouse.position.y)
    }
);

Matter.Events.on(mouseConstraint, "mouseup", function (event) {
        //For Matter.Query.point pass "array of bodies" and "mouse position"
        mousepos = Vector.create(0, 0)
    }
);
Matter.Events.on(mouseConstraint, "touchend", function (event) {
        //For Matter.Query.point pass "array of bodies" and "mouse position"
        mousepos = Vector.create(0, 0)
    }
);




let lettersManager = new LettersManager(render1, null);
let letters = lettersManager.GetLetters();
let bodies = lettersManager.GetBodies();


function scanUserTouches(){
    if (letters === null) return;
    return  Matter.Query.point(bodies, mousepos);
}

function setStraightAngle(body) {
    // Matter.Body.setAngle(body, 0);

}

function searchTouches() {

    mousepos = mouse.position;
    if (mousepos === null) return;
    if (letters === null) letters = lettersManager.GetLetters();

    if (mousepos.x === 0 && mousepos.y === 0) {
        letters.forEach(letterObj => {
                setStraightAngle(letterObj.body);
                letterObj.isTouched(false)
        });
    }

    let currentlyTouched = scanUserTouches();

    letters.forEach(letterObj => {
        if (true) { // Replace with "if letterObj is not inflated"
            setStraightAngle(letterObj.body);
        }
        var letterIsTouched = currentlyTouched.includes(letterObj.body);
        letterObj.isTouched(letterIsTouched)
    });
}

let searchTouch = setInterval(searchTouches, 50);

Matter.Events.on(runner, "afterTick", function (event) {
        letters.forEach(letterObj => {
        letterObj.update();

    });
})

// function updatePhysics(){
//     letters.forEach(letterObj => {
//         letterObj.updateTime();
//     });
// }
//
// let updatePhysicsInterval = setInterval(updatePhysics, 20);
//
//






