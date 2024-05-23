// Inisialisasi scene, kamera, dan renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load gambar untuk masing-masing sisi kubus
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1qTnzM-86m5Y1upClsBdFl0tkmmsGVq81X6iXRymTLQ&s"
);
const materials = [];

// Gunakan material dengan tekstur gambar untuk masing-masing sisi kubus
for (let i = 0; i < 6; i++) {
  materials.push(new THREE.MeshBasicMaterial({ map: texture }));
}

// Membuat objek 3D untuk satu kubus
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Menambahkan pencahayaan
const light = new THREE.AmbientLight(0x404040);
scene.add(light);

// Mengatur posisi kamera
camera.position.z = 5;

// Fungsi untuk menampilkan dan menyembunyikan teks saat kubus diklik
const clickTextDiv = document.getElementById("click-text");
const texts = [
  "Nothing",
  "Probably Nothing",
  "Like no other",
  "Not Art, Not Artist",
  "Just.... Nothing",
];
let currentIndex = 0;
function showClickText() {
  clickTextDiv.textContent = texts[currentIndex];
  clickTextDiv.classList.add("show");
  setTimeout(() => {
    clickTextDiv.classList.remove("show");
  }, 2000); // Menghapus kelas "show" setelah 1 detik
  currentIndex = (currentIndex + 1) % texts.length;
}

// Fungsi untuk mendeteksi klik pada objek 3D
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([cube]);
  if (intersects.length > 0) {
    if (!clickTextDiv.classList.contains("show")) {
      showClickText();
    }
  }
}
window.addEventListener("click", onMouseClick);

// Fungsi untuk mendeteksi pergerakan kursor di atas kubus
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([cube]);
  if (intersects.length > 0) {
    // Ubah jenis kursor menjadi pointer saat kursor di atas kubus
    document.body.style.cursor = "pointer";
  } else {
    // Kembalikan jenis kursor ke default saat kursor tidak di atas kubus
    document.body.style.cursor = "auto";
  }
}
window.addEventListener("mousemove", onMouseMove);

// Fungsi animasi
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Menangani resize window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Menangani scroll untuk efek zoom in dan zoom out
function onScroll(event) {
  camera.position.z += event.deltaY * 0.01;
  // Membatasi jarak zoom in dan zoom out
  camera.position.z = Math.max(2, Math.min(10, camera.position.z));
}
window.addEventListener("wheel", onScroll);
