const noJs = document.querySelector('.no-js');
noJs.classList.remove('no-js');

function setYear() {
	new Date().getFullYear();
	const yearElem = document.querySelectorAll('.ryear');

	for (let i = 0; i < yearElem.length; i++) {
		yearElem[i].innerText = new Date().getFullYear();
	}
}

function nav() {
	const toggle = document.querySelector('.header__nav-toggle');
	const headerList = document.querySelector('.header__list');
	const toggleText = document.querySelector('.header__nav-toggle span');

	function initNav() {
		if (window.innerWidth >= 575) {
			toggle.classList.add('header__nav-toggle--close');
			headerList.style.display = '';
			toggle.removeAttribute('aria-controls', 'menu');
			toggle.removeAttribute('aria-haspopup', true);
			headerList.removeAttribute('aria-labelledby', 'menubutton');
		} else {
			toggle.classList.add('header__nav-toggle--close');
			headerList.style.display = 'none';
			toggle.setAttribute('aria-controls', 'menu');
			toggle.setAttribute('aria-haspopup', true);
			headerList.setAttribute('aria-labelledby', 'menubutton');
		}
	}

	initNav();

	function openNav() {
		headerList.style.display = '';

		window.setTimeout(function() {
			toggle.classList.remove('header__nav-toggle--close');
			toggle.setAttribute('aria-expanded', true);
			toggleText.innerText = 'Закрыть меню';
		}, 10);

		listener();
	}

	function closeNav() {
		toggle.classList.add('header__nav-toggle--close');
		toggleText.innerText = 'Открыть меню';
		window.setTimeout(function() {
			headerList.style.display = 'none';
			toggle.setAttribute('aria-expanded', false);
		}, 250);
	}

	window.addEventListener('resize', function() {
		initNav();
	});

	toggle.addEventListener('click', function() {
		if (toggle.classList.contains('header__nav-toggle--close')) {
			openNav();
		} else {
			closeNav();
		}
	});

	headerList.addEventListener('click', function(e) {
		if (e.target.nodeName == 'A' && window.innerWidth <= 575) {
			closeNav();
		}
	});

	function listener() {
		function listenerKey(e) {
			if (e.key == 'Escape') {
				closeNav();
				window.removeEventListener('keydown', listenerKey);
			}
		}
		window.addEventListener('keydown', listenerKey);
	}
}

window.addEventListener('load', () => {
	setYear();
	nav();
});
