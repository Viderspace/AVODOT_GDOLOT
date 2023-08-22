
var   Vector = Matter.Vector;

    class ResponsiveVector{
        //
        // static ScreenType = {
        //     MOBILE_SIZE: "mobile-size",
        //     SMALL: "small",
        //     MEDIUM: "medium",
        //     BIG: "big",
        // }

        static MOBILE_THRESHOLD = 480;
        static SMALL_SCREEN_THRESHOLD = 900;
        static MEDIUM_SCREEN_THRESHOLD = 1200;

        constructor(clientWidth, mobileDim, smallDim, mediumDim, bigDim) {
            this.dims = Vector.create(0,0);
            this.currentScreenType = this.getScreenType(clientWidth);

            if (width <= ResponsiveVector.MOBILE_THRESHOLD)
                this.dims = mobileDim;

            else if (width > MOBILE_THRESHOLD && width <= ResponsiveVector.SMALL_SCREEN_THRESHOLD)
                this.dims = smallDim;

            else if (width > ResponsiveVector.SMALL_SCREEN_THRESHOLD && width <= ResponsiveVector.MEDIUM_SCREEN_THRESHOLD)
                this.dims = mediumDim;

            else this.dims = bigDim;
        }

        get(){return this.dims;}

        // getScreenType(width) {
        //     if (width <= ResponsiveVector.MOBILE_THRESHOLD)
        //         return ResponsiveVector.ScreenType.MOBILE_SIZE;
        //
        //     else if (width > MOBILE_THRESHOLD && width <= ResponsiveVector.SMALL_SCREEN_THRESHOLD)
        //         return ResponsiveVector.ScreenType.SMALL;
        //
        //     else if (width > ResponsiveVector.SMALL_SCREEN_THRESHOLD && width <= ResponsiveVector.MEDIUM_SCREEN_THRESHOLD)
        //         return ResponsiveVector.ScreenType.MEDIUM;
        //
        //      else return ResponsiveVector.ScreenType.BIG;
        // }
}