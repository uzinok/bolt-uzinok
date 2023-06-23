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

	function openNav() {
		headerList.style.display = '';

		window.setTimeout(function() {
			toggle.classList.remove('header__nav-toggle--close');
			toggleText.innerText = 'Закрыть меню';
		}, 10);

		listener();
	}

	function closeNav() {
		toggle.classList.add('header__nav-toggle--close');
		toggleText.innerText = 'Открыть меню';
		window.setTimeout(function() {
			headerList.style.display = 'none';
		}, 250);
	}

	window.addEventListener('resize', function() {
		if (window.innerWidth >= 768) {
			toggle.classList.add('header__nav-toggle--close');
			headerList.style.display = '';
		} else {
			toggle.classList.add('header__nav-toggle--close');
			headerList.style.display = 'none';
		}
	});

	toggle.addEventListener('click', function() {
		if (toggle.classList.contains('header__nav-toggle--close')) {
			openNav();
		} else {
			closeNav();
		}
	});

	headerList.addEventListener('click', function(e) {
		if (e.target.nodeName == 'A') {
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

	closeNav();
}

window.addEventListener('load', () => {
	setYear();
	nav();
});
