// Offers page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Search functionality
  const searchInput = document.getElementById("searchInput")
  const clearSearch = document.getElementById("clearSearch")
  const categoryFilter = document.getElementById("categoryFilter")
  const priceFilter = document.getElementById("priceFilter")
  const techFilter = document.getElementById("techFilter")
  const resetFilters = document.getElementById("resetFilters")
  const resultsCount = document.getElementById("resultsCount")
  const searchSuggestions = document.getElementById("searchSuggestions")
  const suggestionTags = document.querySelectorAll(".suggestion-tag")
  const offerCards = document.querySelectorAll(".offer-card")

  // Search and filter function
  function filterOffers() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    const selectedCategory = categoryFilter.value
    const selectedPriceRange = priceFilter.value
    const selectedTech = techFilter.value

    let visibleCount = 0
    const hasActiveFilters = searchTerm || selectedCategory || selectedPriceRange || selectedTech

    offerCards.forEach((card) => {
      const category = card.dataset.category
      const price = Number.parseInt(card.dataset.price)
      const tech = card.dataset.tech.toLowerCase()
      const keywords = card.dataset.keywords.toLowerCase()
      const title = card.querySelector(".offer-title").textContent.toLowerCase()
      const description = card.querySelector(".offer-description").textContent.toLowerCase()

      let matchesSearch = true
      let matchesCategory = true
      let matchesPrice = true
      let matchesTech = true

      // Search term matching
      if (searchTerm) {
        const searchableText = `${title} ${description} ${keywords} ${tech}`.toLowerCase()
        matchesSearch = searchableText.includes(searchTerm)

        // Highlight search terms
        highlightSearchTerms(card, searchTerm)
      } else {
        // Remove highlights when no search term
        removeHighlights(card)
      }

      // Category filtering
      if (selectedCategory) {
        matchesCategory = category === selectedCategory
      }

      // Price filtering
      if (selectedPriceRange) {
        if (selectedPriceRange === "0-500") {
          matchesPrice = price < 500
        } else if (selectedPriceRange === "500-1000") {
          matchesPrice = price >= 500 && price <= 1000
        } else if (selectedPriceRange === "1000+") {
          matchesPrice = price > 1000
        }
      }

      // Technology filtering
      if (selectedTech) {
        matchesTech = tech.includes(selectedTech.toLowerCase())
      }

      // Show/hide card based on all criteria
      const shouldShow = matchesSearch && matchesCategory && matchesPrice && matchesTech

      if (shouldShow) {
        card.classList.remove("hidden")
        visibleCount++
      } else {
        card.classList.add("hidden")
      }
    })

    // Update results count
    updateResultsCount(visibleCount)

    // Show/hide suggestions
    searchSuggestions.style.display = searchTerm || hasActiveFilters ? "none" : "flex"

    // Show/hide clear button
    clearSearch.style.display = searchTerm ? "block" : "none"

    // Show no results message if needed
    showNoResultsMessage(visibleCount)
  }

  // Highlight search terms in card content
  function highlightSearchTerms(card, searchTerm) {
    const elementsToHighlight = [card.querySelector(".offer-title"), card.querySelector(".offer-description")]

    elementsToHighlight.forEach((element) => {
      if (element && !element.dataset.originalText) {
        element.dataset.originalText = element.innerHTML
      }

      if (element && element.dataset.originalText) {
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi")
        element.innerHTML = element.dataset.originalText.replace(regex, '<span class="search-highlight">$1</span>')
      }
    })
  }

  // Remove search term highlights
  function removeHighlights(card) {
    const elementsToHighlight = [card.querySelector(".offer-title"), card.querySelector(".offer-description")]

    elementsToHighlight.forEach((element) => {
      if (element && element.dataset.originalText) {
        element.innerHTML = element.dataset.originalText
      }
    })
  }

  // Escape special regex characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  // Update results count display
  function updateResultsCount(count) {
    const serviceText = count === 1 ? "service" : "services"
    resultsCount.textContent = `${count} ${serviceText} found`
  }

  // Show no results message
  function showNoResultsMessage(visibleCount) {
    let noResultsDiv = document.querySelector(".no-results")

    if (visibleCount === 0) {
      if (!noResultsDiv) {
        noResultsDiv = document.createElement("div")
        noResultsDiv.className = "no-results"
        noResultsDiv.innerHTML = `
          <div class="no-results-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>No services found</h3>
          <p>Try adjusting your search terms or filters to find what you're looking for.</p>
        `
        document.querySelector(".offers-container").appendChild(noResultsDiv)
      }
      noResultsDiv.style.display = "block"
    } else {
      if (noResultsDiv) {
        noResultsDiv.style.display = "none"
      }
    }
  }

  // Event listeners for search and filters
  searchInput.addEventListener("input", debounce(filterOffers, 300))
  categoryFilter.addEventListener("change", filterOffers)
  priceFilter.addEventListener("change", filterOffers)
  techFilter.addEventListener("change", filterOffers)

  // Clear search functionality
  clearSearch.addEventListener("click", () => {
    searchInput.value = ""
    filterOffers()
    searchInput.focus()
  })

  // Reset all filters
  resetFilters.addEventListener("click", () => {
    searchInput.value = ""
    categoryFilter.value = ""
    priceFilter.value = ""
    techFilter.value = ""
    filterOffers()
  })

  // Suggestion tags functionality
  suggestionTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const searchTerm = tag.dataset.search
      searchInput.value = searchTerm
      filterOffers()
    })
  })

  // Debounce function for search input
  function debounce(func, wait) {
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

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      searchInput.focus()
    }

    // Escape to clear search when focused
    if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = ""
      filterOffers()
    }
  })

  // Initialize search on page load
  filterOffers()

  // Demo videos data
  const demoVideos = {
    ecommerce: {
      title: "E-commerce Platform Demo",
      src: "/static/videos/offers/ecommerce-demo.mp4",
    },
    portfolio: {
      title: "Business Portfolio Demo",
      src: "/static/videos/offers/portfolio-demo.mp4",
    },
    restaurant: {
      title: "Restaurant Website Demo",
      src: "/static/videos/offers/restaurant-demo.mp4",
    },
    custom: {
      title: "Custom Web Application Demo",
      src: "/static/videos/offers/custom-demo.mp4",
    },
  }

  // Show demo modal
  window.showDemo = (offerType) => {
    const modal = document.getElementById("demoModal")
    const modalTitle = document.getElementById("modalTitle")
    const modalVideo = document.getElementById("modalVideo")

    if (demoVideos[offerType]) {
      modalTitle.textContent = demoVideos[offerType].title
      modalVideo.querySelector("source").src = demoVideos[offerType].src
      modalVideo.load() // Reload video with new source

      modal.style.display = "block"
      document.body.style.overflow = "hidden"

      // Auto-play video when modal opens
      modalVideo.play().catch((e) => {
        console.log("Auto-play prevented:", e)
      })
    }
  }

  // Close demo modal
  const closeDemo = () => {
    const modal = document.getElementById("demoModal")
    const modalVideo = document.getElementById("modalVideo")

    modal.style.display = "none"
    document.body.style.overflow = ""

    // Pause video when modal closes
    modalVideo.pause()
    modalVideo.currentTime = 0
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDemo()
    }
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

  // Observe offer cards
  document.querySelectorAll(".offer-card").forEach((card) => {
    observer.observe(card)
  })

  // Enhanced hover effects for offer cards
  document.querySelectorAll(".offer-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Add subtle animation to tech tags
      const techTags = card.querySelectorAll(".tech-tag")
      techTags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.transform = "translateY(-2px)"
        }, index * 50)
      })
    })

    card.addEventListener("mouseleave", () => {
      // Reset tech tags animation
      const techTags = card.querySelectorAll(".tech-tag")
      techTags.forEach((tag) => {
        tag.style.transform = "translateY(0)"
      })
    })
  })

  // Lazy loading for preview images
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

  document.querySelectorAll(".preview-image").forEach((img) => {
    imageObserver.observe(img)
  })

  // Price animation on scroll
  const priceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const priceElement = entry.target.querySelector(".current-price")
          if (priceElement && !priceElement.classList.contains("animated")) {
            priceElement.classList.add("animated")
            priceElement.style.animation = "priceGlow 1s ease-in-out"
          }
        }
      })
    },
    { threshold: 0.5 },
  )

  document.querySelectorAll(".pricing-section").forEach((section) => {
    priceObserver.observe(section)
  })

  // Add price glow animation
  const style = document.createElement("style")
  style.textContent = `
    @keyframes priceGlow {
      0%, 100% {
        text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
      }
      50% {
        text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        transform: scale(1.05);
      }
    }
  `
  document.head.appendChild(style)

  // Enhanced keyboard navigation
  document.querySelectorAll(".preview-btn").forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        btn.click()
      }
    })
  })

  // Track user interactions for analytics (optional)
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const offerCard = btn.closest(".offer-card")
      const offerType = offerCard.dataset.offer
      const actionType = btn.textContent.trim()

      // You can send this data to your analytics service
      console.log(`User clicked ${actionType} for ${offerType} offer`)
    })
  })
})
