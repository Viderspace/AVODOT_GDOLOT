// module aliases
var Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Vector = Matter.Vector;
//
//
// const MOBILE = 480;
// const SMALL_SCREEN = 900;
//
// const MEDIUM_SCREEN = 1199;
//
// function ResponsiveSize(client, mobile, small, medium, large) {
//     if (client < MOBILE) return mobile;
//     if (client < SMALL_SCREEN) return small;
//     if (client < MEDIUM_SCREEN) return medium;
//     return large;
// }
//
// let _firstLineY = 250;
// let _firstLineOffset = ResponsiveSize(container.clientWidth,
//     Vector.create(container.clientWidth - 20, _firstLineY),
//     Vector.create(container.clientWidth - 50, container.clientHeight / 3),
//     Vector.create(container.clientWidth - 50, container.clientHeight / 3),
//     Vector.create(container.clientWidth - 50, 500)
// );

function customCurve(x) {
    // x = Math.max(0, Math.min(1, x));
    if (x<0.75) return 2;
    return -1;


}

function smoothstep(min, max, value) {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

function elasticRise(t) {
    let x = Math.sin(-13 * (t - 1) * Math.PI / 2) * Math.pow(2, -10 * t)+1 ;
    console.log("elastic function -- t is " + t + " result is " + x);
    return x;
}

function easeOut(x) {
    return 1 - Math.pow(1 - x, 10);
}

class Letter {
    static members = [];

    constructor(width, height, path, spaceFromRight, yOffset, canCollide) {
        this.canCollide = canCollide ? 1 : 0;;
        this.spaceFromRight = spaceFromRight * ResponsiveScale;
        this.yOffset = yOffset * ResponsiveScale;
        this.width = width;
        this.height = height;
        this.path = path;
        this.makeBody(LettersManager.LineOffset)
        this.currentScale = scale;
        this.cooldown = 0;
        this.leash = null;
        this.timer = 0;
        this.animation = Letter.NONE;
        this.position = Vector.create(this.body.position.x, this.body.position.y);
        this.initSize = Math.sqrt(this.body.area) / this.width * this.height;
        this.initSpriteScale = this.body.render.sprite.yScale;
        this.currSpriteScale = this.initSpriteScale;

        Letter.members.push(this);

        // console.log("t=0, elasticRise(t) = " + elasticRise(0));
        // console.log("t=0.25, elasticRise(t) = " + elasticRise(0.25));
        // console.log("t=0.5, elasticRise(t) = " + elasticRise(0.5));
        // console.log("t=0.75, elasticRise(t) = " + elasticRise(0.75));
        // console.log("t=1, elasticRise(t) = " + elasticRise(1));

    }

    addDot(dotBody) {
        // console.log("Adding dot to " + this.path)
        // var body = this.body;
        // this.body = Body.create({
        //     parts: [body,dotBody]
        // });
        // Composite.add(engine.world, this.body)
    }


    makeBody(offset) {
        // console.log("making letter " + this.path);
        try {
            let imageDims = Vector.create(this.width, this.height);
            imageDims.x *= scale;
            imageDims.y *= scale;
            offset.x -= this.spaceFromRight;
            this.body = Bodies.rectangle(offset.x, offset.y + this.yOffset, imageDims.x * colliderShrinkFactor, imageDims.y * colliderShrinkFactor, {
                render: {
                    sprite: {
                        texture: this.path,
                        xScale: scale,
                        yScale: scale
                    }
                },

                isStatic: lettersAreStatic,
                isSensor: !this.CanCollide(),
                // collisionFilter: {
                //     mask: (this.canCollide() ? 0b0001 : 0b0010),
                // }
            });
            this.putOnLeash({x: offset.x, y: offset.y + this.yOffset});
            Composite.add(engine.world, this.body);


        } catch (e) {
            console.log(e);
        }
    }


    putOnLeash(position) {
        var anchor = {x: position.x, y: position.y};
        this.leash = Constraint.create({
            pointA: anchor,
            bodyB: this.body,
            // length: 2.5,
            stiffness: 0.001,
            damping: 1,
            render: {
                visible: showConstraints
            }
        });

        Composite.add(engine.world, this.leash);
    }

    CanCollide() {
        console.log("path is " + this.path + " can collide is " + this.canCollide )
        return this.canCollide > 0;
    }


    isTouched(isTouched) {
        this.currentlyTouched = isTouched;
    }



    update() {
        if (!this.canCollide) return;

        if (this.currentlyTouched) {
            // console.log("updating letter " + this.path)
            this.lastBeenTouched = 0;
            if (this.currSpriteScale >= Letter.MaxScaleFactor * this.initSpriteScale) {
                // No more Scaling up
                return;
            }
            this.animation = Letter.UP;
            this.inflate();
            return;
        }
        this.lastBeenTouched += DeltaTime;
        if (this.lastBeenTouched > Letter.CoolDownTime) {
            this.animation = Letter.DOWN;
            this.deflate();
        }

        if (this.animation !== Letter.UP) {
            this.rotateBack()
        }
    }

    rotateBack() {
        let angle = this.body.angle;
        let t = 0.5;
        // console.log(this.path + " angle is " + angle);

        if (angle < 0) {
            angle = smoothstep(0, angle, t)
        } else if (angle > 0) {
            angle = smoothstep(angle, 0, t)
        }
        Matter.Body.setAngle(this.body, angle);


    }

    static CoolDownTime = 0.5;
    static inflationDuration = 0.4;
    static inflationRate = 3;

    static deflationDuration = 15
    static deflationRate = 1


    static UP = 1;
    static  DOWN = -1;
    static NONE = 0;
    static MaxSize = 0.2;

    static MaxScaleFactor = 3;


    inflate() {
        if (this.animation !== Letter.UP) return;
        this.timer += DeltaTime;

        if (this.timer > Letter.inflationDuration) { // End of inflation
            this.currentlyTouched = false
            this.animation = Letter.NONE;
            this.timer = 0;
            this.cooldown = Letter.CoolDownTime;
            return;
        }



        let ratio =  this.timer / Letter.inflationDuration;
        var newScale = 1 + DeltaTime * ratio *Letter.MaxScaleFactor;
        Body.scale(this.body, newScale, newScale);
        this.scaleSprite();
    }


    deflate() {
        if (this.animation !== Letter.DOWN) return;
        // Matter.Body.setAngle(this.body, 0);

        if (this.currSize < this.initSize) {
            this.animation = Letter.NONE;
            this.timer = 0;
            return;
        }
        var newScale = 1 - (Letter.deflationRate * DeltaTime);
        Body.scale(this.body, newScale, newScale);
        this.scaleSprite();
    }

    scaleSprite() {
        // console.log("body area "+ this.body.area + " w*h:" + this.width * this.height);

        this.currSize = Math.sqrt(this.body.area) / this.width * this.height;
        // console.log("this.body.area is " + this.body.scale )
        // console.log("sprite current scale is "+ this.currSpriteScale + " init:" + this.initSpriteScale);
        let spriteNewScale = (this.currSize / this.initSize) * this.initSpriteScale;
        this.currSpriteScale = spriteNewScale;
        // let spriteNewScale = (this.currSize/ this.initSize) * scale

        this.body.render.sprite.xScale = spriteNewScale;
        this.body.render.sprite.yScale = spriteNewScale;
    }
}




