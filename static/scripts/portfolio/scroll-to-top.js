// Universal scroll-to-top functionality
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTop")

  if (!scrollToTopBtn) return

  // Show/hide scroll button based on scroll position
  function toggleScrollButton() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible")
    } else {
      scrollToTopBtn.classList.remove("visible")
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Event listeners
  window.addEventListener("scroll", toggleScrollButton)
  scrollToTopBtn.addEventListener("click", scrollToTop)

  // Keyboard accessibility
  scrollToTopBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      scrollToTop()
    }
  })

  // Throttle scroll events for better performance
  let ticking = false
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(toggleScrollButton)
      ticking = true
      setTimeout(() => {
        ticking = false
      }, 100)
    }
  }

  window.addEventListener("scroll", requestTick)

  // Lazy loading for project images
  const images = document.querySelectorAll('img[loading="lazy"]')
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.classList.add("loaded")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })
})
