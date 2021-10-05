class Vec2 {
	constructor(x, y) {
		this.x = x || 0
		this.y = y || 0
	}
	create() {
		return new Vec2()
	}
	length(v) {
		return Math.sqrt(v.x * v.x + v.y * v.y)
	}
	setLength(v, l, out) {
		let s = this.length(v)
		if (s > 0.0) {
			s = l / s
			out.x = v.x * s
			out.y = v.y * s
		}
		else {
			out.x = l
			out.y = 0.0
		}
	}
	normalize(v, out) {
		this.setLength(v, 1.0, out)
	}
	toArray(v) {
		return [v.x, v.y]
	}
}

class Vec3 {
	constructor(x, y, z) {
		this.x = x || 0
		this.y = y || 0
		this.z = z || 0
	}

	create(x, y, z) {
		return new Vec3(x, y, z)
	}
	length(v) {
		return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
	}

	setLength(v, l, out) {
		let s = this.length(v)
		if (s > 0.0) {
			s = l / s
			out.x = v.x * s
			out.y = v.y * s
			out.z = v.z * s
		} else {
			out.x = l
			out.y = 0.0
			out.z = 0.0
		}
	}

	normalize(v, out) {
		this.setLength(v, 1.0, out)
	}

	dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z
	}

	cross(a, b, out) {
		const ax = a.x, ay = a.y, az = a.z,
			bx = b.x, by = b.y, bz = b.z
		out.x = ay * bz - az * by
		out.y = az * bx - ax * bz
		out.z = ax * by - ay * bx
	}
	toArray(v) {
		return [v.x, v.y, v.z]
	}
	clone(v) {
		return this.create(v.x, v.y, v.z)
	}
}

class Color {
	constructor(r, g, b) {
		this.r = r || 0
		this.g = g || 0
		this.b = b || 0
	}
	create(r, g, b) {
		return new Color(r, g, b)
	}
	toArray(c) {
		return [c.r, c.g, c.b]
	}
}
const vec2 = new Vec2()
const vec3 = new Vec3()
const color = new Color()
export { vec2, vec3, color }