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


class Letter {
    static members = [];

    constructor(width, height, path, spaceFromRight = 0, yOffset = 0, canCollide = true) {
        this.spaceFromRight = spaceFromRight * ResponsiveScale;
        this.yOffset = yOffset * ResponsiveScale;
        this.width = width;
        this.height = height;
        this.path = path;
        this.makeBody(LettersManager.LineOffset)
        this.currentScale = scale;
        this.leash = null;
        this.canCollide = canCollide;
        this.isPointed = false;
        this.timer = 0;
        this.animation = Letter.NONE;
        this.position = Vector.create(this.body.position.x, this.body.position.y);
        this.initSize = Math.sqrt(this.body.area) / this.width * this.height;
        this.initSpriteScale = this.body.render.sprite.yScale;

        Letter.members.push(this);

    }

    addDot(dotBody){
        // console.log("Adding dot to " + this.path)
        // var body = this.body;
        // this.body = Body.create({
        //     parts: [body,dotBody]
        // });
        // Composite.add(engine.world, this.body)
    }


    makeBody(offset) {
        console.log("making letter " + this.path);
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
                isSensor: this.canCollide(),
                collisionFilter: {
                    category: (this.canCollide ? 0x0001 : 0x0010),
                }
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
            damping: 0.5,
            render: {
                visible: showConstraints
            }
        });

        Composite.add(engine.world, this.leash);
    }

    canCollide(){return this.yOffset <-190*ResponsiveScale;}



    isTouched(isTouched) {
        this.currentlyTouched = isTouched;
    }


    update() {
        if (!this.canCollide)return;
        if (this.currentlyTouched) {
            this.lastBeenTouched = 0;
            this.animation = Letter.UP;
            this.inflate();
        } else {
            this.lastBeenTouched++;
            if (this.lastBeenTouched > Letter.inflationDuration) {
                this.animation = Letter.DOWN;
                this.deflate();
            }
        }
        if (this.lastBeenTouched> 50){
            this.rotateBack()
        }
    }

    rotateBack(){
        let angle = this.body.angle;
        if (Math.abs(angle) >1){
            angle =angle + angle < 0 ? 1:-1;
            Matter.Body.setAngle(this.body, angle);

        }
    }

    static inflationDuration = 50;
    static inflationRate = 15;

    static deflationDuration = 15
    static deflationRate = 1


    static UP = 1;
    static  DOWN = -1;
    static NONE = 0;
    static MaxSize = 0.2

    inflate() {
        // if (this.currSpriteScale > Letter.MaxSize) return;
        if (this.animation !== Letter.UP  ) return;
        this.currentlyTouched = false
        if (this.currSpriteScale > Letter.MaxSize) {
            this.animation = Letter.NONE;
            this.timer = 0;
            return;
        }

        this.timer ++;
        var timeScale = (engine.timing.delta || (1000 / 60)) / 1000;
        var newScale = 1 + (Letter.inflationRate * timeScale);
        Body.scale(this.body, newScale, newScale);
        this.scaleSprite();


    }

    deflate() {
        if (this.animation !== Letter.DOWN) return;
        Matter.Body.setAngle(this.body, 0);

        if (this.currSize < this.initSize) {
            this.animation = Letter.NONE;
            this.timer = 0;
            return;
        }

        var timeScale = (engine.timing.delta || (1000 / 60)) / 1000;
        var newScale = 1 - (Letter.deflationRate * timeScale);
        Body.scale(this.body, newScale, newScale);
        this.scaleSprite();
    }

    scaleSprite(){
        this.currSize = Math.sqrt(this.body.area) / this.width * this.height;

        let spriteNewScale = (this.currSize/ this.initSize) * this.initSpriteScale;
        this.currSpriteScale = spriteNewScale;
        // let spriteNewScale = (this.currSize/ this.initSize) * scale

        this.body.render.sprite.xScale = spriteNewScale;
        this.body.render.sprite.yScale = spriteNewScale;
    }
}




