/* Поп-ап в хедере "Обсудить проект" */
document.addEventListener('DOMContentLoaded', () => {
	const btnOpen = document.querySelector('.header__button')
	const modal = document.getElementById('contact-modal')
	const btnClose = document.getElementById('modal-close')
	const overlay = document.getElementById('modal-overlay')

	if (!btnOpen || !modal) return

	const openModal = () => {
		modal.classList.add('modal--active')
		document.body.style.overflow = 'hidden'
	}

	const closeModal = () => {
		modal.classList.remove('modal--active')
		document.body.style.overflow = ''
	}

	btnOpen.addEventListener('click', openModal)
	btnClose.addEventListener('click', closeModal)
	overlay.addEventListener('click', closeModal)

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.classList.contains('modal--active')) {
			closeModal()
		}
	})
})

/* Курсор сайта */
document.addEventListener('DOMContentLoaded', () => {
	const dot = document.getElementById('cursor-dot')
	const ring = document.getElementById('cursor-ring')

	if (!dot || !ring) return

	let mouseX = window.innerWidth / 2
	let mouseY = window.innerHeight / 2

	let ringX = mouseX
	let ringY = mouseY

	let isHovered = false
	let isDragged = false

	window.addEventListener('pointermove', (e) => {
		mouseX = e.clientX
		mouseY = e.clientY
	}, { capture: true })

	const interactives = document.querySelectorAll('a, button, input, textarea, .swiper-pagination-bullet')
	interactives.forEach(el => {
		el.addEventListener('mouseenter', () => {
			ring.classList.add('cursor-ring--hover')
			isHovered = true
		})
		el.addEventListener('mouseleave', () => {
			ring.classList.remove('cursor-ring--hover')
			isHovered = false
		})
	})

	const swiperWrapper = document.querySelector('.swiper-wrapper')
	if (swiperWrapper) {
		swiperWrapper.addEventListener('mousedown', () => {
			ring.classList.add('cursor-ring--drag')
			isDragged = true
		})

		window.addEventListener('mouseup', () => {
			ring.classList.remove('cursor-ring--drag')
			isDragged = false
		})
	}

	document.addEventListener('mouseleave', () => {
		dot.style.opacity = '0'
		ring.style.opacity = '0'
	})

	document.addEventListener('mouseenter', () => {
		dot.style.opacity = '1'
		ring.style.opacity = '1'
	})

	const render = () => {
		ringX += (mouseX - ringX) * 0.3
		ringY += (mouseY - ringY) * 0.3

		let ringOffset = 18
		if (isHovered) ringOffset = 28
		if (isDragged) ringOffset = 12

		dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`
		ring.style.transform = `translate3d(${ringX - ringOffset}px, ${ringY - ringOffset}px, 0)`

		requestAnimationFrame(render)
	}

	requestAnimationFrame(render)
})

/* X-Ray на слове в hero */
document.addEventListener('DOMContentLoaded', () => {
	/* Логика Рентгена */
	const xrayWord = document.getElementById('xray-word')
	const xrayCode = xrayWord?.querySelector('.xray-word__code')

	if (xrayWord && xrayCode) {
		xrayWord.addEventListener('mousemove', (e) => {
			const rect = xrayWord.getBoundingClientRect()
			xrayCode.style.transition = 'none'
			xrayWord.style.setProperty('--x', `${e.clientX - rect.left}px`)
			xrayWord.style.setProperty('--y', `${e.clientY - rect.top}px`)
		})

		xrayWord.addEventListener('mouseenter', () => {
			xrayCode.style.transition = 'clip-path 0.3s ease, -webkit-clip-path 0.3s ease'
			xrayWord.style.setProperty('--radius', '100px')
		})

		xrayWord.addEventListener('mouseleave', () => {
			xrayCode.style.transition = 'clip-path 0.3s ease, -webkit-clip-path 0.3s ease'
			xrayWord.style.setProperty('--radius', '0px')
		})
	}

	/* Логика 3D Карточек */
	const cards = document.querySelectorAll('.glass-card')

	window.addEventListener('mousemove', (e) => {
		const x = (e.clientX / window.innerWidth - 0.5) * 2
		const y = (e.clientY / window.innerHeight - 0.5) * 2

		cards.forEach(card => {
			const speed = card.getAttribute('data-speed')
			const rX = -y * speed * 150
			const rY = x * speed * 150
			const tX = -x * speed * 200
			const tY = -y * speed * 200

			card.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg) translate(${tX}px, ${tY}px)`
		})
	})
})

const cards = document.querySelectorAll('.glass-card')
const glow = document.querySelector('.hero__glow')

window.addEventListener('mousemove', (e) => {
	const x = (e.clientX / window.innerWidth - 0.5) * 2
	const y = (e.clientY / window.innerHeight - 0.5) * 2

	cards.forEach(card => {
		const speed = card.getAttribute('data-speed')
		const rX = -y * speed * 150
		const rY = x * speed * 150
		const tX = -x * speed * 200
		const tY = -y * speed * 200

		card.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg) translate(${tX}px, ${tY}px)`
	})

	if (glow) {
		const glowX = -x * 30
		const glowY = -y * 30

		glow.style.transform = `translate(calc(-50% + ${glowX}px), calc(-50% + ${glowY}px))`
	}
})

/* Логика свечения бенто карточек */
const bentoCards = document.querySelectorAll('.js-glow-card')

bentoCards.forEach(card => {
	card.addEventListener('mousemove', (e) => {
		const rect = card.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		card.style.setProperty('--mouse-x', `${x}px`)
		card.style.setProperty('--mouse-y', `${y}px`)
	})
})

/* Аккордеон FAQ */
document.addEventListener('DOMContentLoaded', () => {
	const faqItems = document.querySelectorAll('.js-faq-item')

	faqItems.forEach(item => {
		const questionBtn = item.querySelector('.faq__question')

		questionBtn.addEventListener('click', () => {
			const isActive = item.classList.contains('is-active')

			faqItems.forEach(el => {
				el.classList.remove('is-active')
			})

			if (!isActive) {
				item.classList.add('is-active')
			}
		})
	})
})

document.addEventListener('DOMContentLoaded', () => {
	const reviewsSlider = new Swiper('.js-reviews-slider', {
		loop: true,
		grabCursor: true,
		spaceBetween: 24,
		speed: 1500,

		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},

		pagination: {
			el: '.reviews__pagination',
			clickable: true,
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 2,
			},
			1024: {
				slidesPerView: 3,
			}
		}
	})
})

/* Анимация элементов */
document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(ScrollTrigger)

	/* Анимация хедера */
	const header = document.querySelector('.header')
	if (header) {
		gsap.from(header, {
			y: -50,
			duration: 0.6,
			ease: "back.out(1)",
			delay: 0.1
		})
	}

	/* Анимация для всего отстального */
	const fadeElements = document.querySelectorAll('.js-fade-up')

	fadeElements.forEach(element => {
		const delay = element.getAttribute('data-delay') || 0

		gsap.from(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				toggleActions: "play none none none"
			},
			y: 60,
			opacity: 0,
			duration: 1,
			ease: "back.out(1.5)",
			delay: Number(delay),
			clearProps: "all"
		})
	})
})