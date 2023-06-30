const noJs = document.querySelector('.no-js');
noJs.classList.remove('no-js');

const isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

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

function abbr() {
	const titles = document.querySelectorAll('[title]');

	for (let i = 0; i < titles.length; i++) {
		const title = titles[i];

		title.setAttribute('data-title', title.getAttribute('title'));
		title.removeAttribute('title');

		title.addEventListener('mouseover', (e) => {
			const span = document.createElement('span');
			span.innerHTML = `<span>${title.getAttribute('data-title')}</span>`;
			span.classList.add('title-text');
			document.body.appendChild(span);
			setTimeout(() => {
				span.classList.add('title-text-v');
			}, 0)

			const spanHeight = span.offsetHeight;
			let top = e.target.getBoundingClientRect().top - spanHeight - 2;

			if (top < 0) {
				top = spanHeight;
			}

			span.style.top = top + "px";

			if ((window.innerWidth - e.clientX) > 200) {
				span.style.left = e.clientX + "px";
			} else {
				let left = window.innerWidth - 2 * span.offsetWidth;

				if (left < 10) left = 10;

				span.style.left = left + 2 + "px";

				if (e.clientX - (left + span.offsetWidth) > 0) {
					span.style.left = left + (e.clientX - (left + span.offsetWidth)) + "px";
				}
			}

			if (span.getBoundingClientRect().right >= document.body.clientWidth) {
				span.style.right = '10px';
			}

			e.target.addEventListener('mouseout', (e) => {
				span.remove();
			});
		});
	}
}

window.addEventListener('load', () => {
	if (!isMobile.any()) {
		abbr();
	}
	setYear();
	nav();
});
