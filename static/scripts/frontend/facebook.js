// Facebook Clone Interactive Features
class FacebookApp {
  constructor() {
    this.isMobile = window.innerWidth < 768
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupMobileMenu()
    this.setupInfiniteScroll()
    this.setupImageLazyLoading()
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay")
    const sidebar = document.getElementById("sidebar")

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active")
        mobileMenuOverlay.classList.toggle("active")
        document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : ""
      })

      mobileMenuOverlay.addEventListener("click", () => {
        sidebar.classList.remove("active")
        mobileMenuOverlay.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  }

  // Enhanced interaction handlers
  setupEventListeners() {
    // Like button interactions
    document.addEventListener("click", (e) => {
      if (e.target.closest(".action-btn")) {
        this.handleActionClick(e.target.closest(".action-btn"))
      }

      if (e.target.closest(".add-friend-btn")) {
        this.handleAddFriend(e.target.closest(".add-friend-btn"))
      }

      if (e.target.closest(".story-box")) {
        this.handleStoryClick(e.target.closest(".story-box"))
      }
    })

    // Post input focus enhancement
    const postInput = document.querySelector(".post-input")
    if (postInput) {
      postInput.addEventListener("focus", () => {
        postInput.parentElement.parentElement.classList.add("focused")
      })

      postInput.addEventListener("blur", () => {
        postInput.parentElement.parentElement.classList.remove("focused")
      })
    }

    // Responsive handling
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.isMobile = window.innerWidth < 768
        this.handleResize()
      }, 250),
    )
  }

  // Handle action button clicks (Like, Comment, Share)
  handleActionClick(button) {
    const action = button.textContent.trim().toLowerCase()

    // Add visual feedback
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = ""
    }, 150)

    // Haptic feedback for mobile
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate(50)
    }

    // Update like count if it's a like button
    if (action.includes("like")) {
      this.updateLikeCount(button)
    }

    console.log(`${action} clicked`)
  }

  // Handle add friend button
  handleAddFriend(button) {
    button.innerHTML = '<i class="ri-check-line"></i> Request sent'
    button.style.backgroundColor = "var(--facebook-gray-light)"
    button.style.color = "var(--facebook-gray)"
    button.disabled = true

    // Haptic feedback
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate([50, 50, 50])
    }
  }

  // Handle story clicks
  handleStoryClick(storyBox) {
    // Add click animation
    storyBox.style.transform = "scale(0.98)"
    setTimeout(() => {
      storyBox.style.transform = ""
    }, 200)

    console.log("Story clicked")
  }

  // Update like count with animation
  updateLikeCount(button) {
    const post = button.closest(".post")
    const likesElement = post.querySelector(".likes")

    if (likesElement) {
      let currentLikes = Number.parseInt(likesElement.textContent.replace(/[^\d]/g, ""))
      currentLikes += 1

      // Format the number (K, M notation)
      const formattedLikes = this.formatNumber(currentLikes)

      // Animate the change
      likesElement.style.transform = "scale(1.2)"
      likesElement.style.color = "var(--facebook-blue)"

      setTimeout(() => {
        likesElement.textContent = formattedLikes
        likesElement.style.transform = ""
        likesElement.style.color = ""
      }, 200)
    }
  }

  // Format numbers (1000 -> 1K, 1000000 -> 1M)
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Infinite scroll for posts
  setupInfiniteScroll() {
    let loading = false

    window.addEventListener(
      "scroll",
      this.debounce(() => {
        if (loading) return

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement

        if (scrollTop + clientHeight >= scrollHeight - 1000) {
          loading = true
          this.loadMorePosts().then(() => {
            loading = false
          })
        }
      }, 100),
    )
  }

  // Simulate loading more posts
  async loadMorePosts() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Loading more posts...")
    // Here you would typically fetch more posts from your backend
  }

  // Lazy loading for images
  setupImageLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute("data-src")
              observer.unobserve(img)
            }
          }
        })
      })

      // Observe all images with data-src attribute
      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img)
      })
    }
  }

  // Handle window resize
  handleResize() {
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("mobileMenuOverlay")

    if (!this.isMobile && sidebar) {
      sidebar.classList.remove("active")
      overlay.classList.remove("active")
      document.body.style.overflow = ""
    }
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.facebookApp = new FacebookApp()
})

// Handle keyboard navigation for accessibility
document.addEventListener("keydown", (e) => {
  // Close mobile menu with Escape key
  if (e.key === "Escape") {
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("mobileMenuOverlay")

    if (sidebar && sidebar.classList.contains("active")) {
      sidebar.classList.remove("active")
      overlay.classList.remove("active")
      document.body.style.overflow = ""
    }
  }

  // Navigate stories with arrow keys
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    const focusedStory = document.activeElement
    if (focusedStory && focusedStory.classList.contains("story-box")) {
      e.preventDefault()
      const stories = Array.from(document.querySelectorAll(".story-box"))
      const currentIndex = stories.indexOf(focusedStory)

      let nextIndex
      if (e.key === "ArrowLeft") {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : stories.length - 1
      } else {
        nextIndex = currentIndex < stories.length - 1 ? currentIndex + 1 : 0
      }

      stories[nextIndex].focus()
    }
  }
})

// Service Worker registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registered"))
      .catch((error) => console.log("SW registration failed"))
  })
}
