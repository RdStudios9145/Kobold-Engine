class MeshRenderer {
	mesh: Mesh;
	transform: Transform;
	context: CanvasRenderingContext2D;

	Startup() {
		Kobold.requireComponent(Mesh);
		this.mesh = Kobold.getComponent(Mesh);
		this.transform = Kobold.getComponent(Transform);
		this.context = Kobold.getRenderContext();
	};

	Render() {
		var translation = this.transform.translation;
		var scale = this.transform.scale;
		if (this.mesh.meshType === MeshType.Circle) {
			this.context.beginPath();
			this.context.arc(translation.x, translation.y, scale.x, 0, Math.PI * 2);
			this.context.fill();
			return;
		}
		if (this.mesh.meshType === MeshType.Rect || this.mesh.meshType === MeshType.Square) {
			var scaleY = this.mesh.meshType === MeshType.Rect ? scale.y : scale.x;
			this.context.fillRect(translation.x, translation.y, scale.x, scaleY);
			return;
		}
		for (var i = 0; i < this.mesh.triangles.length / 3; i++) {
			this.context.save();
			this.context.translate(translation.x, translation.y);
			this.context.beginPath();
			this.context.moveTo(this.mesh.verts[3 * i].x, this.mesh.verts[3 * i].y);
			this.context.lineTo(this.mesh.verts[3 * i + 1].x, this.mesh.verts[3 * i + 1].y);
			this.context.lineTo(this.mesh.verts[3 * i + 2].x, this.mesh.verts[3 * i + 2].y);
			this.context.fill();
			this.context.reset();
		}
	};
}

module.exports = MeshRenderer;