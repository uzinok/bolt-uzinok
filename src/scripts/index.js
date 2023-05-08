const noJs = document.querySelector('.no-js');
noJs.classList.remove('no-js');

function setYear() {
	new Date().getFullYear();
	const yearElem = document.querySelectorAll('.ryear');

	for (let i = 0; i < yearElem.length; i++) {
		yearElem[i].innerText = new Date().getFullYear();
	}
}

// Звёздный фон
function bdCanvas(canvas) {
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

	// let canvas = document.querySelector("#bg-canvas");
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
		sliderList.style.transition = `transform ${transitionDuration}ms ${transitionFunction}`;
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
		let maxWidth = 0;
		for (let i = 0; i < sliderItems.length; i++) {
			sliderItems[i].querySelector('.slider__content').style.display = 'block';
			sliderItems[i].querySelector('.slider__content').clientHeight > maxWidth ? maxWidth = sliderItems[i].querySelector('.slider__content').clientHeight : maxWidth;
			sliderItems[i].querySelector('.slider__content').style.display = '';
		}
		sliderList.style.height = `${maxWidth}px`;
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
			InitSlider();
			sliderList.style.transition = '';

		}, 100);
	}
}

function topArrow() {
	const top = document.querySelector('.top');
	document.addEventListener('scroll', function () {
		const scrollY = window.scrollY || window.pageYOffset;
		if (scrollY < window.innerHeight / 4) {
			top.classList.add('top--after');
		} else {
			top.classList.remove('top--after');
		}
	});
}

window.addEventListener('load', () => {
	setYear();

	if (document.querySelector('#bg-canvas'))
		bdCanvas(document.querySelector('#bg-canvas'));

	const arrSliders = document.querySelectorAll('.slider');
	for (let i = 0; i < arrSliders.length; i++) {
		slider(arrSliders[i]);
	}

	topArrow();
});
