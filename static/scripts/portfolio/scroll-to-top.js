document.addEventListener("DOMContentLoaded", () => {
    const scrollToTopBtn = document.getElementById("scrollToTop")

    if (!scrollToTopBtn) return

    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add("visible")
        } else {
            scrollToTopBtn.classList.remove("visible")
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    window.addEventListener("scroll", toggleScrollButton)
    scrollToTopBtn.addEventListener("click", scrollToTop)

    scrollToTopBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            scrollToTop()
        }
    })

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
