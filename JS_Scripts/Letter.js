// module aliases
var Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Events = Matter.Events,
    Constraint = Matter.Constraint;

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
                isSensor: this.canCollide,
                collisionFilter: {
                    category: (this.canCollide ? 0x0001 : 0x0010),
                }
            });
            this.putOnLeash({x: offset.x, y: offset.y + this.yOffset});
            Composite.add(engine.world, this.body);


        } catch (e) {
            console.log(e);
            console.log("path: " + this.path);
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
                visible: false
            }
        });

        Composite.add(engine.world, this.leash);
    }


    isPointedAt(value) {
        if (this.body === null) return;
        if (value === this.isPointed) return;
        if (value) {
            if (!this.isPointed) {

                this.body.render.sprite.xScale = inflateScale * scale;
                this.body.render.sprite.yScale = inflateScale * scale;
                Matter.Body.scale(this.body, inflateScale, inflateScale, {
                    x: this.body.position.x,
                    y: this.body.position.y
                });
                this.isPointed = value;
            }
            this.timer = 0;
        } else { // not pointed
            this.timer += 100;
            if (!this.isPointed) return;
            if (this.timer > 2000) {
                this.body.render.sprite.xScale = scale;
                this.body.render.sprite.yScale = scale;
                Matter.Body.scale(this.body, 1 / inflateScale, 1 / inflateScale, {
                    x: this.body.position.x,
                    y: this.body.position.y
                });
                this.isPointed = value;
            }
        }
    }


    isTouched(isTouched) {
        this.currentlyTouched = isTouched;
    }


    updateTime() {
        if (!this.canCollide)return;
        if (this.currentlyTouched) {
            this.lastBeenTouched = 0;
            this.animation = Letter.UP;
            this.inflate();
            // this.scaleSprite(this.Scale + inflationSpeed);
        } else {
            this.lastBeenTouched++;
            if (this.lastBeenTouched > Letter.inflationDuration) {
                this.animation = Letter.DOWN;
                this.deflate();
            }
        }
    }

    static inflationDuration = 5;
    static inflationRate = 10;

    static deflationDuration = 15
    static deflationRate = 1


    static UP = 1;
    static  DOWN = -1;
    static NONE = 0;
    static MaxSize = 0.2

    inflate() {
        if (this.currSpriteScale > Letter.MaxSize) return;
        if (this.animation !== Letter.UP  ) return;
        if (this.timer > Letter.inflationRate) {
            this.animation = Letter.NONE;
            this.timer = 0;
            return;
        }

        this.timer ++;
        var timeScale = (engine.timing.delta || (1000 / 60)) / 1000;
        var newScale = 1 + (Letter.inflationDuration * timeScale);
        Body.scale(this.body, newScale, newScale);
        this.scaleSprite();


    }

    deflate() {
        if (this.animation !== Letter.DOWN) return;

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
        if ( isNaN(spriteNewScale)) return;
        console.log(spriteNewScale)
        this.body.render.sprite.xScale = spriteNewScale;
        this.body.render.sprite.yScale = spriteNewScale;
    }




    _scaleSprite(newScale) {
        this.currSize = Math.sqrt(this.body.area) / this.width * this.height;

        // this.currentScale =  newScale >= inflateScale ? inflateScale : newScale <= scale ? scale : 1+inflationSpeed;
        this.currentScale += newScale
        this.body.render.sprite.xScale = this.currentScale;
        this.body.render.sprite.yScale = this.currentScale;


        // var currSize = Math.sqrt(this.body.area) / this.width * this.height;
        console.log(this.path + " currentSize: " + this.currSize);


        // var scale = 1 + (this.isHover ? Letter.inflationSpeed : -Letter.inflationSpeed);


        // if (currSize < Letter.minScale || currSize > Letter.maxScale) {
        //     scale = 1;
        // }
        // if (currSize < Letter.minScale && this.Scale < prevScale) {
        //     return
        // } else if (currSize > Letter.maxScale && this.Scale > prevScale) {
        //     return;
        // }

        // Body.scale(this.body,  this.currentScale, this.currentScale, Vector.create(this.body.position.x, this.body.position.y));
        // this.Body.render.sprite.xScale = scale * this.baseScale;
        // this.Body.render.sprite.yScale = scale * this.baseScale;
    }
}




