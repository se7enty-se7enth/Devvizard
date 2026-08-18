// 1. Подключаем SCSS-стили сайта
import '../css/main.scss'

// 2. Подключаем Swiper и его стили из npm
import Swiper from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

// 3. Подключаем GSAP и ScrollTrigger из npm
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// 4. Подключаем Lenis и его стили
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/* ==========================================================================
   1. ИНИЦИАЛИЗАЦИЯ ПЛАВНОГО СКРОЛЛА (LENIS)
   ========================================================================== */
const initSmoothScroll = () => {
	window.lenis = new Lenis({
		duration: 0.9,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		orientation: 'vertical',
		gestureOrientation: 'vertical',
		smoothWheel: true,
	})

	window.lenis.on('scroll', ScrollTrigger.update)

	gsap.ticker.add((time) => {
		window.lenis.raf(time * 1000)
	})

	gsap.ticker.lagSmoothing(0)

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()
			const href = this.getAttribute('href')
			if (href === '#') {
				window.lenis.scrollTo(0)
				return
			}
			const target = document.querySelector(href)
			if (target) {
				window.lenis.scrollTo(target, { offset: -30 })
			}
		})
	})
}
document.addEventListener('DOMContentLoaded', initSmoothScroll)

/* ==========================================================================
   2. АДАПТИВНОЕ МЕНЮ [ MENU ] / [ CLOSE ]
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.header')
	const menuToggle = document.querySelector('#menu-toggle')
	const nav = document.querySelector('.header__nav')
	const mainElement = document.querySelector('.main')
	const toggleText = menuToggle?.querySelector('.text')
	const navLinks = document.querySelectorAll('.header__nav-link')

	if (!menuToggle || !nav) return

	let isMenuOpen = false

	const itemsTl = gsap.timeline({ paused: true })
	itemsTl.fromTo('.header__nav-item',
		{ y: 40, opacity: 0 },
		{ y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 }
	)

	nav.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })

	const toggleMenu = () => {
		if (window.innerWidth > 1300) return
		isMenuOpen = !isMenuOpen

		if (isMenuOpen) {
			header?.classList.add('menu-open')
			nav.classList.add('is-open')
			itemsTl.restart()
			if (toggleText) toggleText.textContent = 'close'
			mainElement?.classList.add('is-blurred')
			if (window.lenis) window.lenis.stop()
		} else {
			header?.classList.remove('menu-open')
			nav.classList.remove('is-open')
			itemsTl.pause(0)
			if (toggleText) toggleText.textContent = 'menu'
			mainElement?.classList.remove('is-blurred')
			if (window.lenis) window.lenis.start()
		}
	}

	menuToggle.addEventListener('click', (e) => {
		e.preventDefault()
		toggleMenu()
	})

	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			if (isMenuOpen) toggleMenu()
			const href = link.getAttribute('href')
			if (href && href.startsWith('#') && window.lenis) {
				const target = document.querySelector(href)
				if (target) window.lenis.scrollTo(target, { offset: -30 })
			}
		})
	})

	const mobileBtn = document.querySelector('.header__button--mobile')
	if (mobileBtn) {
		mobileBtn.addEventListener('click', () => {
			if (isMenuOpen) toggleMenu()
		})
	}

	nav.addEventListener('click', (e) => {
		if (e.target === nav && isMenuOpen) toggleMenu()
	})

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isMenuOpen) toggleMenu()
	})

	window.addEventListener('resize', () => {
		if (window.innerWidth > 1300) {
			if (isMenuOpen) {
				isMenuOpen = false
				header?.classList.remove('menu-open')
				nav.classList.remove('is-open')
				if (toggleText) toggleText.textContent = 'menu'
				mainElement?.classList.remove('is-blurred')
				if (window.lenis) window.lenis.start()
			}
			itemsTl.pause(0)
			gsap.set('.header__nav-item', { clearProps: "all" })
		}
	})
})

/* ==========================================================================
   3. МОДАЛКА "ОБСУДИТЬ ПРОЕКТ"
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	const btnsOpen = document.querySelectorAll('.header__button')
	const modal = document.getElementById('contact-modal')
	const btnClose = document.getElementById('modal-close')
	const overlay = document.getElementById('modal-overlay')

	if (btnsOpen.length === 0 || !modal) return

	overlay.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })

	const openModal = () => {
		modal.classList.add('modal--active')
		if (window.lenis) window.lenis.stop()
	}

	const closeModal = () => {
		modal.classList.remove('modal--active')
		if (window.lenis) window.lenis.start()
	}

	btnsOpen.forEach(btn => {
		btn.addEventListener('click', openModal)
	})

	btnClose.addEventListener('click', closeModal)
	overlay.addEventListener('click', closeModal)

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.classList.contains('modal--active')) {
			closeModal()
		}
	})
})

/* ==========================================================================
   4. КУРСОР САЙТА
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	const dot = document.getElementById('cursor-dot')
	const ring = document.getElementById('cursor-ring')
	if (!dot || !ring) return

	document.body.classList.add('js-cursor-active')
	let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2
	let ringX = mouseX, ringY = mouseY, isHovered = false

	window.addEventListener('pointermove', (e) => {
		mouseX = e.clientX; mouseY = e.clientY
	}, { capture: true })

	const interactives = document.querySelectorAll('a, button, input, textarea, .swiper-pagination-bullet, #menu-toggle')
	interactives.forEach(el => {
		el.addEventListener('mouseenter', () => { ring.classList.add('cursor-ring--hover'); isHovered = true })
		el.addEventListener('mouseleave', () => { ring.classList.remove('cursor-ring--hover'); isHovered = false })
	})

	const render = () => {
		ringX += (mouseX - ringX) * 0.3; ringY += (mouseY - ringY) * 0.3
		let ringOffset = isHovered ? 28 : 18
		dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`
		ring.style.transform = `translate3d(${ringX - ringOffset}px, ${ringY - ringOffset}px, 0)`
		requestAnimationFrame(render)
	}
	render()
})

/* ==========================================================================
   5. HERO ЭФФЕКТЫ (X-RAY И 3D КАРТЫ)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
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

	const cards = document.querySelectorAll('.glass-card')
	const glow = document.querySelector('.hero__glow')

	window.addEventListener('mousemove', (e) => {
		const x = (e.clientX / window.innerWidth - 0.5) * 2
		const y = (e.clientY / window.innerHeight - 0.5) * 2
		cards.forEach(card => {
			const speed = card.getAttribute('data-speed')
			card.style.transform = `rotateX(${-y * speed * 150}deg) rotateY(${x * speed * 150}deg) translate(${-x * speed * 200}px, ${-y * speed * 200}px)`
		})
		if (glow) glow.style.transform = `translate(calc(-50% + ${-x * 30}px), calc(-50% + ${-y * 30}px))`
	})
})

/* ==========================================================================
   6. ГЛОБАЛЬНЫЙ GLOW-ЭФФЕКТ ДЛЯ КАРТОЧЕК
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	const glowCards = document.querySelectorAll('.js-glow-card')
	glowCards.forEach(card => {
		card.addEventListener('mousemove', (e) => {
			const rect = card.getBoundingClientRect()
			card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
			card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
		})
	})
})

/* ==========================================================================
   7. АККОРДЕОН FAQ
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	const faqItems = document.querySelectorAll('.js-faq-item')

	faqItems.forEach(item => {
		const btn = item.querySelector('.faq__question')

		btn?.addEventListener('click', () => {
			const isActive = item.classList.contains('is-active')

			faqItems.forEach(el => {
				el.classList.remove('is-active')
				const elBtn = el.querySelector('.faq__question')
				if (elBtn) elBtn.setAttribute('aria-expanded', 'false')
			})

			if (!isActive) {
				item.classList.add('is-active')
				btn.setAttribute('aria-expanded', 'true')
			}
		})
	})
})

/* ==========================================================================
   8. СЛАЙДЕР ОТЗЫВОВ
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('.js-reviews-slider')) {
		new Swiper('.js-reviews-slider', {
			loop: true, grabCursor: true, spaceBetween: 24, speed: 1000,
			autoplay: { delay: 3000, disableOnInteraction: false },
			pagination: { el: '.reviews__pagination', clickable: true },
			breakpoints: { 320: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
		})
	}
})

/* ==========================================================================
   9. GSAP АНИМАЦИИ (SCROLLTRIGGER)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(ScrollTrigger)
	const header = document.querySelector('.header')
	if (header) gsap.from(header, { y: -50, duration: 0.6, ease: "back.out(1)", delay: 0.1, clearProps: "all" })

	document.querySelectorAll('.js-fade-up').forEach(element => {
		const delay = element.getAttribute('data-delay') || 0
		gsap.from(element, {
			scrollTrigger: { trigger: element, start: "top 100%", toggleActions: "play none none none" },
			y: 60, opacity: 0, duration: 0.8, ease: "back.out(1.3)", delay: Number(delay), clearProps: "all"
		})
	})
})

/* ==========================================================================
   10. КУКИ И ХЭШ-СКРОЛЛ
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	const cookieBanner = document.getElementById('cookie-banner')
	if (!localStorage.getItem('cookies-accepted')) {
		setTimeout(() => cookieBanner?.classList.add('cookies--active'), 1500)
	}
	document.getElementById('cookie-accept')?.addEventListener('click', () => {
		cookieBanner.classList.remove('cookies--active')
		localStorage.setItem('cookies-accepted', 'true')
	})
})

window.addEventListener('load', () => {
	const targetId = window.location.hash
	if (targetId) {
		const targetElement = document.querySelector(targetId)
		if (targetElement) {
			setTimeout(() => {
				const headerHeight = document.querySelector('.header')?.offsetHeight || 0
				window.scrollTo({ top: targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20, behavior: 'smooth' })
			}, 100)
		}
	}
})

/* ==========================================================================
   11. ЭФФЕКТ СЛОТ-МАШИНЫ ДЛЯ 404
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
	const errorTitle = document.querySelector('.error-screen__title h1')

	if (errorTitle) {
		const finalDigits = ['4', '0', '4']
		const duration = 1500
		const frameRate = 40

		let currentStep = 0
		const totalSteps = duration / frameRate

		const slotMachine = setInterval(() => {
			let result = ''

			finalDigits.forEach((digit, index) => {
				const lockStep = totalSteps * ((index + 1) / finalDigits.length)

				if (currentStep >= lockStep) {
					result += digit
				} else {
					result += Math.floor(Math.random() * 10)
				}
			})

			errorTitle.innerText = result
			currentStep++

			if (currentStep > totalSteps) {
				clearInterval(slotMachine)
				errorTitle.innerText = '404'
			}
		}, frameRate)
	}
})