// Enhanced About Me page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Animated counter for stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target
            const target = Number.parseInt(counter.getAttribute("data-target"))
            const duration = 2000 // 2 seconds
            const increment = target / (duration / 16) // 60fps

            let current = 0
            const timer = setInterval(() => {
              current += increment
              if (current >= target) {
                current = target
                clearInterval(timer)
              }
              counter.textContent = Math.floor(current) + (target === 100 ? "%" : "+")
            }, 16)

            observer.unobserve(counter)
          }
        })
      },
      { threshold: 0.5 },
    )

    counters.forEach((counter) => observer.observe(counter))
  }

  // Image toggle effect
  window.toggleImageEffect = (element) => {
    element.classList.toggle("flipped")

    // Add some visual feedback
    element.style.transform = "scale(0.95)"
    setTimeout(() => {
      element.style.transform = ""
    }, 150)
  }

  // Skill item animation
  window.animateSkill = (element) => {
    // Add click animation
    element.style.transform = "scale(0.95)"
    setTimeout(() => {
      element.style.transform = ""
    }, 150)

    // Add ripple effect
    const ripple = document.createElement("div")
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(0, 255, 136, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `

    element.style.position = "relative"
    element.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Add ripple animation CSS
  const style = document.createElement("style")
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }

    .profile-image-large.flipped .image-overlay {
      opacity: 1;
    }
  `
  document.head.appendChild(style)

  // Initialize counter animation
  animateCounters()

  // Keyboard navigation for interactive elements
  document.querySelectorAll(".skill-item, .profile-image-large").forEach((item) => {
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        item.click()
      }
    })
  })

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for scroll animations
  document.querySelectorAll(".skill-item, .philosophy-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s ease"
    observer.observe(el)
  })
})
