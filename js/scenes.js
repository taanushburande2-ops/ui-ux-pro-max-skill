// ============================================
// SCENE DEFINITIONS - DIFFERENT SECTIONS
// ============================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js';

export class SceneManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.currentScene = null;
        this.scenes = {};
        
        this.initializeScenes();
    }

    initializeScenes() {
        this.scenes.welcome = this.createWelcomeScene();
        this.scenes.work = this.createWorkScene();
        this.scenes.about = this.createAboutScene();
        this.scenes.contact = this.createContactScene();
    }

    createWelcomeScene() {
        const sceneGroup = new THREE.Group();
        
        // Subtle background elements
        const bgGeometry = new THREE.IcosahedronGeometry(50, 3);
        const bgMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            metalness: 0.3,
            roughness: 0.8,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        sceneGroup.add(bgMesh);

        return sceneGroup;
    }

    createWorkScene() {
        const sceneGroup = new THREE.Group();
        
        // Floating glass cards
        const cardCount = 4;
        const cardWidth = 10;
        const cardHeight = 15;
        const cardDepth = 0.5;

        for (let i = 0; i < cardCount; i++) {
            const geometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
            
            const materials = [
                new THREE.MeshStandardMaterial({
                    color: 0xd4af37,
                    metalness: 0.9,
                    roughness: 0.1,
                    transparent: true,
                    opacity: 0.7,
                    emissive: 0x8b6914,
                    emissiveIntensity: 0.3
                })
            ];

            for (let j = 1; j < 6; j++) {
                materials.push(new THREE.MeshStandardMaterial({
                    color: 0x1a1a2e,
                    metalness: 0.5,
                    roughness: 0.5,
                    transparent: true,
                    opacity: 0.3
                }));
            }

            const card = new THREE.Mesh(geometry, materials);
            
            // Position in 3D space
            const angle = (i / cardCount) * Math.PI * 2;
            const radius = 30;
            card.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * 10,
                Math.sin(angle * 2) * 20
            );
            card.rotation.set(
                Math.random() * 0.3,
                angle,
                Math.random() * 0.3
            );

            card.castShadow = true;
            card.receiveShadow = true;

            // Store animation data
            card.userData = {
                initialPosition: card.position.clone(),
                initialRotation: card.rotation.clone(),
                floatAmount: Math.random() * 0.5 + 0.3,
                floatSpeed: Math.random() * 0.005 + 0.002
            };

            sceneGroup.add(card);
        }

        return sceneGroup;
    }

    createAboutScene() {
        const sceneGroup = new THREE.Group();

        // Create intricate network of nodes
        const nodeCount = 30;
        const nodes = [];

        const nodeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const nodeMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 1,
            roughness: 0,
            emissive: 0xd4af37,
            emissiveIntensity: 0.8
        });

        for (let i = 0; i < nodeCount; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            const phi = Math.acos(-1 + (2 * i) / nodeCount);
            const theta = Math.sqrt(nodeCount * Math.PI) * phi;

            node.position.set(
                Math.cos(theta) * Math.sin(phi) * 20,
                Math.sin(theta) * Math.sin(phi) * 20,
                Math.cos(phi) * 20
            );

            node.userData = {
                phase: (i / nodeCount) * Math.PI * 2,
                basePosition: node.position.clone()
            };

            sceneGroup.add(node);
            nodes.push(node);
        }

        // Connect nearby nodes
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.4,
            linewidth: 1
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                if (distance < 15) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array([
                        nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
                        nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    const line = new THREE.Line(geometry, linesMaterial);
                    sceneGroup.add(line);
                }
            }
        }

        sceneGroup.userData.nodes = nodes;
        return sceneGroup;
    }

    createContactScene() {
        const sceneGroup = new THREE.Group();

        // Glowing contact panel
        const panelGeometry = new THREE.PlaneGeometry(20, 25);
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x8b6914,
            emissiveIntensity: 0.8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.castShadow = true;
        panel.receiveShadow = true;
        sceneGroup.add(panel);

        // Light beams
        const beamCount = 5;
        for (let i = 0; i < beamCount; i++) {
            const beamGeometry = new THREE.CylinderGeometry(0.1, 0.5, 50, 16);
            const beamMaterial = new THREE.MeshStandardMaterial({
                color: 0xd4af37,
                emissive: 0xd4af37,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.3
            });

            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            const angle = (i / beamCount) * Math.PI * 2;
            beam.position.set(
                Math.cos(angle) * 15,
                Math.sin(angle) * 15,
                -25
            );
            beam.rotation.z = angle;

            sceneGroup.add(beam);
        }

        return sceneGroup;
    }

    switchScene(sceneName) {
        // Fade out current scene
        if (this.currentScene) {
            this.scene.remove(this.currentScene);
        }

        // Add new scene
        if (this.scenes[sceneName]) {
            this.currentScene = this.scenes[sceneName];
            this.scene.add(this.currentScene);
        }
    }

    updateScene(deltaTime) {
        if (!this.currentScene) return;

        // Update work cards animation
        if (this.currentScene === this.scenes.work) {
            this.currentScene.children.forEach(card => {
                const time = Date.now() * 0.001;
                const float = Math.sin(time * card.userData.floatSpeed) * card.userData.floatAmount;
                card.position.y = card.userData.initialPosition.y + float;
                
                card.rotation.x += 0.001;
                card.rotation.z += 0.0005;
            });
        }

        // Update about scene network
        if (this.currentScene === this.scenes.about && this.currentScene.userData.nodes) {
            this.currentScene.userData.nodes.forEach(node => {
                const time = Date.now() * 0.001;
                const pulse = Math.sin(time + node.userData.phase) * 2;
                node.scale.set(1 + pulse * 0.1, 1 + pulse * 0.1, 1 + pulse * 0.1);
                node.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
            });
        }

        // Update contact scene
        if (this.currentScene === this.scenes.contact) {
            this.currentScene.rotation.z += 0.0002;
            const time = Date.now() * 0.001;
            const glow = Math.sin(time) * 0.3 + 0.8;
            this.currentScene.children[0].material.emissiveIntensity = glow;
        }
    }
}
