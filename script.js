// 🎬 TikTok Downloader versi Andika (pakai proxy Replit)
const inputBtn = document.getElementById("downloadBtn");
const urlInput = document.getElementById("videoUrl");
const resultBox = document.getElementById("result");
const statusText = document.getElementById("statusText");
const preview = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");

let videoLink = "";

inputBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return alert("Masukkan URL video TikTok dulu!");

  resultBox.classList.remove("hidden");
  statusText.textContent = "⏳ Sedang memproses...";

  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (data && data.data && data.data.play) {
      videoLink = data.data.play;
      preview.src = videoLink;
      preview.classList.remove("hidden");
      saveBtn.classList.remove("hidden");
      statusText.textContent = "✅ Video siap diunduh.";
    } else {
      statusText.textContent = "❌ Gagal memuat video. Coba link lain.";
    }
  } catch (err) {
    console.error(err);
    statusText.textContent = "⚠️ Terjadi kesalahan saat mengambil data.";
  }
});

saveBtn.addEventListener("click", async () => {
  if (!videoLink) return alert("Tidak ada video untuk diunduh.");

  statusText.textContent = "📥 Menyiapkan unduhan...";

  // 🔗 Proxy Replit kamu
  const proxyBase = "https://d2bcc566-26c3-4ba5-bfb7-ae22220d4056-00-2tfg78sku82dq.picard.replit.dev";
  const proxyUrl = `${proxyBase}/download?url=${encodeURIComponent(videoLink)}`;

  try {
    const response = await fetch(proxyUrl);
    const blob = await response.blob();

    // 🔥 Nama file random seperti request kamu
    const date = new Date().toISOString().split("T")[0];
    const random = Math.floor(Math.random() * 9999);
    const filename = `4realiloveu_${date}_${random}.mp4`;

    // 🔽 Download blob tanpa pindah tab
    const a = document.createElement("a");
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);

    statusText.textContent = "✅ Unduhan dimulai!";
  } catch (err) {
    console.error(err);
    statusText.textContent = "⚠️ Gagal mengunduh video melalui proxy.";
  }
});
