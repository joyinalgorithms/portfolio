// Performance optimizations and mobile enhancements
class ChristmasApp {
  constructor() {
    this.snowflakeCount = 0
    this.maxSnowflakes = this.getMaxSnowflakes()
    this.isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    this.init()
  }

  // Determine max snowflakes based on device capabilities
  getMaxSnowflakes() {
    const isMobile = window.innerWidth <= 768
    const isLowEnd = navigator.hardwareConcurrency <= 2

    if (isMobile || isLowEnd) return 15
    return 25
  }

  init() {
    this.checkChristmas()
    this.updateCountdown()
    this.setupEventListeners()
    this.startSnowfall()
    this.setupIntersectionObserver()

    // Update countdown every hour instead of every second for better performance
    setInterval(() => this.updateCountdown(), 3600000)
  }

  // Enhanced Christmas detection with better UX
  checkChristmas() {
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()
    const answerText = document.getElementById("answerText")
    const answerEmoji = document.getElementById("answerEmoji")

    if (currentMonth === 12 && currentDay === 25) {
      answerText.innerHTML = "<h2>YES! 🎉</h2>"
      answerEmoji.textContent = "🎅"
      answerEmoji.setAttribute("aria-label", "Santa Claus - It is Christmas!")
      document.body.style.background = "linear-gradient(135deg, #e74c3c 0%, #27ae60 50%, #f39c12 100%)"

      if (!this.isReducedMotion) {
        this.createFireworks()
      }
    } else {
      answerText.innerHTML = "<h2>Not yet... 😢</h2>"
      answerEmoji.textContent = "⏰"
      answerEmoji.setAttribute("aria-label", "Clock - Not Christmas yet")
    }
  }

  // Optimized countdown with better formatting
  updateCountdown() {
    const today = new Date()
    const currentYear = today.getFullYear()
    let christmas = new Date(currentYear, 11, 25)

    if (today > christmas) {
      christmas = new Date(currentYear + 1, 11, 25)
    }

    const timeDiff = christmas - today
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    const timerElement = document.getElementById("countdownTimer")
    if (timerElement) {
      timerElement.textContent = `${days} ${days === 1 ? "day" : "days"}`
    }
  }

  // Performance-optimized snowfall
  createSnowflake() {
    if (this.snowflakeCount >= this.maxSnowflakes || this.isReducedMotion) return

    const snowflake = document.createElement("div")
    snowflake.className = "snowflake"
    snowflake.innerHTML = ["❄", "❅", "❆"][Math.floor(Math.random() * 3)]
    snowflake.style.left = Math.random() * 100 + "vw"
    snowflake.style.animationDuration = Math.random() * 3 + 2 + "s"
    snowflake.style.opacity = Math.random() * 0.8 + 0.2
    snowflake.style.fontSize = Math.random() * 8 + 8 + "px"

    // Use transform for better performance
    snowflake.style.transform = "translateZ(0)"

    document.body.appendChild(snowflake)
    this.snowflakeCount++

    // Clean up snowflake after animation
    setTimeout(() => {
      if (snowflake.parentNode) {
        snowflake.remove()
        this.snowflakeCount--
      }
    }, 5000)
  }

  startSnowfall() {
    if (this.isReducedMotion) return

    // Adjust snowfall frequency based on device
    const interval = window.innerWidth <= 768 ? 500 : 300
    setInterval(() => this.createSnowflake(), interval)
  }

