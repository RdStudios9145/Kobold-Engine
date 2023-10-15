enum MeshType {
	Custom = "Custom",
	Square = "Square",
	Circle = "Circle",
	Rect = "Rectangle",
}

class Mesh {
	meshType: MeshType;
	verts: Vec2[];
	triangles: Int32Array;
}

module.exports = { Mesh, MeshType };