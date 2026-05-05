export function initVideoGamarco() {
    const videoBox = document.getElementById("videoBox");
    const video = document.getElementById("videoGamarco");

    if (!videoBox || !video) return;

    videoBox.addEventListener("click", async () => {
        videoBox.classList.add("active");

        video.controls = false;
        video.loop = true;
        video.muted = true; 
        video.playsInline = true;

        try {
            await video.play();
        } catch (error) {
            console.log("Erro ao iniciar o vídeo:", error);
        }
    });
}