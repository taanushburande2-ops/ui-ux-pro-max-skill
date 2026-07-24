// ============================================
// 3D IMMERSIVE PORTFOLIO EXPERIENCE
// Three.js Implementation
// ============================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@r128/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@r128/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@r128/examples/jsm/postprocessing/UnrealBloomPass.js';

class Portfolio3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('canvas'),
            antialias: true,
            alpha: true
        });

        this.setup();
        this.createEnvironment();
        this.createNeuralSphere();
        this.createParticles();
        this.setupPostProcessing();
        this.setupInteractions();
        this.animate();
    }

    setup() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);

        // Store original camera position for parallax
        this.cameraOrigin = new THREE.Vector3(0, 0, 50);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        // Scroll tracking
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;
        this.currentSection = 0;

        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('wheel', (e) => this.onScroll(e), { passive: true });
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', () => this.onMouseClick());

        // Navigation dots
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSection(index));
        });
    }

    createEnvironment() {
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x000000, 0.003);

        // Lighting setup
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
        keyLight.position.set(100, 100, 100);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        this.scene.add(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
        fillLight.position.set(-100, -100, 50);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xd4af37, 0.4);
        rimLight.position.set(-50, 100, -100);
        this.scene.add(rimLight);

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Add subtle volumetric lighting with light helper
        this.lightGroup = new THREE.Group();
        this.scene.add(this.lightGroup);
    }

    createNeuralSphere() {
        this.sphereGroup = new THREE.Group();

        // Main sphere geometry with high detail
        const geometry = new THREE.IcosahedronGeometry(15, 5);
        
        // Create wireframe material
        const wireframe = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0xd4af37,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });
        const wireframeLines = new THREE.LineSegments(wireframe, wireframeMaterial);

        // Create glowing sphere material
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x8b6914,
            emissiveIntensity: 0.6,
            wireframe: false
        });

        const sphere = new THREE.Mesh(geometry, sphereMaterial);
        sphere.castShadow = true;
        sphere.receiveShadow = true;

        this.sphereGroup.add(sphere);
        this.sphereGroup.add(wireframeLines);

        // Add glow sphere
        const glowGeometry = new THREE.IcosahedronGeometry(15.5, 5);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.1,
            wireframe: false
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sphereGroup.add(glowSphere);

        // Store for animation
        this.sphere = sphere;
        this.wireframeLines = wireframeLines;
        this.glowSphere = glowSphere;

        this.scene.add(this.sphereGroup);

        // Create energy pulse nodes on sphere
        this.createEnergyNodes();
    }

    createEnergyNodes() {
        this.energyNodes = [];
        const nodeCount = 20;
        const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const nodeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 1,
            roughness: 0,
            emissive: 0xd4af37,
            emissiveIntensity: 1
        });

        for (let i = 0; i < nodeCount; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            const phi = Math.acos(-1 + (2 * i) / nodeCount);
            const theta = Math.sqrt(nodeCount * Math.PI) * phi;

            const x = 15 * Math.cos(theta) * Math.sin(phi);
            const y = 15 * Math.sin(theta) * Math.sin(phi);
            const z = 15 * Math.cos(phi);

            node.position.set(x, y, z);
            node.userData = {
                pulsePhase: (i / nodeCount) * Math.PI * 2,
                originalPosition: new THREE.Vector3(x, y, z)
            };

            this.sphereGroup.add(node);
            this.energyNodes.push(node);
        }

        // Create connecting lines
        this.createEnergyConnections();
    }

    createEnergyConnections() {
        const points = this.energyNodes.map(n => n.position);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.3,
            linewidth: 1
        });

        this.energyLines = new THREE.LineSegments(geometry, material);
        this.sphereGroup.add(this.energyLines);
    }

    createParticles() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;

            velocities[i] = (Math.random() - 0.5) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i + 2] = (Math.random() - 0.5) * 0.02;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.userData.velocities = velocities;

        const material = new THREE.PointsMaterial({
            color: 0xd4af37,
            size: 0.2,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            sizeRange: [0, 100]
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupPostProcessing() {
        const renderPass = new RenderPass(this.scene, this.camera);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,  // strength
            0.4,  // radius
            0.85  // threshold
        );

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass(bloomPass);
    }

    setupInteractions() {
        this.interactiveObjects = [];
    }

    onScroll(event) {
        const scrollDelta = event.deltaY > 0 ? 0.1 : -0.1;
        this.targetScrollProgress = Math.max(0, Math.min(3, this.targetScrollProgress + scrollDelta));
        this.updateSectionFromScroll();
    }

    updateSectionFromScroll() {
        const newSection = Math.round(this.targetScrollProgress);
        if (newSection !== this.currentSection && newSection <= 3) {
            this.currentSection = newSection;
            this.updateUIForSection();
        }
    }

    goToSection(index) {
        this.targetScrollProgress = index;
        this.currentSection = index;
        this.updateUIForSection();
    }

    updateUIForSection() {
        const labels = ['Welcome', 'Work', 'About', 'Contact'];
        const descriptions = [
            'Experience the fusion of design and technology',
            'Explore my creative works and projects',
            'Learn about my journey and expertise',
            'Get in touch for collaborations'
        ];

        document.querySelector('.section-label').textContent = labels[this.currentSection];
        document.querySelector('.section-label').classList.add('active');

        document.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSection);
        });

        const infoPanel = document.querySelector('.info-panel');
        infoPanel.querySelector('h3').textContent = labels[this.currentSection].toUpperCase();
        infoPanel.querySelector('p').textContent = descriptions[this.currentSection];
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseClick() {
        // Zoom into sphere on click
        const distance = this.camera.position.distanceTo(this.sphereGroup.position);
        if (distance > 20) {
            this.targetScrollProgress = this.currentSection;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    updateCamera() {
        // Smooth scroll animation
        this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.1;

        // Camera movement based on scroll
        const baseZ = 50 - (this.scrollProgress * 15);
        this.cameraOrigin.z = Math.max(baseZ, 15);

        // Parallax effect with mouse
        const parallaxX = this.mouseX * 5;
        const parallaxY = this.mouseY * 5;

        this.camera.position.lerp(
            new THREE.Vector3(parallaxX, parallaxY, this.cameraOrigin.z),
            0.1
        );

        this.camera.lookAt(this.sphereGroup.position);
    }

    updateSphereAnimation() {
        // Rotate sphere
        this.sphereGroup.rotation.x += 0.0003;
        this.sphereGroup.rotation.y += 0.0005;
        this.sphereGroup.rotation.z += 0.0002;

        // Pulse effect on energy nodes
        this.energyNodes.forEach((node, index) => {
            const time = Date.now() * 0.001 + node.userData.pulsePhase;
            const pulse = Math.sin(time) * 0.5 + 0.5;
            const scale = 0.5 + pulse * 0.5;
            node.scale.set(scale, scale, scale);

            // Emit intensity
            node.material.emissiveIntensity = 0.5 + pulse * 0.8;

            // Update node positions for connections
            node.userData.originalPosition.copy(node.position);
        });

        // Update energy line positions
        if (this.energyLines) {
            const positions = this.energyLines.geometry.attributes.position.array;
            this.energyNodes.forEach((node, index) => {
                positions[index * 3] = node.position.x;
                positions[index * 3 + 1] = node.position.y;
                positions[index * 3 + 2] = node.position.z;
            });
            this.energyLines.geometry.attributes.position.needsUpdate = true;
        }

        // Glow sphere pulse
        if (this.glowSphere) {
            const time = Date.now() * 0.001;
            const glowIntensity = Math.sin(time) * 0.05 + 0.1;
            this.glowSphere.material.opacity = glowIntensity;
        }
    }

    updateParticles() {
        const positions = this.particles.geometry.attributes.position.array;
        const velocities = this.particles.geometry.userData.velocities;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Wrap around
            if (Math.abs(positions[i]) > 100) velocities[i] *= -1;
            if (Math.abs(positions[i + 1]) > 100) velocities[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 100) velocities[i + 2] *= -1;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateCamera();
        this.updateSphereAnimation();
        this.updateParticles();

        // Render with post-processing
        this.composer.render();
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    new Portfolio3D();
});
