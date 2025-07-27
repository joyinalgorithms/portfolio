document.addEventListener("DOMContentLoaded", () => {
    function animateCounters() {
        const counters = document.querySelectorAll(".stat-number")
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const counter = entry.target
                        const target = Number.parseInt(counter.getAttribute("data-target"))
                        const duration = 2000
                        const increment = target / (duration / 16)

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
            }, {
                threshold: 0.5
            },
        )

        counters.forEach((counter) => observer.observe(counter))
    }

    window.toggleImageEffect = (element) => {
        element.classList.toggle("flipped")
        element.style.transform = "scale(0.95)"
        setTimeout(() => {
            element.style.transform = ""
        }, 150)
    }

    window.animateSkill = (element) => {
        element.style.transform = "scale(0.95)"
        setTimeout(() => {
            element.style.transform = ""
        }, 150)

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

    animateCounters()

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

    document.querySelectorAll(".skill-item, .philosophy-item").forEach((el) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(30px)"
        el.style.transition = "all 0.6s ease"
        observer.observe(el)
    })
})
