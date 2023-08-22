var World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Body = Matter.Body


class Letter {
    static avodotGdolotSvg = {
        aain: 'SVG Letters/Asset 2.svg',
        bet : "SVG Letters/Asset 3.svg",
        vav : "SVG Letters/Asset 4.svg",
        daled : "SVG Letters/Asset 5.svg",
        vav2 : "SVG Letters/Asset 6.svg",
        taf : "SVG Letters/Asset 7.svg",
        circWhite1 : "SVG Letters/Asset 8.svg",
        gimel : "SVG Letters/Asset 9.svg",
        daled2 : "SVG Letters/Asset 10.svg",
        circGreen : "SVG Letters/Asset 11.svg",
        vav3 : "SVG Letters/Asset 12.svg",
        lamed : "SVG Letters/Asset 13.svg",
        vav4 : "SVG Letters/Asset 14.svg",
        taf2 : "SVG Letters/Asset 15.svg",
        circWhite2 : "SVG Letters/Asset 16.svg",
    };

    static maxScale = 3;
    static minScale = 1;
    static inflationSpeed = 0.05;

    constructor(x, y, size, letter) {
        this.baseScale = size/512;
        this.Body = Bodies.rectangle(x, y, size, size,
            {
                friction: 0.00001,
                frictionAir: 0.00001,
                render: {
                    sprite: {
                        texture: Letter.pathDict[letter],
                        xScale: this.baseScale,
                        yScale: this.baseScale
                    },
                },
                wireframes: isWireframe,
            });

        this.constraint = Constraint.create({
            pointA: { x: x, y: y },
            bodyB: this.Body,
            pointB: { x: 0, y: 0 },
            stiffness: 0.001,
            damping: 0.5,

        });

        this.spriteSize = size;
        this.Scale = 1.0;
        this.hoverTime = 0;
        this.isHover = false;

        World.add(engine.world, [this.Body, this.constraint]);
    }

    inflateSprite() {
        this.hoverTime = 0;
        this.scaleSprite(1.5);


    }

    tick(){
        if (this.isHover) {
            this.hoverTime = 0;
            this.scaleSprite(this.Scale + Letter.inflationSpeed);
            return;
        }
        this.hoverTime++;
        if (this.hoverTime > 10) {
            this.scaleSprite(this.Scale - Letter.inflationSpeed );
        }
    }


    scaleSprite(newScale) {
        var prevScale = this.Scale;
        this.Scale = newScale >= Letter.maxScale ? Letter.maxScale : newScale <= Letter.minScale ? Letter.minScale : newScale;
        this.Body.render.sprite.xScale = this.Scale * this.baseScale;
        this.Body.render.sprite.yScale = this.Scale * this.baseScale;


        var currSize = Math.sqrt(this.Body.area) / this.spriteSize;
        if (newScale >= 2 || newScale <= Letter.minScale) {return;}

        var scale =1 + (this.isHover ? Letter.inflationSpeed : -Letter.inflationSpeed);
        // if (currSize < Letter.minScale || currSize > Letter.maxScale) {
        //     scale = 1;
        // }
        // if (currSize < Letter.minScale && this.Scale < prevScale) {
        //     return
        // } else if (currSize > Letter.maxScale && this.Scale > prevScale) {
        //     return;
        // }


        Body.scale(this.Body, scale, scale, {x: this.Body.position.x, y: this.Body.position.y});
        // this.Body.render.sprite.xScale = scale * this.baseScale;
        // this.Body.render.sprite.yScale = scale * this.baseScale;
    }
}




