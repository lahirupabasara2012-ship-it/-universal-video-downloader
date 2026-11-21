const input = document.getElementById("videoUrl");
const checkBtn = document.getElementById("checkBtn");
const message = document.getElementById("message");
const previewBox = document.getElementById("previewBox");
const player = document.getElementById("videoPlayer");
const downloadBtn = document.getElementById("downloadBtn");
const downloadMessage = document.getElementById("downloadMessage");

let currentUrl = "";

checkBtn.addEventListener("click", () => {
    const value = input.value.trim();

    previewBox.classList.add("hidden");
    message.textContent = "";
    player.pause();
    player.removeAttribute("src");
    player.load();

    try {
        const url = new URL(value);

        if (url.protocol !== "https:") {
            throw new Error("Please use an HTTPS URL.");
        }

        const extension = url.pathname.split(".").pop().toLowerCase();

        if (!["mp4", "webm", "ogg"].includes(extension)) {
            throw new Error("Enter a direct MP4, WebM or OGG video URL.");
        }

        currentUrl = url.href;
        player.src = currentUrl;
        previewBox.classList.remove("hidden");
        message.textContent = "Checking video...";

        player.onloadedmetadata = () => {
            message.textContent = "Video is ready!";
        };

        player.onerror = () => {
            message.textContent =
                "Preview unavailable. The source may block playback.";
        };

    } catch (error) {
        message.textContent = error.message || "Invalid URL.";
    }
});

downloadBtn.addEventListener("click", () => {
    if (!currentUrl) return;

    const quality = document.getElementById("quality").value;
    const format = document.getElementById("format").value;

    if (quality !== "source" || format !== "original") {
        downloadMessage.textContent =
            "This direct link does not support quality conversion. Choose Original Quality and Original Format.";
        return;
    }

    const link = document.createElement("a");
    link.href = currentUrl;
    link.download = "";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();

    downloadMessage.textContent =
        "Download requested. The source server controls the final download.";
});
