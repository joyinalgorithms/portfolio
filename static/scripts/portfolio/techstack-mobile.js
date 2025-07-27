document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("animate")
                }, index * 100)
            }
        })
    }, observerOptions)

    document.querySelectorAll(".tech-item").forEach((item) => {
        observer.observe(item)
    })

    function animateTech(element) {
        element.style.transform = "scale(0.95)"
        setTimeout(() => {
            element.style.transform = ""
        }, 150)

        const proficiencyFill = element.querySelector(".proficiency-fill")
        if (proficiencyFill) {
            proficiencyFill.style.width = "0"
            setTimeout(() => {
                proficiencyFill.style.width = element.style.getPropertyValue("--proficiency")
            }, 200)
        }
        createRipple(element)
    }

    function createRipple(element) {
        const ripple = document.createElement("div")
        const rect = element.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = event.clientX - rect.left - size / 2
        const y = event.clientY - rect.top - size / 2

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 255, 136, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `

        element.style.position = "relative"
        element.appendChild(ripple)

        setTimeout(() => {
            ripple.remove()
        }, 600)
    }

    const style = document.createElement("style")
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `
    document.head.appendChild(style)

    document.querySelectorAll(".tech-item").forEach((item) => {
        item.setAttribute("tabindex", "0")

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                animateTech(item)
            }
        })
    })

    // Performance optimization: lazy load images
    const techIcons = document.querySelectorAll(".tech-icon")
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

    techIcons.forEach((icon) => {
        imageObserver.observe(icon)
    })
})
