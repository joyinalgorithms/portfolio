// Enhanced certifications page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Modal functionality
  const enlargeImage = (imageContainer) => {
    const modal = document.getElementById("certificateModal")
    const modalImg = document.getElementById("modalImage")
    const img = imageContainer.querySelector(".certificate-img")

    modal.style.display = "block"
    modalImg.src = img.src
    modalImg.alt = img.alt

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    const modal = document.getElementById("certificateModal")
    modal.style.display = "none"
    document.body.style.overflow = ""
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
    }
  })

  // Keyboard navigation for certificate images
  document.querySelectorAll(".certificate-image").forEach((item) => {
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        enlargeImage(item)
      }
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }, index * 200)
      }
    })
  }, observerOptions)

  // Observe certificate cards
  document.querySelectorAll(".certificate-card").forEach((card) => {
    observer.observe(card)
  })

  // Lazy loading for certificate images
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute("data-src")
          imageObserver.unobserve(img)
        }
      }
    })
  })

  document.querySelectorAll(".certificate-img").forEach((img) => {
    imageObserver.observe(img)
  })
})
