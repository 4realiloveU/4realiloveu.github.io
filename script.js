// Hahahahah
// script.js versi TikWM API
document.getElementById("downloadBtn").addEventListener("click", async () => {
  const url = document.getElementById("videoUrl").value.trim();
  const resultBox = document.getElementById("result");
  const statusText = document.getElementById("statusText");
  const preview = document.getElementById("preview");

  if (!url) return alert("Masukkan URL Tiktok terlebih dahulu!");

  resultBox.classList.remove("hidden");
  statusText.textContent = "Sedang memproses...";

  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (data.data && data.data.play) {
      const videoLink = data.data.play;
      preview.src = videoLink;
      preview.classList.remove("hidden");
      statusText.textContent = "Video berhasil dimuat!";
    } else {
      statusText.textContent = "Gagal memuat video.";
    }
  } catch (err) {
    statusText.textContent = "⚠️ Terjadi kesalahan saat mengambil data ⚠️.";
  }
});
