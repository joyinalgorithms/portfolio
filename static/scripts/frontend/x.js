// X Clone Interactive Features
class XApp {
  constructor() {
    this.isMobile = window.innerWidth <= 768
    this.characterLimit = 280
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupMobileMenu()
    this.setupTweetComposer()
    this.setupTweetInteractions()
    this.setupTabNavigation()
    this.setupInfiniteScroll()
    this.setupSearch()
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

  // Tweet composer functionality
  setupTweetComposer() {
    const composerInput = document.querySelector(".composer-input")
    const characterCount = document.querySelector(".character-count .count")
    const postBtn = document.querySelector(".post-submit-btn")
    const composer = document.querySelector(".tweet-composer")

    if (composerInput && characterCount && postBtn) {
      composerInput.addEventListener("input", (e) => {
        const text = e.target.value
        const remaining = this.characterLimit - text.length

        // Update character count
        characterCount.textContent = remaining

        // Update character count styling
        const countElement = characterCount.parentElement
        countElement.classList.remove("warning", "danger")

        if (remaining < 20) {
          countElement.classList.add("warning")
        }
        if (remaining < 0) {
          countElement.classList.add("danger")
        }

        // Enable/disable post button
        postBtn.disabled = text.trim().length === 0 || remaining < 0

        // Auto-resize textarea
        e.target.style.height = "auto"
        e.target.style.height = e.target.scrollHeight + "px"
      })

      composerInput.addEventListener("focus", () => {
        composer.classList.add("focused")
      })

      composerInput.addEventListener("blur", () => {
        composer.classList.remove("focused")
      })

      // Post button functionality
      postBtn.addEventListener("click", () => {
        this.handleTweetPost(composerInput.value.trim())
      })

      // Keyboard shortcuts
      composerInput.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          if (!postBtn.disabled) {
            this.handleTweetPost(composerInput.value.trim())
          }
        }
      })
    }
  }

  // Handle tweet posting
  handleTweetPost(text) {
    if (!text) return

    const composerInput = document.querySelector(".composer-input")
    const postBtn = document.querySelector(".post-submit-btn")
    const characterCount = document.querySelector(".character-count .count")

    // Show posting state
    postBtn.textContent = "Posting..."
    postBtn.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Reset composer
      composerInput.value = ""
      composerInput.style.height = "auto"
      characterCount.textContent = this.characterLimit
      characterCount.parentElement.classList.remove("warning", "danger")

      // Reset button
      postBtn.textContent = "Post"
      postBtn.disabled = false

      console.log("Tweet posted:", text)

      // Show success feedback
      this.showNotification("Your post was sent!", "success")

      // Haptic feedback for mobile
      if ("vibrate" in navigator && this.isMobile) {
        navigator.vibrate(100)
      }
    }, 1500)
  }

  // Tab navigation functionality
  setupTabNavigation() {
    const navTabs = document.querySelectorAll(".nav-tab")

    navTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        navTabs.forEach((t) => t.classList.remove("active"))

        // Add active class to clicked tab
        tab.classList.add("active")

        const tabType = tab.dataset.tab
        console.log(`Switched to ${tabType} tab`)

        // Here you would typically load different content based on the tab
        this.loadTabContent(tabType)
      })
    })
  }

  // Load content based on tab selection
  loadTabContent(tabType) {
    const tweetFeed = document.querySelector(".tweet-feed")

    if (tweetFeed) {
      // Add loading state
      tweetFeed.classList.add("loading")

      // Simulate content loading
      setTimeout(() => {
        tweetFeed.classList.remove("loading")
        console.log(`Loaded ${tabType} content`)
      }, 500)
    }
  }

  // Tweet interactions
  setupTweetInteractions() {
    document.addEventListener("click", (e) => {
      // Like button functionality
      if (e.target.closest(".like-btn")) {
        this.handleLike(e.target.closest(".like-btn"))
      }

      // Retweet button functionality
      if (e.target.closest(".retweet-btn")) {
        this.handleRetweet(e.target.closest(".retweet-btn"))
      }

      // Reply button functionality
      if (e.target.closest(".reply-btn")) {
        this.handleReply(e.target.closest(".reply-btn"))
      }

      // Bookmark functionality
      if (e.target.closest(".bookmark-btn")) {
        this.handleBookmark(e.target.closest(".bookmark-btn"))
      }

      // Follow button functionality
      if (e.target.closest(".follow-btn")) {
        this.handleFollow(e.target.closest(".follow-btn"))
      }

      // Subscribe button functionality
      if (e.target.closest(".subscribe-btn")) {
        this.handleSubscribe(e.target.closest(".subscribe-btn"))
      }

      // Trend item clicks
      if (e.target.closest(".trend-item")) {
        this.handleTrendClick(e.target.closest(".trend-item"))
      }
    })
  }

  // Handle like button clicks
  handleLike(button) {
    const isLiked = button.classList.contains("liked")
    const countElement = button.querySelector(".action-count")
    let currentCount = Number.parseInt(countElement.textContent) || 0

    // Toggle like state
    button.classList.toggle("liked")

    // Update count
    currentCount = isLiked ? currentCount - 1 : currentCount + 1
    countElement.textContent = this.formatNumber(currentCount)

    // Add animation
    button.classList.add("like-animation")
    setTimeout(() => button.classList.remove("like-animation"), 300)

    // Update icon and color
    const icon = button.querySelector("i")
    if (isLiked) {
      icon.className = "ri-heart-line"
      button.style.color = ""
    } else {
      icon.className = "ri-heart-fill"
      button.style.color = "var(--red)"
    }

    // Haptic feedback
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate(50)
    }

    console.log(`Tweet ${isLiked ? "unliked" : "liked"}`)
  }

  // Handle retweet button clicks
  handleRetweet(button) {
    const isRetweeted = button.classList.contains("retweeted")
    const countElement = button.querySelector(".action-count")
    let currentCount = Number.parseInt(countElement.textContent) || 0

    // Toggle retweet state
    button.classList.toggle("retweeted")

    // Update count
    currentCount = isRetweeted ? currentCount - 1 : currentCount + 1
    countElement.textContent = this.formatNumber(currentCount)

    // Add animation
    button.classList.add("retweet-animation")
    setTimeout(() => button.classList.remove("retweet-animation"), 600)

    // Update color
    if (isRetweeted) {
      button.style.color = ""
    } else {
      button.style.color = "var(--green)"
    }

    // Haptic feedback
    if ("vibrate" in navigator && this.isMobile) {
      navigator.vibrate([50, 50, 50])
    }

    console.log(`Tweet ${isRetweeted ? "unretweeted" : "retweeted"}`)
  }

  // Handle reply button clicks
  handleReply(button) {
    // Add visual feedback
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = ""
    }, 150)

    // Here you would typically open a reply composer
    console.log("Reply clicked")
    this.showNotification("Reply feature coming soon!", "info")
  }

  // Handle bookmark functionality
  handleBookmark(button) {
    const isBookmarked = button.classList.contains("bookmarked")
    button.classList.toggle("bookmarked")

    // Update icon
    const icon = button.querySelector("i")
    if (isBookmarked) {
      icon.className = "ri-bookmark-line"
      button.style.color = ""
    } else {
      icon.className = "ri-bookmark-fill"
      button.style.color = "var(--x-blue)"
    }

    // Visual feedback
    button.style.transform = "scale(1.1)"
    setTimeout(() => {
      button.style.transform = ""
    }, 200)

    console.log(`Tweet ${isBookmarked ? "unbookmarked" : "bookmarked"}`)
  }

  // Handle follow button
  handleFollow(button) {
    const isFollowing = button.classList.contains("following")

    if (isFollowing) {
      button.textContent = "Follow"
      button.classList.remove("following")
      button.style.backgroundColor = "var(--x-dark)"
    } else {
      button.textContent = "Following"
      button.classList.add("following")
      button.style.backgroundColor = "var(--x-gray)"
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

  // Handle subscribe button
  handleSubscribe(button) {
    const isSubscribed = button.classList.contains("subscribed")

    if (isSubscribed) {
      button.textContent = "Subscribe"
      button.classList.remove("subscribed")
      button.style.backgroundColor = "var(--x-dark)"
    } else {
      button.textContent = "Subscribed"
      button.classList.add("subscribed")
      button.style.backgroundColor = "var(--x-blue)"
    }

    // Add visual feedback
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = ""
    }, 150)

    console.log(`User ${isSubscribed ? "unsubscribed" : "subscribed"}`)
  }

  // Handle trend clicks
  handleTrendClick(trendItem) {
    const hashtag = trendItem.querySelector(".trend-hashtag").textContent
    console.log(`Clicked on trend: ${hashtag}`)

    // Add click animation
    trendItem.style.transform = "scale(0.98)"
    setTimeout(() => {
      trendItem.style.transform = ""
    }, 200)

    // Here you would typically navigate to the trend page
    this.showNotification(`Exploring ${hashtag}`, "info")
  }

  // Search functionality
  setupSearch() {
    const searchInput = document.querySelector(".search-input")

    if (searchInput) {
      let searchTimeout

      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout)
        const query = e.target.value.trim()

        if (query.length > 2) {
          searchTimeout = setTimeout(() => {
            this.performSearch(query)
          }, 300)
        }
      })

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          const query = e.target.value.trim()
          if (query) {
            this.performSearch(query)
          }
        }
      })
    }
  }

  // Perform search
  performSearch(query) {
    console.log(`Searching for: ${query}`)
    // Here you would typically make an API call to search
    this.showNotification(`Searching for "${query}"...`, "info")
  }

  // Infinite scroll for tweets
  setupInfiniteScroll() {
    let loading = false

    window.addEventListener(
      "scroll",
      this.debounce(() => {
        if (loading) return

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement

        if (scrollTop + clientHeight >= scrollHeight - 1000) {
          loading = true
          this.loadMoreTweets().then(() => {
            loading = false
          })
        }
      }, 100),
    )
  }

  // Load more tweets
  async loadMoreTweets() {
    const tweetFeed = document.querySelector(".tweet-feed")

    // Show loading indicator
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "loading-indicator"
    loadingIndicator.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--x-gray);">
        <i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i>
        Loading more posts...
      </div>
    `

    if (tweetFeed) {
      tweetFeed.appendChild(loadingIndicator)
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Remove loading indicator
    if (loadingIndicator.parentNode) {
      loadingIndicator.remove()
    }

    console.log("Loading more tweets...")
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

    // Quick actions with keyboard shortcuts
    if (!e.target.matches("input, textarea")) {
      switch (e.key.toLowerCase()) {
        case "n":
          // Focus on tweet composer
          const composerInput = document.querySelector(".composer-input")
          if (composerInput) {
            composerInput.focus()
          }
          break
        case "/":
          // Focus on search
          e.preventDefault()
          const searchInput = document.querySelector(".search-input")
          if (searchInput) {
            searchInput.focus()
          }
          break
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

  // Utility functions
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

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Show notification
  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    const colors = {
      success: "var(--green)",
      error: "var(--red)",
      warning: "#ff9800",
      info: "var(--x-blue)",
    }

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--white);
      color: var(--x-dark);
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px var(--shadow-medium);
      border-left: 4px solid ${colors[type] || colors.info};
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      font-size: 14px;
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
  window.xApp = new XApp()
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
  if (window.xApp) {
    window.xApp.showNotification("You're back online!", "success")
  }
})

window.addEventListener("offline", () => {
  if (window.xApp) {
    window.xApp.showNotification("You're offline", "warning")
  }
})

// Handle visibility change for performance optimization
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("App hidden - pausing operations")
  } else {
    console.log("App visible - resuming operations")
  }
})

// Add CSS for spin animation
const style = document.createElement("style")
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)
