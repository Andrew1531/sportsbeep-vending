// ===============================
// GLOBAL VARIABLES
// ===============================
let scene, camera, renderer, mixers = [];
const clock = new THREE.Clock();
let mouseX = 0, mouseY = 0;

// Cardano Wallet
const WALLET_IDS = { lace: 'Lace', yoroi: 'Yoroi', nami: 'Nami', eternl: 'Eternl' };
let connectedWallet = null;
const BEEP_PER_ADA = 5.48;
const TX_FEE_ADA = 2; // Placeholder transaction fee

// ===============================
// HERO 3D ANIMATION (using Three.js/GLTFLoader)
// ===============================
function initHeroScene() {
  // NOTE: The new HTML uses a <canvas> element likely located in the hero-section.
  // We'll use the ID 'hero-canvas' which is a standard choice.
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) {
    console.error("Canvas element with ID 'hero-canvas' not found. Skipping 3D initialization.");
    return;
  }
  
  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  // Lighting (Adjusted for the dramatic dark scene)
  const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Softer ambient light
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0x00FFC0, 1.5); // Neon accent light
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // Loaders and Models (Sample models retained for functionality)
  const loader = new THREE.GLTFLoader();
  const models = [
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Box/glTF/Box.glb", pos: [-2, 0, 0] },
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Cube/glTF/Cube.glb", pos: [2, 0, 0] },
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Sphere/glTF/Sphere.glb", pos: [0, 2, 0] },
    { url: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Cylinder/glTF/Cylinder.glb", pos: [0, -2, 0] }
  ];

  models.forEach(model => {
    loader.load(model.url, gltf => {
      const obj = gltf.scene;
      obj.position.set(...model.pos);
      obj.scale.set(0.8, 0.8, 0.8);
      obj.rotation.set(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5);
      scene.add(obj);

      if (gltf.animations.length > 0) {
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
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  const delta = clock.getDelta();
  mixers.forEach(m => m.update(delta));

  renderer.render(scene, camera);
}

// ===============================
// WALLET CONNECTION
// (Assuming your new HTML buttons have data-wallet-id attributes 
// or call this function directly with the ID)
// ===============================
async function connectWallet(walletId) {
  if (!window.cardano || !window.cardano[walletId]) {
    alert(`${WALLET_IDS[walletId]} wallet not found. Please install the extension.`);
    return;
  }
  try {
    const api = await window.cardano[walletId].enable();
    connectedWallet = { id: walletId, api: api };
    const mainAddress = (await api.getUsedAddresses())[0];
    
    // Update the status area in the new Vending Section
    document.getElementById("wallet-status").innerHTML = `
      <span class="text-glow">✅ Connected: ${WALLET_IDS[walletId]}</span><br>
      <span class="wallet-address">${mainAddress.slice(0, 10)}...${mainAddress.slice(-8)}</span>
    `;
    
    // Hide wallet selection, show purchase interface
    document.getElementById("wallet-selection-area").classList.add("hidden");
    document.getElementById("purchase-interface").classList.remove("hidden");
    
  } catch (e) {
    alert(`Connection failed: ${e.message}`);
  }
}

// ===============================
// PURCHASE LOGIC
// (Using new IDs: amount-input and summary-output)
// ===============================
function updateSummary() {
  // Use ID 'amount-input' from the transaction input field
  const adaInput = document.getElementById("amount-input");
  const adaAmount = parseFloat(adaInput.value);
  
  // Use ID 'summary-output' for the $BEEP calculation
  const summary = document.getElementById("summary-output");
  
  if (adaAmount > 0) {
      // Calculate BEEP received
      const beepReceived = (adaAmount * BEEP_PER_ADA).toFixed(0);
      summary.textContent = `You will receive ${beepReceived} $BEEP`;
  } else {
      summary.textContent = 'Enter ADA amount above 0';
  }
}

// NOTE: The previous logic was calculating total ADA cost from BEEP. 
// The new HTML suggests inputting ADA amount and calculating BEEP received. 
// I've adjusted `updateSummary` to reflect this common vending machine flow.
// The `purchaseBeepTokens` function would need full blockchain integration 
// to execute, but the placeholder logic is kept for UI feedback.

async function purchaseBeepTokens() {
  if (!connectedWallet) { alert("Connect wallet first"); return; }
  
  const adaAmount = parseFloat(document.getElementById("amount-input").value);
  if (isNaN(adaAmount) || adaAmount <= 0) { alert("Please enter a valid ADA amount."); return; }
  
  const beepAmount = (adaAmount * BEEP_PER_ADA).toFixed(0);
  
  // Use a central element for transaction messages
  const txMessage = document.getElementById("tx-message");
  txMessage.textContent = 'Transaction pending...';
  txMessage.className = 'tx-message'; // Reset classes
  txMessage.classList.remove("hidden");
  
  try {
    // === PLACEHOLDER TRANSACTION LOGIC ===
    // In a real dApp, you would construct, sign, and submit the transaction here.
    await new Promise(r => setTimeout(r, 2000)); 
    // Example: const txHash = await sendADAtoVendingAddress(connectedWallet.api, adaAmount);
    // =====================================
    
    txMessage.textContent = `SUCCESS! Purchased ${beepAmount} $BEEP for ${adaAmount} ADA.`;
    txMessage.classList.add("text-success-color"); // Assuming your CSS defines this
    
  } catch (e) {
    txMessage.textContent = `FAILED: ${e.message}`;
    txMessage.classList.add("text-error-color"); // Assuming your CSS defines this
  }
}

// ===============================
// INITIALIZE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize the 3D Hero Scene
  initHeroScene();
  
  // 2. Attach Event Listener for the ADA Input Field
  const adaInput = document.getElementById("amount-input");
  if (adaInput) {
    adaInput.addEventListener("input", updateSummary);
    updateSummary(); // Initial calculation on load
  }
  
  // 3. Attach Event Listener for the PURCHASE Button
  const purchaseBtn = document.getElementById("execute-purchase-btn");
  if (purchaseBtn) {
      purchaseBtn.addEventListener("click", purchaseBeepTokens);
  }

  // 4. Attach Event Listeners for the Wallet Buttons
  // The HTML needs a container or specific IDs for this to be clean. 
  // For simplicity, we assume buttons call `connectWallet` directly via `onclick`.
  // Example HTML structure needed for the wallet buttons:
  // <button class="wallet-btn" onclick="connectWallet('nami')">Connect Nami</button>
});
