document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    const navbar = document.querySelector(".navbar")
    const dropdowns = document.querySelectorAll(".dropdown")
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", function() {
            this.classList.toggle("active")
            navbar.classList.toggle("mobile-open")
            const isExpanded = this.classList.contains("active")
            this.setAttribute("aria-expanded", isExpanded)

            document.body.style.overflow = isExpanded ? "hidden" : ""
        })
    }

    document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove("active")
            navbar.classList.remove("mobile-open")
            mobileMenuToggle.setAttribute("aria-expanded", "false")
            document.body.style.overflow = ""
        }
    })

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle")
        const content = dropdown.querySelector(".dropdown-content")

        if (toggle && content) {
            toggle.addEventListener("click", (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault()
                    dropdown.classList.toggle("active")

                    const isExpanded = dropdown.classList.contains("active")
                    toggle.setAttribute("aria-expanded", isExpanded)
                }
            })
        }
    })

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute("href"))
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })

                if (window.innerWidth <= 768) {
                    mobileMenuToggle.classList.remove("active")
                    navbar.classList.remove("mobile-open")
                    document.body.style.overflow = ""
                }
            }
        })
    })

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in")
            }
        })
    }, observerOptions)

    document.querySelectorAll(".footer-section, .skill-tag, .about-footer-content").forEach((el) => {
        observer.observe(el)
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navbar.classList.contains("mobile-open")) {
            mobileMenuToggle.classList.remove("active")
            navbar.classList.remove("mobile-open")
            mobileMenuToggle.setAttribute("aria-expanded", "false")
            document.body.style.overflow = ""
            mobileMenuToggle.focus()
        }
    })

    let resizeTimer
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove("active")
                navbar.classList.remove("mobile-open")
                document.body.style.overflow = ""

                dropdowns.forEach((dropdown) => {
                    dropdown.classList.remove("active")
                })
            }
        }, 250)
    })


    const preloadLinks = ["/static/styles/layout.css", "/static/scripts/layout.js"]

    preloadLinks.forEach((href) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.href = href
        link.as = href.endsWith(".css") ? "style" : "script"
        document.head.appendChild(link)
    })
})

// Service Worker registration for better performance (optional)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("SW registered: ", registration)
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError)
            })
    })
}
