"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MeshType;
(function (MeshType) {
    MeshType["Custom"] = "Custom";
    MeshType["Square"] = "Square";
    MeshType["Circle"] = "Circle";
    MeshType["Rect"] = "Rectangle";
})(MeshType || (MeshType = {}));
var Mesh = /** @class */ (function () {
    function Mesh() {
    }
    return Mesh;
}());
module.exports = { Mesh: Mesh, MeshType: MeshType };
