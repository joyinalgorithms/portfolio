// Demo page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Video play functionality
  const videos = document.querySelectorAll(".demo-video")
  const playButtons = document.querySelectorAll(".play-button")

  // Handle video play/pause
  videos.forEach((video, index) => {
    const playButton = playButtons[index]
    const overlay = video.parentElement.querySelector(".video-overlay")

    // Play button click
    if (playButton) {
      playButton.addEventListener("click", () => {
        if (video.paused) {
          video.play()
          overlay.style.opacity = "0"
        } else {
          video.pause()
          overlay.style.opacity = "1"
        }
      })
    }

    // Video click to play/pause
    video.addEventListener("click", () => {
      if (video.paused) {
        video.play()
        overlay.style.opacity = "0"
      } else {
        video.pause()
        overlay.style.opacity = "1"
      }
    })

    // Show overlay when video is paused
    video.addEventListener("pause", () => {
      overlay.style.opacity = "1"
    })

    // Hide overlay when video is playing
    video.addEventListener("play", () => {
      overlay.style.opacity = "0"
    })

    // Handle video end
    video.addEventListener("ended", () => {
      overlay.style.opacity = "1"
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

  // Observe demo cards
  document.querySelectorAll(".demo-card").forEach((card) => {
    observer.observe(card)
  })

  // Lazy loading for video posters
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target
        if (video.dataset.src) {
          video.src = video.dataset.src
          video.removeAttribute("data-src")
          videoObserver.unobserve(video)
        }
      }
    })
  })

  videos.forEach((video) => {
    videoObserver.observe(video)
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Enhanced keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Space bar to play/pause focused video
    if (e.code === "Space" && document.activeElement.tagName === "VIDEO") {
      e.preventDefault()
      const video = document.activeElement
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }
  })

  // Performance optimization: Pause videos when not in viewport
  const videoIntersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target
        if (!entry.isIntersecting && !video.paused) {
          video.pause()
        }
      })
    },
    { threshold: 0.25 },
  )

  videos.forEach((video) => {
    videoIntersectionObserver.observe(video)
  })
})