  // Enhanced tree shake with better mobile support
  shakeTree() {
    const tree = document.querySelector(".christmas-tree")
    if (!tree) return

    tree.style.animation = "none"
    tree.offsetHeight // Force reflow
    tree.style.animation = "bounce 0.5s ease-in-out"

    // Create sparkles with performance consideration
    if (!this.isReducedMotion) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => this.createMagicSparkle(), i * 100)
      }
    }

    // Haptic feedback for mobile devices
    if ("vibrate" in navigator) {
      navigator.vibrate(100)
    }
  }

  // Optimized sparkle creation
  createMagicSparkle() {
    const sparkle = document.createElement("div")
    sparkle.innerHTML = "✨"
    sparkle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            font-size: 1.5rem;
            pointer-events: none;
            animation: fall 2s linear forwards;
            transform: translateZ(0);
        `

    document.body.appendChild(sparkle)

    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.remove()
      }
    }, 2000)
  }

  // Enhanced present opening with better accessibility
  openPresent(present) {
    const surprises = ["🎁", "🧸", "🍪", "🎮", "📚", "🎨", "🧩", "🎵"]
    const surprise = surprises[Math.floor(Math.random() * surprises.length)]

    // Store original content for restoration
    const originalContent = present.innerHTML
    const originalStyle = present.style.cssText

    present.innerHTML = surprise
    present.style.transform = "scale(1.3) rotate(180deg)"
    present.style.background = "#ffd700"
    present.setAttribute("aria-label", `Present opened! You found: ${this.getEmojiDescription(surprise)}`)

    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate([50, 50, 50])
    }

    setTimeout(() => {
      present.innerHTML = originalContent
      present.style.cssText = originalStyle
      present.setAttribute("aria-label", "Click to open present")
    }, 2500)
  }

  // Helper function for accessibility
  getEmojiDescription(emoji) {
    const descriptions = {
      "🎁": "gift box",
      "🧸": "teddy bear",
      "🍪": "cookie",
      "🎮": "video game controller",
      "📚": "books",
      "🎨": "art supplies",
      "🧩": "puzzle piece",
      "🎵": "musical note",
    }
    return descriptions[emoji] || "surprise"
  }

  // Optimized fireworks for Christmas day
  createFireworks() {
    const fireworkCount = window.innerWidth <= 768 ? 5 : 10

    for (let i = 0; i < fireworkCount; i++) {
      setTimeout(() => {
        const firework = document.createElement("div")
        firework.innerHTML = "🎆"
        firework.style.cssText = `
                    position: absolute;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 50}vh;
                    font-size: 2rem;
                    pointer-events: none;
                    animation: spin 1s linear infinite;
                    transform: translateZ(0);
                `

        document.body.appendChild(firework)

        setTimeout(() => {
          if (firework.parentNode) {
            firework.remove()
          }
        }, 3000)
      }, i * 300)
    }
  }

  // Setup all event listeners
  setupEventListeners() {
    // Main question click interaction
    const question = document.querySelector(".question")
    if (question) {
      question.addEventListener("click", () => {
        if (!this.isReducedMotion) {
          question.style.animation = "none"
          question.offsetHeight
          question.style.animation = "bounce 1s ease-in-out"
          this.createMagicSparkle()
        }
      })
    }

    // Keyboard interactions with better accessibility
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          e.preventDefault()
          if (!this.isReducedMotion) this.createMagicSparkle()
          break
        case "Enter":
          if (e.target.classList.contains("christmas-tree")) {
            this.shakeTree()
          }
          break
      }
    })

    // Touch events for better mobile experience
    document.addEventListener("touchstart", (e) => {
      if (e.target.classList.contains("present")) {
        e.target.style.transform = "scale(0.95)"
      }
    })

    document.addEventListener("touchend", (e) => {
      if (e.target.classList.contains("present")) {
        e.target.style.transform = ""
      }
    })

    // Resize handler for responsive adjustments
    let resizeTimeout
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.maxSnowflakes = this.getMaxSnowflakes()
      }, 250)
    })
  }

  // Intersection Observer for performance optimization
  setupIntersectionObserver() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible")
            }
          })
        },
        { threshold: 0.1 },
      )

      // Observe main sections for lazy loading effects
      document
        .querySelectorAll(".answer-section, .tree-section, .presents-section, .countdown-section")
        .forEach((section) => {
          observer.observe(section)
        })
    }
  }
}

// Keyboard accessibility handlers
function handleTreeKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    shakeTree()
  }
}

function handlePresentKeydown(event, present) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    openPresent(present)
  }
}

// Global functions for backward compatibility
function shakeTree() {
  if (window.christmasApp) {
    window.christmasApp.shakeTree()
  }
}

function openPresent(present) {
  if (window.christmasApp) {
    window.christmasApp.openPresent(present)
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.christmasApp = new ChristmasApp()
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
