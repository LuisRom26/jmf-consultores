import Alpine from 'alpinejs'
import scrollCue from 'scrollcue'

const WHATSAPP_NUMBER = '522222012564'

const buildWhatsAppUrl = (message = '') => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.trim())}`

const normalizeText = (value) => String(value ?? '').trim()

const findFirstValue = (formData, keys) => {
  for (const key of keys) {
    const value = normalizeText(formData.get(key))
    if (value) return value
  }
  return ''
}

const getSelectedLabel = (field) => {
  if (!field || !('selectedOptions' in field)) return ''
  const selected = field.selectedOptions?.[0]
  return selected ? normalizeText(selected.textContent) : ''
}

const buildWhatsAppMessage = (form) => {
  const formData = new FormData(form)
  const nombre = findFirstValue(formData, ['nombre', 'name', 'fullName'])
  const empresa = findFirstValue(formData, ['empresa', 'company', 'organization'])
  const correo = findFirstValue(formData, ['correo', 'email'])
  const telefono = findFirstValue(formData, ['telefono', 'telefono_whatsapp', 'tel', 'phone'])
  const servicio = (() => {
    const rawServicio = findFirstValue(formData, ['servicio', 'servicioDeInteres', 'interes', 'servicio_interes'])
    if (rawServicio) return rawServicio
    return getSelectedLabel(form.elements.servicio || form.elements['servicio'])
  })()
  const mensaje = findFirstValue(formData, ['mensaje', 'message', 'comentarios'])

  const lines = ['Hola, me gustaría solicitar información a JMF Consultores.']

  if (nombre) lines.push(`\nNombre: ${nombre}`)
  if (empresa) lines.push(`Empresa: ${empresa}`)
  if (correo) lines.push(`Correo: ${correo}`)
  if (telefono) lines.push(`Teléfono: ${telefono}`)
  if (servicio) lines.push(`Servicio de interés: ${servicio}`)
  if (mensaje) lines.push(`Mensaje: ${mensaje}`)

  return lines.join('\n')
}

const setCurrentYear = () => {
  const yearNodes = document.querySelectorAll('[data-current-year]')
  const currentYear = new Date().getFullYear()
  yearNodes.forEach(node => {
    node.textContent = String(currentYear)
  })
}

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
  Alpine.data('counter', (target = 0, suffix = '') => ({
    value: 0,
    suffix: String(suffix),
    done: false,
    get display () {
      return `${this.value}${this.suffix}`
    },
    startCount () {
      if (this.done) return
      this.done = true
      const limit = Number(target) || 0
      const duration = 1800
      let startTime = null
      const tick = timestamp => {
        if (!startTime) startTime = timestamp
        const p = Math.min((timestamp - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        this.value = Math.floor(eased * limit)
        if (p < 1) requestAnimationFrame(tick)
        else this.value = limit
      }
      requestAnimationFrame(tick)
    },
    init () {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startCount()
            observer.disconnect()
          }
        })
      }, { threshold: 0.35 })
      observer.observe(this.$el)
    },
  }))

  Alpine.directive('intersect', (el, { expression }, { evaluateLater, cleanup }) => {
    const fn = evaluateLater(expression)
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fn()
          observer.disconnect()
        }
      })
    }, { threshold: 0.35 })

    observer.observe(el)
    cleanup(() => observer.disconnect())
  })

})

Alpine.start()

/* ============================================================
   ScrollCue — initialize after DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear()

  scrollCue.init({
    duration:   700,
    interval:   0,
    percentage: 0.3,
  })

  /* --- Contact form handler ---------------------------------- */
  document.querySelectorAll('.jmf-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault()

      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }

      const btn = form.querySelector('[type="submit"]')
      if (!btn) return

      const originalLabel = btn.dataset.originalLabel || btn.textContent.trim() || 'Enviar'
      btn.dataset.originalLabel = originalLabel
      btn.disabled = true
      btn.textContent = 'Abriendo WhatsApp…'

      const message = buildWhatsAppMessage(form)
      const url = buildWhatsAppUrl(message)

      try {
        const popup = window.open(url, '_blank', 'noopener,noreferrer')
        if (!popup) {
          window.location.href = url
        }
      } catch (error) {
        window.location.href = url
      } finally {
        window.setTimeout(() => {
          btn.disabled = false
          btn.textContent = originalLabel
        }, 1200)
      }
    })
  })
})
