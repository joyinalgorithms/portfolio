document.addEventListener("DOMContentLoaded", () => {
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

            if (searchTerm) {
                const searchableText = `${title} ${description} ${keywords} ${tech}`.toLowerCase()
                matchesSearch = searchableText.includes(searchTerm)


                highlightSearchTerms(card, searchTerm)
            } else {
                removeHighlights(card)
            }

            if (selectedCategory) {
                matchesCategory = category === selectedCategory
            }

            if (selectedPriceRange) {
                if (selectedPriceRange === "0-500") {
                    matchesPrice = price < 500
                } else if (selectedPriceRange === "500-1000") {
                    matchesPrice = price >= 500 && price <= 1000
                } else if (selectedPriceRange === "1000+") {
                    matchesPrice = price > 1000
                }
            }

            if (selectedTech) {
                matchesTech = tech.includes(selectedTech.toLowerCase())
            }

            const shouldShow = matchesSearch && matchesCategory && matchesPrice && matchesTech

            if (shouldShow) {
                card.classList.remove("hidden")
                visibleCount++
            } else {
                card.classList.add("hidden")
            }
        })

        updateResultsCount(visibleCount)

        searchSuggestions.style.display = searchTerm || hasActiveFilters ? "none" : "flex"

        clearSearch.style.display = searchTerm ? "block" : "none"

        showNoResultsMessage(visibleCount)
    }

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

    function removeHighlights(card) {
        const elementsToHighlight = [card.querySelector(".offer-title"), card.querySelector(".offer-description")]

        elementsToHighlight.forEach((element) => {
            if (element && element.dataset.originalText) {
                element.innerHTML = element.dataset.originalText
            }
        })
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    function updateResultsCount(count) {
        const serviceText = count === 1 ? "service" : "services"
        resultsCount.textContent = `${count} ${serviceText} found`
    }

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

    searchInput.addEventListener("input", debounce(filterOffers, 300))
    categoryFilter.addEventListener("change", filterOffers)
    priceFilter.addEventListener("change", filterOffers)
    techFilter.addEventListener("change", filterOffers)

    clearSearch.addEventListener("click", () => {
        searchInput.value = ""
        filterOffers()
        searchInput.focus()
    })

    resetFilters.addEventListener("click", () => {
        searchInput.value = ""
        categoryFilter.value = ""
        priceFilter.value = ""
        techFilter.value = ""
        filterOffers()
    })

    suggestionTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            const searchTerm = tag.dataset.search
            searchInput.value = searchTerm
            filterOffers()
        })
    })

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

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault()
            searchInput.focus()
        }

        if (e.key === "Escape" && document.activeElement === searchInput) {
            searchInput.value = ""
            filterOffers()
        }
    })

    filterOffers()

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

    window.showDemo = (offerType) => {
        const modal = document.getElementById("demoModal")
        const modalTitle = document.getElementById("modalTitle")
        const modalVideo = document.getElementById("modalVideo")

        if (demoVideos[offerType]) {
            modalTitle.textContent = demoVideos[offerType].title
            modalVideo.querySelector("source").src = demoVideos[offerType].src
            modalVideo.load()

            modal.style.display = "block"
            document.body.style.overflow = "hidden"

            modalVideo.play().catch((e) => {
                console.log("Auto-play prevented:", e)
            })
        }
    }

    const closeDemo = () => {
        const modal = document.getElementById("demoModal")
        const modalVideo = document.getElementById("modalVideo")

        modal.style.display = "none"
        document.body.style.overflow = ""

        modalVideo.pause()
        modalVideo.currentTime = 0
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeDemo()
        }
    })

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

    document.querySelectorAll(".offer-card").forEach((card) => {
        observer.observe(card)
    })

    document.querySelectorAll(".offer-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
            const techTags = card.querySelectorAll(".tech-tag")
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = "translateY(-2px)"
                }, index * 50)
            })
        })

        card.addEventListener("mouseleave", () => {
            const techTags = card.querySelectorAll(".tech-tag")
            techTags.forEach((tag) => {
                tag.style.transform = "translateY(0)"
            })
        })
    })

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
        }, {
            threshold: 0.5
        },
    )

    document.querySelectorAll(".pricing-section").forEach((section) => {
        priceObserver.observe(section)
    })

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

    document.querySelectorAll(".preview-btn").forEach((btn) => {
        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                btn.click()
            }
        })
    })

    document.querySelectorAll(".action-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const offerCard = btn.closest(".offer-card")
            const offerType = offerCard.dataset.offer
            const actionType = btn.textContent.trim()

            console.log(`User clicked ${actionType} for ${offerType} offer`)
        })
    })
})
