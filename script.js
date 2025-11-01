const inputBtn = document.getElementById("downloadBtnInput");
const urlInput = document.getElementById("videoUrl");
const resultBox = document.getElementById("result");
const statusText = document.getElementById("statusText");
const preview = document.getElementById("preview");
const downloadVideo = document.getElementById("downloadVideo");

let videoLink = "";

inputBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return alert("Masukkan URL video TikTok dulu!");

  resultBox.classList.remove("hidden");
  statusText.textContent = "Sedang memproses...";

  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (data && data.data && data.data.play) {
      videoLink = data.data.play;
      preview.src = videoLink;
      preview.classList.remove("hidden");
      statusText.textContent = "Video siap diunduh.";
    } else {
      statusText.textContent = "Gagal memuat video. Coba link lain.";
    }
  } catch (err) {
    statusText.textContent = "Terjadi kesalahan saat mengambil data.";
    console.error(err);
  }
});

downloadVideo.addEventListener("click", async () => {
  if (!videoLink) return alert("Tidak ada video untuk diunduh.");

  statusText.textContent = "Menyiapkan unduhan...";

  try {
    const res = await fetch(videoLink);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tiktok_video.mp4";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    statusText.textContent = "Unduhan dimulai!";
  } catch (err) {
    console.error(err);
    statusText.textContent = "Gagal mengunduh video.";
  }
});
                                                                     
