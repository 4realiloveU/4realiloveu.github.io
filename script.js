// script.js (diedit agar ada mekanik 3-titik -> aktifkan download)
const inputBtn = document.getElementById("downloadBtnInput");
const urlInput = document.getElementById("videoUrl");
const resultBox = document.getElementById("result");
const statusText = document.getElementById("statusText");
const preview = document.getElementById("preview");
const threeDots = document.getElementById("threeDots");
const downloadVideo = document.getElementById("downloadVideo");
const copyLink = document.getElementById("copyLink");

let lastVideoUrl = "";
let threeDotsClicked = false;

// helper: toggle hasil
function showResult(show = true) {
  if (show) resultBox.classList.remove("hidden");
  else resultBox.classList.add("hidden");
}

// when user clicks 'Unduh' (input area) -> fetch api like sebelumnya
inputBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return alert("Masukkan URL Tiktok terlebih dahulu!");
  showResult(true);
  statusText.textContent = "Sedang memproses...";
  preview.classList.add("hidden");
  downloadVideo.classList.add("disabled");
  downloadVideo.disabled = true;
  threeDotsClicked = false;

  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (data && data.data && data.data.play) {
      const videoLink = data.data.play;
      lastVideoUrl = videoLink;
      preview.src = videoLink;
      preview.load();
      preview.classList.remove("hidden");
      statusText.textContent = "Video berhasil dimuat! Untuk mengunduh, tekan ikon ⋯ di pojok atas video.";
      copyLink.classList.remove("hidden");
    } else {
      statusText.textContent = "Gagal memuat video.";
    }
  } catch (err) {
    statusText.textContent = "⚠️ Terjadi kesalahan saat mengambil data ⚠️.";
    console.error(err);
  }
});

// three dots behavior: simulate options menu, ask user to "Copy link"
threeDots.addEventListener("click", () => {
  // buat bingung sedikit: tampilkan dialog kecil pseudo-option
  threeDotsClicked = true;
  statusText.textContent = "Opsi terbuka — pilih 'Salin link' atau tekan tombol Salin Link di bawah.";
  // efek visual singkat
  threeDots.animate([{ transform: 'scale(1)' }, { transform: 'scale(.98)' }, { transform: 'scale(1)' }], { duration: 220 });
  copyLink.classList.remove("hidden");
});

// Salin link (memudahkan pengguna) — ini juga merupakan 'aksi' yang mengaktifkan unduh
copyLink.addEventListener("click", async () => {
  if (!lastVideoUrl) return;
  try {
    await navigator.clipboard.writeText(lastVideoUrl);
  } catch (e) {
    // fallback
    console.warn("Tidak bisa akses clipboard, akan menampilkan link sebagai fallback.");
    alert("Link: " + lastVideoUrl);
  }
  statusText.textContent = "Link disalin. Sekarang tombol Unduh Video aktif.";
  enableDownload();
});

// enable download after melakukan aksi tiga titik / salin
function enableDownload() {
  threeDotsClicked = true;
  downloadVideo.classList.remove("disabled");
  downloadVideo.disabled = false;
}

// Download handler: buat link download dan klik otomatis
downloadVideo.addEventListener("click", async () => {
  if (!threeDotsClicked) {
    alert("Tekan ikon ⋯ pada video dulu untuk melihat opsi, lalu Salin Link.");
    return;
  }
  if (!lastVideoUrl) return alert("Tidak ada video untuk diunduh.");

  statusText.textContent = "Menyiapkan unduhan...";

  try {
    // Coba unduh langsung dengan membuat <a download>. Jika CORS mencegah, buka di tab baru.
    const a = document.createElement("a");
    a.href = lastVideoUrl;
    a.download = "tiktok_video.mp4";
    // jika server tidak izinkan download via cross-origin, fallback ke buka di tab baru
    document.body.appendChild(a);
    a.click();
    a.remove();
    statusText.textContent = "Jika unduhan tidak otomatis, link akan terbuka di tab baru.";
    // buka di tab baru sebagai fallback tambahan
    window.open(lastVideoUrl, "_blank");
  } catch (err) {
    console.error(err);
    statusText.textContent = "Gagal memulai unduhan otomatis — membuka di tab baru.";
    window.open(lastVideoUrl, "_blank");
  }
});
