document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".demo-video")
    const playButtons = document.querySelectorAll(".play-button")

    videos.forEach((video, index) => {
        const playButton = playButtons[index]
        const overlay = video.parentElement.querySelector(".video-overlay")

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

        video.addEventListener("click", () => {
            if (video.paused) {
                video.play()
                overlay.style.opacity = "0"
            } else {
                video.pause()
                overlay.style.opacity = "1"
            }
        })

        video.addEventListener("pause", () => {
            overlay.style.opacity = "1"
        })

        video.addEventListener("play", () => {
            overlay.style.opacity = "0"
        })

        video.addEventListener("ended", () => {
            overlay.style.opacity = "1"
        })
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

    document.querySelectorAll(".demo-card").forEach((card) => {
        observer.observe(card)
    })

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

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function(e) {
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

    document.addEventListener("keydown", (e) => {
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

    const videoIntersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const video = entry.target
                if (!entry.isIntersecting && !video.paused) {
                    video.pause()
                }
            })
        }, {
            threshold: 0.25
        },
    )

    videos.forEach((video) => {
        videoIntersectionObserver.observe(video)
    })
})
