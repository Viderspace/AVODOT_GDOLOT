
const MOBILE = 480;
const SMALL_SCREEN = 900;
const MEDIUM_SCREEN = 1199;

var Composite = Matter.Composite,
    Vector = Matter.Vector,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Common = Matter.Common;

const container = document.getElementById("matter-container");

function ResponsiveSize(client, mobile, small, medium, large) {
    if (client < MOBILE) return mobile;
    if (client < SMALL_SCREEN) return small;
    if (client < MEDIUM_SCREEN) return medium;
    return large;
}


let firstLineY = 250;
let firstLineOffset = ResponsiveSize(container.clientWidth,
    Vector.create(container.clientWidth - 20, firstLineY),
    Vector.create(container.clientWidth - 50, container.clientHeight / 3),
    Vector.create(container.clientWidth - 50, container.clientHeight / 3),
    Vector.create(container.clientWidth - 50, 500)
);


let secondLineY = firstLineY + 120;
let secondLineOffset = ResponsiveSize(container.clientWidth,
    Vector.create(container.clientWidth - 20, secondLineY),
    Vector.create(container.clientWidth - 50, secondLineY),
    Vector.create(container.clientWidth - 50, 100 + container.clientHeight / 3),
    Vector.create(container.clientWidth - 50, 50 + 500)
);

// let thirdLineY = secondLineY + 350;
// let thirdLineOffset = ResponsiveSize(container.clientWidth,
//     Vector.create(container.clientWidth - 20, thirdLineY),
//     Vector.create(container.clientWidth - 50, thirdLineY + container.clientHeight / 3),
//     Vector.create(container.clientWidth - 50, thirdLineY + container.clientHeight / 3),
//     Vector.create(container.clientWidth - 50, thirdLineY + 500)
// );
//
// let fourthLineY = thirdLineY + 120;
// let fourthLineX = 130;
// let fourthLineOffset = ResponsiveSize(container.clientWidth,
//     Vector.create(container.clientWidth - fourthLineX, fourthLineY),
//     Vector.create(container.clientWidth - 50, fourthLineY + container.clientHeight / 3),
//     Vector.create(container.clientWidth - 50, fourthLineY + container.clientHeight / 3),
//     Vector.create(container.clientWidth - 50, fourthLineY + 500)
// );


let ResponsiveScale = ResponsiveSize(container.clientWidth, 0.4, 0.5, 1.3, 1.6);
let scale = ResponsiveScale * 0.2;
var colliderShrinkFactor = 0.85;


