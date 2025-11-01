// 🎬 TikTok Downloader versi fix Andika
document.getElementById("downloadBtn").addEventListener("click", async () => {
  const url = document.getElementById("videoUrl").value.trim();
  const resultBox = document.getElementById("result");
  const statusText = document.getElementById("statusText");
  const preview = document.getElementById("preview");
  const saveBtn = document.getElementById("saveBtn");

  if (!url) return alert("Masukkan URL TikTok dulu!");

  resultBox.classList.remove("hidden");
  statusText.textContent = "⏳ Sedang memproses...";

  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (data.data && data.data.play) {
      const videoLink = data.data.play;
      preview.src = videoLink;
      preview.classList.remove("hidden");
      saveBtn.classList.remove("hidden");
      statusText.textContent = "✅ Video berhasil dimuat!";

      // 🔽 Tombol Download dengan fetch blob
      saveBtn.onclick = async () => {
        try {
          statusText.textContent = "📥 Sedang mendownload...";
          const response = await fetch(videoLink);
          const blob = await response.blob();

          // Nama file random
          const date = new Date().toISOString().split("T")[0];
          const random = Math.floor(Math.random() * 9999);
          const filename = `4realiloveu_${date}_${random}.mp4`;

          // Buat link download blob
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();

          // Bersihkan URL blob setelah download
          URL.revokeObjectURL(blobUrl);
          statusText.textContent = "✅ Video berhasil didownload!";
        } catch (err) {
          console.error(err);
          statusText.textContent = "⚠️ Gagal mendownload video.";
        }
      };
    } else {
      statusText.textContent = "❌ Gagal memuat video.";
    }
  } catch (err) {
    statusText.textContent = "⚠️ Terjadi kesalahan saat mengambil data.";
  }
});
