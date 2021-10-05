function nrand() {
	return Math.random() * 2.0 - 1.0
}
function pmod (n, m) {
	return ((n % m + m) % m)
}
export {nrand, pmod}