let inflateScale = 2


 class LettersManager {

     letters =[];
     bodies =[];

     static LineOffset = firstLineOffset;
     static LineY = firstLineY;

     GetLetters(){return this.letters;}
     GetBodies(){return this.bodies;}

    AddLine(line) {

        for (let i = 0; i < line.length; i++) {
            this.letters.push(line[i]);
            this.bodies.push(line[i].body);
            if (line[i].canCollide){
                console.log("adding letter " + line[i].path + " to colliders")
                line[i].body.isSensor = false;
            }else {
                console.log("adding letter " + line[i].path + " to non-colliders")
                line[i].body.isSensor = true;
            }

            // if (i >0){
            //     this.tieNeighbors(line[i-1].body, line[i].body);
            //     // { stiffness: 0.2, render: { type: 'line', anchors: false }}
            // }

            // if (line[i].body == null) console.log("no body for " + line[i].path)
            // else Composite.add(engine.world, line[i].body);
        }
    }


     tieNeighbors(letter1, letter2) {
         let rope = Constraint.create({
             bodyA: letter1,
             bodyB: letter2,
             stiffness: 0.01,
             damping: 0.1,
             render: {
             }
         });

         Composite.add(engine.world, rope);
     }

    constructor(render1, render2) {

        this.line1 = [
            new Letter(1154, 1468, "Assets/עבודות_גדולות_אותיות/ע.png", 0), // const ע = { width: 1154, height: 1468 };
            new Letter(1030, 1458, "Assets/עבודות_גדולות_אותיות/ב.png", 230), // const ב = { width: 1030, height: 1458 };
            new Letter(480, 1469, "Assets/עבודות_גדולות_אותיות/ו1.png", 160),// const ו1 = { width: 480, height: 1469 };
            new Letter(466, 478, "Assets/עבודות_גדולות_אותיות/נק1.png", 0, -200, false), // const נק1 = { width: 466, height: 478 };
            new Letter(1027, 1472, "Assets/עבודות_גדולות_אותיות/ד1.png", 160), // const ד1 = { width: 1027, height: 1472 };
            new Letter(508, 1450, "Assets/עבודות_גדולות_אותיות/ו2.png", 160),// const ו2 = { width: 508, height: 1450 };
            new Letter(466, 478, "Assets/עבודות_גדולות_אותיות/נק2.png", 0, -200, false), // const נק2 = { width: 466, height: 478 };
            new Letter(1104, 1482, "Assets/עבודות_גדולות_אותיות/ת1.png", 173), // const ת1 = { width: 1104, height: 1482 };
        ];

        LettersManager.LineOffset = secondLineOffset;
        LettersManager.LineY = secondLineY;


        this.line2 = [
            new Letter(773, 1421, "Assets/עבודות_גדולות_אותיות/ג.png", 0), // const ג = { width: 773, height: 1421 };
            new Letter(1128, 1397, "Assets/עבודות_גדולות_אותיות/ד2.png", 185), // const ד2 = { width: 1128, height: 1397 };
            new Letter(455, 1383, "Assets/עבודות_גדולות_אותיות/ו3.png", 170), // const ו3 = { width: 455, height: 1383 };
            new Letter(478, 490, "Assets/עבודות_גדולות_אותיות/נק-ירוק1.png", 0, -200, false), // const נק-ירוק1 = { width: 478, height: 490 };
            new Letter(1069, 1793, "Assets/עבודות_גדולות_אותיות/ל.png", 160, -30), // const ל = { width: 1069, height: 1793 };
            new Letter(442, 1420, "Assets/עבודות_גדולות_אותיות/ו4.png", 160), // const ו4 = { width: 442, height: 1420 };
            new Letter(482, 490, "Assets/עבודות_גדולות_אותיות/נק-ירוק2.png", 0, -200, false), // const נק-ירוק2 = { width: 482, height: 490 };
            new Letter(1235, 1438, "Assets/עבודות_גדולות_אותיות/ת2.png", 180), // const ת2 = { width: 1235, height: 1438 };
            new Letter(1403, 66, "Assets/קול_קורא_אותיות/פתיחת_שנה_טקסט.png", -600, 300, false), // const פתיחת_שנה_טקסט = { width: 1403, height: 66 };
        ];
        // this.line3 = [
        //     new Letter(1431, 2035, "Assets/קול_קורא_אותיות/שחור_ק1.png", 0), // const שחור_ק1 = { width: 1431, height: 2035 };
        //     new Letter(493, 1452, "Assets/קול_קורא_אותיות/שחור_ו1.png", 200, -60), // const שחור_ו1 = { width: 493, height: 1452 };
        //     new Letter(447, 447, "Assets/קול_קורא_אותיות/נק5.png", 0, -260, false), // const נק5 = { width: 447, height: 447 };
        //     new Letter(1223, 1817, "Assets/קול_קורא_אותיות/שחור_ל.png", 180, -95), // const שחור_ל = { width: 1223, height: 1817 };
        // ];
        //
        // this.line4 = [
        //     new Letter(1248, 2013, "Assets/קול_קורא_אותיות/שחור_ק2.png", 0), // const שחור_ק2 = { width: 1248, height: 2013 };
        //     new Letter(390, 1441, "Assets/קול_קורא_אותיות/שחור_ו2.png", 170, -60), // const שחור_ו2 = { width: 390, height: 1441 };
        //     new Letter(447, 436, "Assets/קול_קורא_אותיות/נק_אדום.png", 0, -260, false), // const נק_אדום = { width: 447, height: 436 };
        //     new Letter(1053, 1462, "Assets/קול_קורא_אותיות/שחור_ר.png", 150, -60), // const שחור_ר = { width: 1053, height: 1462 };
        //     new Letter(1350, 1453, "Assets/קול_קורא_אותיות/שחור_א.png", 220, -60), // const שחור_א = { width: 1350, height: 1453 };
        //     new Letter(447, 436, "Assets/קול_קורא_אותיות/אוצרים_אדם_נגה_טקסט.png", -130, 40, false), // const נק_אדום = { width: 447, height: 436 };
        // ];


// const אוצרים_אדם_נגה_טקסט = { width: 318, height: 481 };
// const פתיחת_שנה_טקסט = { width: 1403, height: 66 };



        this.AddLine(this.line1);

        this.AddLine( this.line2);
        // for(let i = 0; i < Math.min(this.line2.length, this.line1.length); i++){
        //     this.tieNeighbors(this.line1[i].body, this.line2[i].body);
        //
        // }
    }




}