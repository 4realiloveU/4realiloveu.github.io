// 🎬 TikTok Downloader versi Andika yang 100% bisa download tanpa pindah URL
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

  try {
    const res = await fetch(videoLink);
    const blob = await res.blob();

    // 🔥 Nama random sesuai request kamu
    const date = new Date().toISOString().split("T")[0];
    const random = Math.floor(Math.random() * 9999);
    const filename = `4realiloveu_${date}_${random}.mp4`;

    // 🔽 Buat link download blob
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
    statusText.textContent = "⚠️ Gagal mengunduh video.";
  }
});
