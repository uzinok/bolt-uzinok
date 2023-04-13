const noJs = document.querySelector('.no-js');
noJs.classList.remove('no-js');

function code(code) {
	const btn = code.querySelector('.code__copy');
	const pre = code.querySelector('pre');
	let textPre = pre.innerText;
	let countCode = '';
	const preView = document.createElement('code');
	const buttonView = document.createElement('button');

	createCodeView();

	if (countCode > 5)
		limitHeight();

	btn.addEventListener('click', function() {
		copyText();
	});

	buttonView.addEventListener('click', function() {
		preView.style.height = `${20 * (countCode + 1)}px`;
		code.classList.remove('hide');

		const bodyStyles = window.getComputedStyle(document.body);
		const transitionDuration = 1.5 * bodyStyles.getPropertyValue('--transition-duration').replace("ms", "");
		window.setTimeout(() => {
			buttonView.style.display = 'none';
		}, transitionDuration)
	});

	function limitHeight() {
		preView.style.height = `${20 * 5}px`;
		createButtonView();
		code.classList.add('hide')
	}

	function createButtonView() {
		buttonView.classList.add('code__button-view');
		buttonView.setAttribute('aria-label', 'Показать весь код');
		code.append(buttonView);
	}

	function createCodeView() {
		const textPreArr = textPre.split('\n');
		let textCode = '';

		for (let i = 0; i < textPreArr.length; i++) {
			textCode += `<codeLine><codenumber aria-hidden="true">${i + 1}</codenumber> ${textPreArr[i].replace('<', '&lt;').replace('</', '&lt;/').replace('>', '&gt;')}</codeLine>\n`;
		}

		textCode += `<codeLine><codenumber aria-hidden="true">${textPreArr.length + 1}</codenumber></codeLine>\n`;

		preView.classList.add('code__pre');
		preView.innerHTML = textCode;
		code.append(preView);
		pre.remove();

		return countCode = textPreArr.length, preView;
	}

	function copyText() {
		navigator.clipboard.writeText(textPre)
			.then(() => {
				const chips = new BoltChips({
					message: 'Скопировано',
					cssClass: 'bolt-chips--success',
				});
			})
			.catch(err => {
				const chips = new BoltChips({
					message: err,
					cssClass: 'bolt-chips--danger'
				});
			});
	}
}

function setYear() {
	new Date().getFullYear();
	const yearElem = document.querySelectorAll('.ryear');

	for (let i = 0; i < yearElem.length; i++) {
		yearElem[i].innerText = new Date().getFullYear();
	}
}

/**!
 * https://github.com/uzinok/Bolt-Chips
 * isInit() управляет методами для создания чипса
 * getChipsWrap() создает/получает врап (this.wrap)
 * createElem() создает врапер/чипс (this.wrap/this.chips)
 * monitorClick() отслеживает клик по чипсу, для его закрытия
 * isClose() удаляет чипс (при необходимости враппер) из DOM, удаляет слушателя событий
 *
 * для доступности можно добавить следующие ариа-атрибуты:
 * role => options.role (alert, status, log, timer, marquee)
 * aria-live => options.ariaLive (off, polite, assertive)
 */

class BoltChips {
	constructor(options) {
		this.message = options.message || 'no message';
		this.cssClass = options.cssClass || 'bolt-chips--success';
		this.delay = options.delay || 5000;

		this.role = options.role || null;
		this.ariaLive = options.ariaLive || null;

		this.wrap = null;
		this.chips = null;

		this.isInit();
	}

	getChipsWrap() {

		if (document.querySelector('.bolt-chips-wrap')) {
			return this.wrap = document.querySelector('.bolt-chips-wrap');
		}

		return this.createElem('bolt-chips-wrap');
	}

	createElem(cssClass) {
		let elem = document.createElement('div');

		// если передан класс "bolt-chips-wrap", создаем врап
		if (cssClass == 'bolt-chips-wrap') {
			elem.classList.add('bolt-chips-wrap');
			document.body.appendChild(elem);
			return elem;
		}

		// либо создаем чипс
		elem.innerHTML = this.message;
		elem.classList.add('bolt-chips');
		elem.classList.add(this.cssClass);
		elem.setAttribute('tabindex', 0)

		if (this.role)
			elem.setAttribute('role', this.role)
		if (this.ariaLive)
			elem.setAttribute('aria-live', this.ariaLive)

		this.wrap.appendChild(elem);
		return elem;
	}

	isInit() {
		this.wrap = this.getChipsWrap();
		this.chips = this.createElem(this.cssClass);

		// запуск таймера для удаления чипса через указанный промежуток времени
		setTimeout(() => {
			this.isClose();
		}, this.delay)

		this.monitorClick()
	}

	isClose() {
		this.wrap.removeChild(this.chips);

		// удаление слушателя событий
		this.chips.removeEventListener('click', this.isClose);

		// при необходимости удаляем всрапер из DOM
		if (!this.wrap.querySelector('.bolt-chips')) {
			document.body.removeChild(this.wrap);
		}
	}

	// метод объявлен ссылкой на функцию для удаления слушателя событий
	monitorClick = function() {
		this.chips.addEventListener('click', () => {
			this.isClose();
		});
	}
}

function mediaDzen(elem) {
	const link = elem.querySelector('.media-dzen__link');
	const picture = elem.querySelector('.media-dzen__visible');
	const play = elem.querySelector('.media-dzen__play');

	link.removeAttribute('href');
	play.addEventListener('click', function() {
		const iframe = document.createElement('iframe');
		iframe.src = elem.dataset.iframe;
		elem.removeAttribute('data-iframe')
		iframe.classList.add('media-dzen__visible');
		iframe.setAttribute('allow', 'autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media');
		iframe.setAttribute('frameborder', 0);
		iframe.setAttribute('scrolling', 'no');
		iframe.setAttribute('allowfullscreen', '');

		elem.append(iframe);

		iframe.addEventListener('load', function() {
			picture.remove();
			play.remove();
		});
	});


}

window.addEventListener('load', () => {
	setYear();
	if (document.querySelector('.bg-canvas'))
		bdCanvas();

	const arrCode = document.querySelectorAll('.code');
	for (let i = 0; i < arrCode.length; i++) {
		code(arrCode[i]);
	}

	const arrMediaDzen = document.querySelectorAll('.media-dzen');
	for (let i = 0; i < arrMediaDzen.length; i++) {
		mediaDzen(arrMediaDzen[i]);
	}
});
