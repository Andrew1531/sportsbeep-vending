// ===============================
// GLOBAL VARIABLES
// ===============================
let scene, camera, renderer, mixers = [];
const clock = new THREE.Clock();
let mouseX = 0, mouseY = 0;

// Cardano Wallet
const WALLET_IDS = {
  lace: 'Lace',
  yoroi: 'Yoroi',
  nami: 'Nami',
  eternl: 'Eternl'
};
let connectedWallet = null;

// Tokenomics
const BEEP_PER_ADA = 5.48;
const TX_FEE_ADA = 2;

// ===============================
// HERO 3D ANIMATION
// ===============================
function initHeroScene() {
  const canvas = document.getElementById("sportsbeep-hero-canvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  // Lights
  const ambientLight = new THREE.AmbientLight(0x00539B, 0.6); // Blue ambient
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xF47D30, 1); // Orange directional
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // Load low-poly sports models from public CDNs
  const loader = new THREE.GLTFLoader();
  const models = [
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Box/glTF/Box.glb", pos: [-2,0,0] }, // placeholder Baseball
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Cube/glTF/Cube.glb", pos: [2,0,0] },  // placeholder Football
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Sphere/glTF/Sphere.glb", pos: [0,2,0] }, // placeholder Basketball
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Cylinder/glTF/Cylinder.glb", pos: [0,-2,0] } // placeholder Hockey stick
  ];

  models.forEach(model => {
    loader.load(model.url, gltf => {
      const obj = gltf.scene;
      obj.position.set(...model.pos);
      obj.scale.set(0.8,0.8,0.8);
      obj.rotation.set(Math.random()*0.5, Math.random()*0.5, Math.random()*0.5);
      scene.add(obj);

      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(obj);
        mixers.push(mixer);
        gltf.animations.forEach(clip => mixer.clipAction(clip).play());
      }
    });
  });

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  animateHero();
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 4;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateHero() {
  requestAnimationFrame(animateHero);

  // Mouse parallax
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  const delta = clock.getDelta();
  mixers.forEach(m => m.update(delta));

  renderer.render(scene, camera);
}

// ===============================
// WALLET CONNECTION LOGIC
// ===============================
async function connectWallet(walletId) {
  if(!window.cardano || !window.cardano[walletId]) {
    alert(`${WALLET_IDS[walletId]} wallet not found. Please install it.`);
    return;
  }
  try {
    const api = await window.cardano[walletId].enable();
    connectedWallet = { id: walletId, api: api };
    const mainAddress = (await api.getUsedAddresses())[0];
    document.getElementById("wallet-status").innerHTML = `✅ Connected: ${WALLET_IDS[walletId]}<br>${mainAddress.slice(0,10)}...${mainAddress.slice(-8)}`;
    document.getElementById("purchase-interface").classList.remove("hidden");
    document.getElementById("wallet-selection-area").classList.add("hidden");
  } catch(e) {
    alert(`Connection failed: ${e.message}`);
  }
}

// ===============================
// PURCHASE LOGIC
// ===============================
function updateSummary() {
  const beepInput = document.getElementById("beep-amount");
  const value = parseFloat(beepInput.value);
  const summary = document.getElementById("summary-ada-cost");
  if(value > 0) summary.textContent = (value/BEEP_PER_ADA + TX_FEE_ADA).toFixed(2) + " ADA";
}

async function purchaseBeepTokens() {
  if(!connectedWallet) { alert("Please connect wallet first."); return; }
  const beepAmount = parseFloat(document.getElementById("beep-amount").value);
  const txMessage = document.getElementById("tx-message");
  txMessage.classList.add("hidden");
  try {
    // MOCK TRANSACTION
    await new Promise(r => setTimeout(r, 2000));
    txMessage.textContent = `SUCCESS! Purchased ${beepAmount} $BEEP`;
    txMessage.classList.remove("hidden");
    txMessage.classList.add("text-green-400");
  } catch(e) {
    txMessage.textContent = `FAILED: ${e.message}`;
    txMessage.classList.remove("hidden");
    txMessage.classList.add("text-red-400");
  }
}

// ===============================
// TICKER
// ===============================
function animateTicker() {
  const ticker = document.getElementById("ticker");
  setInterval(() => {
    ticker.classList.add("animate-ticker-update");
    setTimeout(() => ticker.classList.remove("animate-ticker-update"), 1000);
  }, 30000);
}

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initHeroScene();
  animateTicker();

  const beepInput = document.getElementById("beep-amount");
  beepInput.addEventListener("input", updateSummary);
  updateSummary();
});

