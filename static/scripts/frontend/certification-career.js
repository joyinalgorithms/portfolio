document.getElementById('connect-recruiters-btn').addEventListener('click', function() {
    alert("You have been connected with top cybersecurity recruiters. Please check your dashboard for updates!");
});
// Simple scroll-based animation trigger
document.addEventListener("DOMContentLoaded", () => {
    const animatedSections = document.querySelectorAll(".fade-in, .fade-in-delay, .slide-up");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = "running";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    animatedSections.forEach(section => {
        section.style.animationPlayState = "paused";
        observer.observe(section);
    });
});
