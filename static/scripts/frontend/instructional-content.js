document.addEventListener("DOMContentLoaded", function() {
    function activateLesson(thumbnailId, videoId) {
        document.getElementById(thumbnailId).addEventListener("click", function() {
            this.classList.add("hidden");
            document.getElementById(videoId).classList.remove("hidden");
        });
    }

    activateLesson("thumb-1", "video-1");

    document.getElementById("next-lesson").addEventListener("click", function() {
        alert("You've completed the module!");
    });

    const thumb = document.getElementById('thumb-1');
    const video = document.getElementById('video-1');

    if (thumb && video) {
        thumb.addEventListener('click', () => {
            thumb.classList.add('hidden');
            video.classList.remove('hidden');
            video.src += "?autoplay=1"; // force autoplay when switching
        });
    }
});
