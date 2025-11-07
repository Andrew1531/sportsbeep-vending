// ====================================================================
// GLOBAL STATE & WALLET CONFIGURATION
// ====================================================================

let scene, camera, renderer, particles;
const PARTICLE_COUNT = 1500;
const STREAM_DEPTH = 300;

// New York Islanders brand colors
const BRAND_BLUE = 0x00539B;
const BRAND_ORANGE = 0xF47D30;

const WALLET_IDS = {
    'lace': { name: 'Lace', icon: 'L' },
    'yoroi': { name: 'Yoroi', icon: 'Y' },
    'nami': { name: 'Nami', icon: 'N' },
    'eternl': { name: 'Eternl', icon: 'E' }
};
let connectedWallet = null;

// ====================================================================
// THREE.JS 3D BACKGROUND ANIMATION
// ====================================================================

function init() {
    const canvasContainer = document.getElementById('sports-data-canvas');
    if (!canvasContainer) {
        console.error("Canvas container not found. Check HTML ID.");
        return;
    }

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;

    createDataStream();
    animate();

    window.addEventListener('resize', onWindowResize, false);
    updateWalletUI();
}

function createDataStream() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 150;
        const z = (Math.random() - 0.5) * STREAM_DEPTH;
        positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: BRAND_ORANGE,
        size: 0.5,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let zIndex = i * 3 + 2;
        positions[zIndex] += 0.5;
        if (positions[zIndex] > camera.position.z) {
            positions[zIndex] -= STREAM_DEPTH;
            positions[zIndex] -= Math.random() * STREAM_DEPTH;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ====================================================================
// CARDANO WALLET (CIP-30) CONNECTION LOGIC
// ====================================================================

function getAvailableWallets() {
    const available = [];
    if (window.cardano) {
        for (const id in WALLET_IDS) {
            const walletInfo = WALLET_IDS[id];
            const walletApi = window.cardano[id];
            if (walletApi && typeof walletApi.enable === 'function') {
                available.push({
                    id: id,
                    name: walletInfo.name,
                    icon: walletInfo.icon,
                    api: walletApi
                });
            }
        }
    }
    return available;
}

function updateWalletUI() {
    const wallets = getAvailableWallets();
    const container = document.getElementById('wallet-selection-area');

    if (!container) {
        console.warn("Wallet selection area not found.");
        return;
    }

    container.innerHTML = '';

    if (wallets.length === 0) {
        container.innerHTML = `<p class="text-red-400">No CIP-30 wallets found. Install Nami, Eternl, Lace, or Yoroi.</p>`;
    } else {
        wallets.forEach(wallet => {
            const button = document.createElement('button');
            button.className = 'btn-outline px-4 py-2 mx-2 rounded-lg transition-colors duration-200';
            button.innerHTML = `<span class="text-xl font-extrabold mr-2">${wallet.icon}</span> ${wallet.name}`;
            button.onclick = () => enableWallet(wallet.id);
            container.appendChild(button);
        });
    }
}

async function enableWallet(walletId) {
    if (!window.cardano || !window.cardano[walletId]) {
        console.error(`Wallet ${walletId} not found.`);
        return;
    }

    try {
        const api = await window.cardano[walletId].enable();
        connectedWallet = { id: walletId, api: api };
        const mainAddress = (await api.getUsedAddresses())[0];

        const statusElement = document.getElementById('wallet-status');
        if (statusElement) {
            statusElement.innerHTML = `✅ Connected to <span style="color:#F47D30">${WALLET_IDS[walletId].name}</span>`;
            statusElement.innerHTML += `<div class="text-xs mt-1">${mainAddress.slice(0, 10)}...${mainAddress.slice(-8)}</div>`;
        }

        // Ready for token vending transactions
        updateSummary();

    } catch (error) {
        console.error(`Connection failed for ${walletId}:`, error);
        alert(`Wallet Connection Error: ${error.info || error.message}`);
        connectedWallet = null;
    }
}

// ====================================================================
// VENDING INTERFACE LOGIC
// ====================================================================

const BEEP_PER_ADA = 5.46;
const ADA_PER_BEEP = 1 / BEEP_PER_ADA;
const TX_FEE_ADA = 2;

function updateSummary() {
    const beepInputEl = document.getElementById('beep-amount');
    const summaryBeepEl = document.getElementById('summary-beep-amount');
    const rawAdaCostEl = document.getElementById('summary-ada-cost');
    const totalDueEl = document.getElementById('summary-total-due');
    const txFeeEl = document.getElementById('summary-tx-fee');

    const beepAmount = parseFloat(beepInputEl.value);

    if (beepAmount > 0 && !isNaN(beepAmount)) {
        const rawAda = beepAmount * ADA_PER_BEEP;
        const totalAda = (rawAda + TX_FEE_ADA).toFixed(2);

        summaryBeepEl.textContent = beepAmount.toLocaleString('en-US');
        rawAdaCostEl.textContent = `${rawAda.toFixed(2)} ADA`;
        txFeeEl.textContent = `~ ${TX_FEE_ADA} ADA`;
        totalDueEl.textContent = `${totalAda} ADA`;

        document.getElementById('purchase-button').disabled = false;
    } else {
        summaryBeepEl.textContent = '0';
        rawAdaCostEl.textContent = '0.00 ADA';
        txFeeEl.textContent = `~ ${TX_FEE_ADA} ADA`;
        totalDueEl.textContent = '0.00 ADA';
        document.getElementById('purchase-button').disabled = true;
    }
}

async function purchaseBeepTokens() {
    const beepInputEl = document.getElementById('beep-amount');
    const txMessage = document.getElementById('tx-message');
    const buyButton = document.getElementById('purchase-button');
    txMessage.classList.add('hidden');

    const beepAmount = parseFloat(beepInputEl.value);
    if (!connectedWallet) {
        txMessage.textContent = 'ERROR: Please connect your wallet first.';
        txMessage.classList.remove('hidden');
        return;
    }
    if (isNaN(beepAmount) || beepAmount < 1) {
        txMessage.textContent = 'ERROR: Minimum purchase is 1 $BEEP.';
        txMessage.classList.remove('hidden');
        return;
    }

    buyButton.textContent = 'Waiting for Signature...';
    buyButton.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Mock transaction
        const totalDue = document.getElementById('summary-total-due').textContent;
        txMessage.textContent = `SUCCESS! Transaction submitted for ${totalDue}. You will receive ${beepAmount} $BEEP shortly.`;
        txMessage.classList.remove('hidden');
        txMessage.classList.remove('text-red-400');
        txMessage.classList.add('text-green-400');
    } catch (e) {
        txMessage.textContent = `TRANSACTION FAILED: User rejected or error occurred.`;
        txMessage.classList.remove('hidden');
        txMessage.classList.remove('text-green-400');
        txMessage.classList.add('text-red-400');
    } finally {
        buyButton.textContent = 'Execute Purchase';
        buyButton.disabled = false;
    }
}

// ====================================================================
// INITIALIZATION
// ====================================================================

document.addEventListener('DOMContentLoaded', init);
