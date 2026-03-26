import Alpine from 'alpinejs'
import scrollCue from 'scrollcue'

/* ============================================================
   Alpine — global setup
   ============================================================ */
window.Alpine = Alpine

document.addEventListener('alpine:init', () => {

  /* --- Navbar ------------------------------------------------ */
  Alpine.data('navbar', () => ({
    scrolled: false,
    open: false,
    init () {
      const onScroll = () => { this.scrolled = window.scrollY > 50 }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    },
  }))

  /* --- Animated counter -------------------------------------- */
  Alpine.data('counter', (target) => ({
    value: 0,
    done: false,
    init () {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.done) {
            this.done = true
            this._run(target)
            observer.disconnect()
          }
        })
      }, { threshold: 0.5 })
      observer.observe(this.$el)
    },
    _run (target) {
      const duration = 1800
      let startTime = null
      const step = ts => {
        if (!startTime) startTime = ts
        const p = Math.min((ts - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        this.value = Math.floor(eased * target)
        if (p < 1) requestAnimationFrame(step)
        else this.value = target
      }
      requestAnimationFrame(step)
    },
  }))

})

Alpine.start()

/* ============================================================
   ScrollCue — initialize after DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  scrollCue.init({
    duration:   700,
    interval:   0,
    percentage: 0.3,
  })

  /* --- Contact form handler ---------------------------------- */
  document.querySelectorAll('.jmf-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault()
      const btn = form.querySelector('[type="submit"]')
      const original = btn.innerHTML
      btn.innerHTML = '<i class="ti ti-loader-2 animate-spin"></i> Enviando...'
      btn.disabled = true
      /* Replace with your backend endpoint */
      setTimeout(() => {
        btn.innerHTML = '<i class="ti ti-circle-check"></i> ¡Mensaje enviado!'
        btn.classList.add('!bg-green-600')
        setTimeout(() => {
          btn.innerHTML = original
          btn.disabled = false
          btn.classList.remove('!bg-green-600')
          form.reset()
        }, 3500)
      }, 1200)
    })
  })
})
