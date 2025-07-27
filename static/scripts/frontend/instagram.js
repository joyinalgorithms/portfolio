// Instagram Clone Interactive Features
class InstagramApp {
  constructor() {
    this.isMobile = window.innerWidth <= 768
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupMobileMenu()
    this.setupPostInteractions()
    this.setupStoryInteractions()
    this.setupInfiniteScroll()
    this.setupImageLazyLoading()
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const mobileCloseBtn = document.getElementById("mobileCloseBtn")
    const mobileOverlay = document.getElementById("mobileOverlay")
    const sidebar = document.getElementById("sidebar")

    const openMenu = () => {
      sidebar.classList.add("active")
      mobileOverlay.classList.add("active")
      document.body.style.overflow = "hidden"
    }

    const closeMenu = () => {
      sidebar.classList.remove("active")
      mobileOverlay.classList.remove("active")
      document.body.style.overflow = ""
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", openMenu)
    }

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", closeMenu)
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", closeMenu)
    }
  }

  // Enhanced post interactions
  setupPostInteractions() {
    document.addEventListener("click", (e) => {
      // Like button functionality
      if (e.target.closest(".like-btn")) {
        this.handleLike(e.target.closest(".like-btn"))
      }

      // Double tap to like
      if (e.target.closest(".like-double-tap")) {
        this.handleDoubleTapLike(e.target.closest(".like-double-tap"))
      }

      // Follow button functionality
      if (e.target.closest(".follow-btn")) {
        this.handleFollow(e.target.closest(".follow-btn"))
      }

      // Bookmark functionality
      if (e.target.closest(".bookmark-btn")) {
        this.handleBookmark(e.target.closest(".bookmark-btn"))
      }

      // Comment functionality
      if (e.target.closest(".post-comment-btn")) {
        this.handleComment(e.target.closest(".post-comment-btn"))
      }
    })

    // Handle comment input
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.target.matches(".add-comment input")) {
        const commentBtn = e.target.parentElement.querySelector(".post-comment-btn")
        if (commentBtn) {
          this.handleComment(commentBtn)
        }
      }
    })
  }

  // Handle like button clicks
  handleLike(button) {
    const post = button.closest(".post")
    const likesElement = post.querySelector(".post-likes strong")
    const isLiked = button.classList.contains("liked")

    // Toggle like state
    button.classList.toggle("liked")

    // Update like count
    let currentLikes = Number.parseInt(likesElement.textContent.match(/\d+/)[0])
    currentLikes = isLiked ? currentLikes - 1 : currentLikes + 1

    // Animate the change
    button.classList.add("like-animation")
    setTimeout(() => button.classList.remove("like-animation"), 300)

    // Update text
    likesElement.textContent = `${currentLikes} ${currentLikes === 1 ? "like" : "likes"}`

    // Haptic feedback for mobile
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate(50)
    }

    console.log(`Post ${isLiked ? "unliked" : "liked"}`)
  }

  // Handle double tap to like
  handleDoubleTapLike(element) {
    const post = element.closest(".post")
    const likeBtn = post.querySelector(".like-btn")

    // Only like if not already liked
    if (!likeBtn.classList.contains("liked")) {
      this.handleLike(likeBtn)
    }

    // Create heart animation
    this.createHeartAnimation(element)

    // Haptic feedback
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate([50, 50, 50])
    }
  }

  // Create heart animation for double tap
  createHeartAnimation(container) {
    const heart = document.createElement("div")
    heart.innerHTML = "❤️"
    heart.className = "heart-animation"
    container.appendChild(heart)

    setTimeout(() => {
      if (heart.parentNode) {
        heart.remove()
      }
    }, 1000)
  }

  // Handle follow button
  handleFollow(button) {
    const isFollowing = button.classList.contains("following")

    if (isFollowing) {
      button.textContent = "Follow"
      button.classList.remove("following")
    } else {
      button.textContent = "Following"
      button.classList.add("following")
    }

    // Add visual feedback
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = ""
    }, 150)

    // Haptic feedback
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate(50)
    }

    console.log(`User ${isFollowing ? "unfollowed" : "followed"}`)
  }

  // Handle bookmark functionality
  handleBookmark(button) {
    const isBookmarked = button.classList.contains("bookmarked")
    button.classList.toggle("bookmarked")

    // Visual feedback
    button.style.transform = "scale(1.1)"
    setTimeout(() => {
      button.style.transform = ""
    }, 200)

    console.log(`Post ${isBookmarked ? "unbookmarked" : "bookmarked"}`)
  }

  // Handle comment submission
  handleComment(button) {
    const commentInput = button.parentElement.querySelector("input")
    const commentText = commentInput.value.trim()

    if (commentText) {
      // Simulate comment submission
      console.log("Comment posted:", commentText)

      // Clear input
      commentInput.value = ""

      // Show feedback
      const originalText = button.textContent
      button.textContent = "Posted!"
      button.style.color = "var(--instagram-primary)"

      setTimeout(() => {
        button.textContent = originalText
        button.style.color = ""
      }, 1500)

      // Haptic feedback
      if ("vibrate" in navigator && this.isMobile) {
        navigator.vibrate(100)
      }
    }
  }

  // Story interactions
  setupStoryInteractions() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".story-item")) {
        this.handleStoryClick(e.target.closest(".story-item"))
      }
    })
  }

  // Handle story clicks
  handleStoryClick(storyItem) {
    // Add click animation
    const avatar = storyItem.querySelector(".story-avatar")
    avatar.style.transform = "scale(0.95)"
    setTimeout(() => {
      avatar.style.transform = ""
    }, 200)

    // Haptic feedback
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate(50)
    }

    console.log("Story clicked:", storyItem.querySelector(".story-username").textContent)
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
    // Show loading indicator
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "loading-indicator"
    loadingIndicator.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--instagram-gray);">
        Loading more posts...
      </div>
    `

    const postsContainer = document.querySelector(".posts-feed")
    postsContainer.appendChild(loadingIndicator)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Remove loading indicator
    loadingIndicator.remove()

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
              img.classList.remove("loading")
              observer.unobserve(img)
            }
          }
        })
      })

      // Observe all images with data-src attribute
      document.querySelectorAll("img[data-src]").forEach((img) => {
        img.classList.add("loading")
        imageObserver.observe(img)
      })
    }
  }

  // Enhanced event listeners
  setupEventListeners() {
    // Navigation item clicks
    document.addEventListener("click", (e) => {
      if (e.target.closest(".nav-item")) {
        this.handleNavigation(e.target.closest(".nav-item"))
      }

      if (e.target.closest(".mobile-nav-item")) {
        this.handleMobileNavigation(e.target.closest(".mobile-nav-item"))
      }
    })

    // Responsive handling
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.isMobile = window.innerWidth <= 768
        this.handleResize()
      }, 250),
    )

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e)
    })
  }

  // Handle navigation clicks
  handleNavigation(navItem) {
    // Remove active class from all nav items
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Add active class to clicked item
    navItem.classList.add("active")

    const navText = navItem.querySelector(".nav-text")?.textContent || "Unknown"
    console.log(`Navigated to: ${navText}`)
  }

  // Handle mobile navigation
  handleMobileNavigation(navItem) {
    // Remove active class from all mobile nav items
    document.querySelectorAll(".mobile-nav-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Add active class to clicked item
    navItem.classList.add("active")

    console.log("Mobile navigation clicked")
  }

  // Handle keyboard navigation
  handleKeyboardNavigation(e) {
    // Close mobile menu with Escape key
    if (e.key === "Escape") {
      const sidebar = document.getElementById("sidebar")
      const overlay = document.getElementById("mobileOverlay")

      if (sidebar && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active")
        overlay.classList.remove("active")
        document.body.style.overflow = ""
      }
    }

    // Navigate stories with arrow keys
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const focusedStory = document.activeElement
      if (focusedStory && focusedStory.classList.contains("story-item")) {
        e.preventDefault()
        const stories = Array.from(document.querySelectorAll(".story-item"))
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

    // Like post with 'L' key
    if (e.key.toLowerCase() === "l" && !e.target.matches("input, textarea")) {
      const focusedPost = document.activeElement.closest(".post")
      if (focusedPost) {
        const likeBtn = focusedPost.querySelector(".like-btn")
        if (likeBtn) {
          this.handleLike(likeBtn)
        }
      }
    }
  }

  // Handle window resize
  handleResize() {
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("mobileOverlay")

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

  // Create notification
  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--white);
      color: var(--instagram-gray-dark);
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px var(--shadow-medium);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }, 3000)
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.instagramApp = new InstagramApp()
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

// Handle online/offline status
window.addEventListener("online", () => {
  if (window.instagramApp) {
    window.instagramApp.showNotification("You're back online!", "success")
  }
})

window.addEventListener("offline", () => {
  if (window.instagramApp) {
    window.instagramApp.showNotification("You're offline", "warning")
  }
})

// Handle visibility change for performance optimization
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause any animations or heavy operations
    console.log("App hidden - pausing operations")
  } else {
    // Resume operations
    console.log("App visible - resuming operations")
  }
})
