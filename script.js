// ====================================================================
// GLOBAL STATE & WALLET CONFIGURATION
// ====================================================================

let scene, camera, renderer, particles;
const PARTICLE_COUNT = 1500;
const STREAM_DEPTH = 300;
const WALLET_IDS = {
    'lace': { name: 'Lace', icon: 'L' },
    'yoroi': { name: 'Yoroi', icon: 'Y' },
    'nami': { name: 'Nami', icon: 'N' },
    // Eternl often uses 'ccvault' or 'eternl' as its injection key
    'eternl': { name: 'Eternl', icon: 'E' } 
    // You can add more as they become widely adopted (e.g., 'flint', 'gero')
};
let connectedWallet = null; // Stores the API object of the connected wallet

// ====================================================================
// THREE.JS 3D BACKGROUND ANIMATION
// ====================================================================

function init() {
    // 1. Setup Renderer
    const canvasContainer = document.getElementById('sports-data-canvas');
    if (!canvasContainer) {
        console.error("Canvas container not found. Check HTML ID.");
        return;
    }
    
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    // 2. Setup Scene and Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;

    // 3. Create and Animate Particles
    createDataStream();
    animate();

    // 4. Set up Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    // Initial check for available wallets when the page loads
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
        color: 0x00D0FF,
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
        positions[zIndex] += 0.5; // Move particles forward

        if (positions[zIndex] > camera.position.z) {
            // Loop particle back to the far end
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

/**
 * Checks the browser's window.cardano object for installed wallets.
 * @returns {Array} List of available wallet objects (e.g., { id: 'nami', name: 'Nami', icon: 'N', api: window.cardano.nami })
 */
function getAvailableWallets() {
    const available = [];
    if (window.cardano) {
        // Iterate over our list of supported wallet IDs
        for (const id in WALLET_IDS) {
            const walletInfo = WALLET_IDS[id];
            const walletApi = window.cardano[id];

            // CIP-30 standard requires the wallet object and the 'enable' method
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

/**
 * Updates the 'Connect Wallet' area in the HTML with buttons for found wallets.
 * You must ensure your HTML has a container with the ID 'wallet-selection-area'.
 */
function updateWalletUI() {
    const wallets = getAvailableWallets();
    const container = document.getElementById('wallet-selection-area');
    
    if (!container) {
        // Fallback for connecting via a single button if the multi-select area is missing
        console.warn("Wallet selection area not found. Cannot display multiple wallet options.");
        return; 
    }

    container.innerHTML = ''; // Clear previous content

    if (wallets.length === 0) {
        container.innerHTML = `<p class="text-red-400">No CIP-30 wallets found. Please install a wallet like Nami, Eternl, Lace, or Yoroi.</p>`;
    } else {
        const title = document.createElement('p');
        title.className = 'text-lg text-white mb-3';
        title.textContent = 'Select Wallet to Connect:';
        container.appendChild(title);

        wallets.forEach(wallet => {
            const button = document.createElement('button');
            button.className = 'btn-cyan-outline px-4 py-2 mx-2 rounded-lg transition-colors duration-200';
            button.innerHTML = `<span class="text-xl font-extrabold mr-2">${wallet.icon}</span> ${wallet.name}`;
            button.onclick = () => enableWallet(wallet.id); // Call enable function on click
            container.appendChild(button);
        });
    }
}

/**
 * Enables the selected wallet and gets the full API object.
 * @param {string} walletId - The CIP-30 ID of the wallet (e.g., 'nami').
 */
async function enableWallet(walletId) {
    if (!window.cardano || !window.cardano[walletId]) {
        console.error(`Wallet ${walletId} not found.`);
        return;
    }

    try {
        // Request connection permission from the user
        const api = await window.cardano[walletId].enable();
        connectedWallet = { id: walletId, api: api };
        
        const mainAddress = (await api.getUsedAddresses())[0];
        
        console.log(`Successfully connected to ${walletId}!`);
        console.log(`Wallet API:`, api);
        
        // --- UI Update after successful connection ---
        const statusElement = document.getElementById('wallet-status');
        if (statusElement) {
            // Display connection status and first address
            statusElement.innerHTML = `✅ Connected to **${WALLET_IDS[walletId].name}**`;
            statusElement.innerHTML += `<div class="text-xs mt-1 electric-cyan">${mainAddress.slice(0, 10)}...${mainAddress.slice(-8)}</div>`;
        }
        
        // Now you can start fetching BEEP balance or preparing a transaction
        // Example: await getBeepBalance();

    } catch (error) {
        console.error(`Connection to ${walletId} failed:`, error);
        alert(`Wallet Connection Error: ${error.info || error.message}`);
        connectedWallet = null;
    }
}

// ====================================================================
// START APPLICATION
// ====================================================================

document.addEventListener('DOMContentLoaded', init);
