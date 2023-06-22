function nav() {
	const toggle = document.querySelector('.header__nav-toggle');

	toggle.addEventListener('click', function() {
		this.classList.toggle('header__nav-toggle--close');
	})
}

window.addEventListener('load', () => {
	nav();
});
