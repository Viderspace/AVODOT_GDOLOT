//  class LettersGenerator {
//     static SVG_WIDTH_PERCENTAGE = 0.5;
//     static SVG_WIDTH_IN_PIXELS = 256;
//
//     constructor() {
//         const matterContainer = document.getElementById('matter-container');
//         this.avodotGdolotSvgs = new Map();
//         this.avodotGdolotSvgs.set('aain', 'Assets/SVG Letters/Asset 19.svg');
//         this.lettersAmount = Object.keys(this.avodotGdolotSvgs).length;
//         this.windowWidth = matterContainer.clientWidth;
//         this.windowHeight = matterContainer.clientHeight;
//     }
//

//
//
//
//     scaleVertices(vertices, scaleFactor = -1) {
//         if (scaleFactor === -1) {
//             scaleFactor = windowWidth * SVG_WIDTH_PERCENTAGE / SVG_WIDTH_IN_PIXELS;
//         }
//         vertices = Vertices.scale(vertices, scaleFactor, scaleFactor);
//         return vertices;
//     }
//
//
//
//     createSVGBodies() {
//         for (var i = 0; i < this.lettersAmount; i++) {
//             let path = this.avodotGdolotSvgs.values[i];
//             let vertices = SVG.pathToVertices(path);
//             if (vertices === undefined) {
//                 throw new Error("vertices is undefined");
//             }
//             vertices = scaleVertices(vertices);
//             for (let j = 0; j < vertices; j++) {
//                 console.log("v");
//                 console.log(vertices[j]);
//
//             }
//             let letterBody = Bodies.fromVertices(windowWidth / 2, windowHeight / 2, [vertices],
//                 {
//                     render: {
//                         fillStyle: 'red',
//                         borderWidth: 1,
//                         strokeStyle: 'white',
//                     }
//                 });
//             Composite.add(engine.world, letterBody);
//         }
//     }
// }
//
