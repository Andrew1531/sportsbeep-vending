// Global variables for the Three.js scene
let scene, camera, renderer, particles;
const PARTICLE_COUNT = 1500; // Total number of data points
const PARTICLE_SIZE = 0.5;   // Size of each particle
const STREAM_DEPTH = 300;  // How far the particles extend in the Z-axis

// --- INITIALIZATION FUNCTION ---
function init() {
    // 1. Setup the Renderer
    // Get the canvas container and use WebGL
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, // Allows the canvas to be transparent
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Set the canvas element's ID to match the HTML structure
    const canvasContainer = document.getElementById('sports-data-canvas');
    canvasContainer.appendChild(renderer.domElement);

    // 2. Setup the Scene
    scene = new THREE.Scene();
    
    // Set a deep, dark background color (optional, as CSS handles the body color)
    // scene.background = new THREE.Color(0x0A0D11);

    // 3. Setup the Camera
    // PerspectiveCamera(FOV, Aspect Ratio, Near Clip, Far Clip)
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        1000
    );
    camera.position.z = 5; // Start camera slightly forward

    // 4. Create Particles (The Data Stream)
    createDataStream();

    // 5. Start the Animation Loop
    animate();

    // 6. Handle window resize events
    window.addEventListener('resize', onWindowResize, false);
}

// --- PARTICLE CREATION ---
function createDataStream() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    // Create a pool of random positions for the particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Random positions (x, y, z)
        // X and Y are spread out slightly wider than the screen
        const x = (Math.random() - 0.5) * 200; 
        const y = (Math.random() - 0.5) * 150;
        // Z is spread deep into the scene
        const z = (Math.random() - 0.5) * STREAM_DEPTH;

        positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // Define the material for the particles (glowing dots)
    const material = new THREE.PointsMaterial({
        color: 0x00D0FF, // Electric Cyan color
        size: PARTICLE_SIZE,
        blending: THREE.AdditiveBlending, // Makes colors blend for a glow effect
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true // Particles shrink as they get farther away
    });

    // Create the particle system (Points)
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // Get the position data array
    const positions = particles.geometry.attributes.position.array;
    
    // Animate the particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Get the current Z position (index 2 for Z axis: x, y, Z)
        let zIndex = i * 3 + 2;
        
        // Move the particle forward slightly each frame (0.5 is the speed)
        positions[zIndex] += 0.5;

        // If the particle moves past the camera (Z > 5), loop it back to the far end
        if (positions[zIndex] > camera.position.z) {
            positions[zIndex] -= STREAM_DEPTH;
            // Also give it a small random offset to keep the stream dynamic
            positions[zIndex] -= Math.random() * STREAM_DEPTH;
        }
    }

    // Tell Three.js the positions have updated
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Rotate the entire particle cloud slightly for a dynamic look
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Render the scene
    renderer.render(scene, camera);
}

// --- RESIZE HANDLER ---
function onWindowResize() {
    // Update the camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- START THE APPLICATION ---
document.addEventListener('DOMContentLoaded', init);
