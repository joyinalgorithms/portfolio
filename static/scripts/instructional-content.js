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
});
