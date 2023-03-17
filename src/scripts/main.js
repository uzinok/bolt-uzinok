function setYear() {
	new Date().getFullYear();
	const yearElem = document.querySelectorAll('.ryear');

	for (let i = 0; i < yearElem.length; i++) {
		yearElem[i].innerText = new Date().getFullYear();
	}
}

window.addEventListener('load', () => {
	setYear();
})
