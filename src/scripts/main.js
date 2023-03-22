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
		preView.style.height = `${20 * countCode}px`;
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
		buttonView.classList.add('button-view');
		buttonView.setAttribute('aria-label', 'Показать весь код');
		code.append(buttonView);
	}

	function createCodeView() {
		const textPreArr = textPre.split('\n');
		let textCode = '';

		for (let i = 0; i < textPreArr.length; i++) {
			textCode += `<span><span aria-hidden="true">${i + 1}</span> ${textPreArr[i].replace('<', '&lt;').replace('>', '&gt;')}</span>\n`;
		}

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

// Звёздный фон
function bdCanvas() {
	document

	const opts = {
		minRadius: 0.5,
		maxRadius: 1.5,
		colors: ["rgba(255, 255, 255, 0.5)", "rgba(252, 244, 201, 0.5)", "rgba(201, 252, 201, 0.5)", "rgba(201, 236, 252, 0.5)", "rgba(229, 201, 252, 0.5)", "rgba(252, 201, 201, 0.5)", "rgba(252, 201, 241, 0.5)", "rgba(252, 201, 201, 0.5)"],
		delay: 100,
		step: 0.05,
		trangles: 4,
		intervalRadius: 2.5,
	}

	let canvas = document.querySelector("#bg-canvas");
	let ctx = canvas.getContext("2d");
	let w;
	let h;
	const arrStars = [];
	let check;
	let animations;

	resizeCanvas();

	function resizeCanvas() {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;
		return w, h;
	}

	window.addEventListener("resize", function() {
		windowResize();
	});

	function windowResize() {
		arrStars.length = 0;
		clearTimeout(check);
		check = setTimeout(function() {
			clearInterval(animations);
			resizeCanvas();
			setup();
		}, 100)
	}

	const Stars = function(w, h) {
		this.x = Math.random() * w;
		this.y = (Math.random() * (h - 210));
		this.color = opts.colors[[Math.round(Math.random() * opts.colors.length)]];
		this.vector = Math.round(Math.random()) || -1;
		this.minRadius = opts.minRadius + Math.random() * (opts.maxRadius - opts.minRadius);
		this.maxRadius = this.minRadius + opts.intervalRadius;

		this.draw = function() {

			ctx.beginPath();

			ctx.moveTo(this.x, this.y + this.minRadius);

			for (var i = 0; i < 2 * opts.trangles + 1; i++) {
				var r = (i % 2 == 0) ? this.minRadius : this.maxRadius;
				var a = (Math.PI * i / opts.trangles) + 45 * Math.PI / 180;
				ctx.lineTo(this.x + r * Math.sin(a), this.y + r * Math.cos(a));
			};

			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();

		}

		this.update = function() {
			this.check();
			this.minRadius += opts.step * this.vector;
			this.maxRadius += opts.step * this.vector;
		}

		this.check = function() {
			if (this.minRadius > opts.maxRadius || this.minRadius < opts.minRadius) {
				this.vector *= -1;
			}
		}

	}

	function setup() {
		for (let i = 0; i < (w / 150) * (h / 150); i++) {
			arrStars.push(new Stars(w, h));
			arrStars[i].draw();
		}
		loop();
	}

	setup();

	function loop() {
		animations = setInterval(function() {
			ctx.clearRect(0, 0, w, h);
			for (let i = 0; i < arrStars.length; i++) {
				arrStars[i].update();
				arrStars[i].draw();
			}
		}, opts.delay);
	}

}

function slider(slider) {
	const sliderList = slider.querySelector('.slider__list');
	const sliderItems = slider.querySelectorAll('.slider__item');
	const paginationWrap = slider.querySelector('.slider__pagination-wrap');
	const paginationButtons = [];
	const counSlide = sliderItems.length;

	let sliderWidth = 0;
	let currentSlide = 0;

	let sliderActive = false;
	let transformX = 0;
	let newTransformX = 0;
	let startClientX = 0;

	let percentSlider = 0;

	const bodyStyles = window.getComputedStyle(document.body);
	const transitionDuration = 1.5 * bodyStyles.getPropertyValue('--transition-duration').replace("ms", "");
	const transitionFunction = bodyStyles.getPropertyValue('--transition-function');

	let checkAction;

	function setSliderWidth() {
		sliderWidth = slider.offsetWidth;
		sliderList.style.width = sliderWidth * counSlide + 'px';
		sliderItems.forEach(item => {
			item.style.width = sliderWidth + 'px';
		});

		percentSlider = (sliderWidth * (counSlide - 1)) / 100;
	}

	function setCurrentSlide() {
		if (slider.querySelector('.slider__item--current')) {
			const oldSlider = slider.querySelector('.slider__item--current');
			oldSlider.removeAttribute('tabindex');
			oldSlider.setAttribute('aria-live', 'off');
			oldSlider.classList.remove('slider__item--current');
		}
		sliderList.style.transform = `translateX(-${sliderWidth * (currentSlide)}px)`;
		sliderItems[currentSlide].classList.add('slider__item--current');
		sliderItems[currentSlide].setAttribute('tabindex', 0);
		sliderItems[currentSlide].setAttribute('aria-live', 'polite');
	}

	function startSlider(e) {
		if (e.target.nodeName == 'H3' || e.target.nodeName == 'A') {
			return
		}
		slider.classList.add('slider--active');
		sliderList.style.transition = '';
		if (checkAction) clearTimeout(checkAction);
		return sliderActive = true, startClientX = e.clientX || e.touches[0].clientX;
	}

	function stopMouseToucth(e) {
		actionSlider(transformX, newTransformX);
		return sliderActive = false;
	}

	function actionSlider(start = 0, end = 0) {
		const resultMove = start - end;
		paginationButtons[currentSlide].disabled = false;
		if (Math.abs(resultMove) > 2 * percentSlider) {
			resultMove > 0 ? currentSlide++ : currentSlide--;
			if (currentSlide < 0) {
				currentSlide = 0;
			}
			if (currentSlide > counSlide - 1) {
				currentSlide = counSlide - 1;
			}
		}
		paginationButtons[currentSlide].disabled = true;
		stopAction();
		InitSlider();
		transformX = 0;
		newTransformX = 0;
	}

	function stopAction() {
		setHeight();
		checkAction = window.setTimeout(function() {
			slider.classList.remove('slider--active');
			sliderList.style.transition = '';
		}, transitionDuration);
	}

	function moveMouseToucth(e) {
		if (sliderActive) {
			transformX = -sliderWidth * currentSlide;
			newTransformX = transformX + -(startClientX - ((e.clientX || e.touches[0].clientX)));
			sliderList.style.transform = `translateX(${newTransformX}px)`;
		}
	}

	function InitSlider() {
		setSliderWidth();
		setCurrentSlide();
		setHeight();
	}

	function createPagination() {
		for (let i = 0; i < sliderItems.length; i++) {
			const button = document.createElement('button');
			button.classList.add('slider__pagination');
			button.dataset.action = i;
			button.setAttribute('type', 'button');
			button.setAttribute('aria-label', 'показать слайд ' + (i + 1));
			if (i == currentSlide) {
				button.disabled = true;
			}
			paginationWrap.append(button);
			paginationButtons.push(button);
		}
	}

	function setHeight() {
		sliderList.style.transition = `transform ${transitionDuration}ms ${transitionFunction}, height ${transitionDuration}ms ${transitionFunction}`;
		sliderList.style.height = `${sliderItems[currentSlide].clientHeight}px`;
	}

	paginationWrap.addEventListener('click', function(e) {
		paginationButtons[currentSlide].disabled = false;
		currentSlide = e.target.dataset.action || currentSlide;
		paginationButtons[currentSlide].disabled = true;
		slider.classList.add('slider--active');
		actionSlider();
		return sliderActive = false;
	});

	sliderList.addEventListener("mousedown", function(e) {
		startSlider(e);
	});
	sliderList.addEventListener("touchstart", function(e) {
		startSlider(e);
	}, {
		passive: false
	});

	document.addEventListener("mousemove", function(e) {
		moveMouseToucth(e);
	});
	document.addEventListener("touchmove", function(e) {
		moveMouseToucth(e);
	}, {
		passive: false
	});

	document.addEventListener("mouseup", function(e) {
		stopMouseToucth(e);
	});
	document.addEventListener("touchend", function(e) {
		stopMouseToucth(e);
	}, {
		passive: false
	});

	InitSlider();
	createPagination();

	window.addEventListener("resize", function() {
		windowResize();
	});

	let check;

	function windowResize() {
		clearTimeout(check);

		check = setTimeout(function() {
			setHeight();
			InitSlider();
			sliderList.style.transition = '';

		}, 100);
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

window.addEventListener('load', () => {
	setYear();
	if (document.querySelector('.bg-canvas'))
		bdCanvas();

	const arrSliders = document.querySelectorAll('.slider');
	for (let i = 0; i < arrSliders.length; i++) {
		slider(arrSliders[i]);
	}

	const arrCode = document.querySelectorAll('.code');
	for (let i = 0; i < arrCode.length; i++) {
		code(arrCode[i]);
	}
});
