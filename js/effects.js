// ============================================
// ADVANCED VISUAL EFFECTS
// ============================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js';

export class EffectSystem {
    constructor(scene) {
        this.scene = scene;
        this.effects = [];
        this.time = 0;
    }

    // Create light sweep effect
    createLightSweep(position, direction, color = 0xd4af37) {
        const sweepGeometry = new THREE.CylinderGeometry(2, 5, 100, 32);
        const sweepMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            emissive: color,
            emissiveIntensity: 0.5
        });

        const sweep = new THREE.Mesh(sweepGeometry, sweepMaterial);
        sweep.position.copy(position);
        sweep.lookAt(direction);

        const effect = {
            mesh: sweep,
            startTime: Date.now(),
            duration: 3000,
            startOpacity: 0.2
        };

        this.scene.add(sweep);
        this.effects.push(effect);

        return sweep;
    }

    // Create pulse explosion
    createPulseExplosion(position, radius = 20, color = 0xd4af37) {
        const geometry = new THREE.IcosahedronGeometry(radius, 4);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);

        const effect = {
            mesh: mesh,
            startTime: Date.now(),
            duration: 1000,
            initialRadius: radius,
            velocity: 1,
            startOpacity: 0.6
        };

        this.scene.add(mesh);
        this.effects.push(effect);

        return mesh;
    }

    // Create energy wave
    createEnergyWave(position, color = 0xd4af37) {
        const waveGeometry = new THREE.TorusGeometry(10, 0.5, 16, 100);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.copy(position);

        const effect = {
            mesh: wave,
            startTime: Date.now(),
            duration: 2000,
            initialScale: 1
        };

        this.scene.add(wave);
        this.effects.push(effect);

        return wave;
    }

    // Create particle burst
    createParticleBurst(position, count = 100, color = 0xd4af37) {
        const particles = [];
        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });

        for (let i = 0; i < count; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                position.x,
                position.y,
                position.z
            ]);

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const particle = new THREE.Points(geometry, material);
            
            // Random velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.5 + 0.2;
            
            particle.userData = {
                velocity: new THREE.Vector3(
                    Math.cos(angle) * speed,
                    Math.random() * speed,
                    Math.sin(angle) * speed
                ),
                startTime: Date.now(),
                duration: 2000
            };

            this.scene.add(particle);
            this.effects.push({
                mesh: particle,
                type: 'particle',
                userData: particle.userData
            });
            particles.push(particle);
        }

        return particles;
    }

    // Create glowing orb
    createGlowingOrb(position, radius = 3, color = 0xd4af37) {
        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const orb = new THREE.Mesh(geometry, material);
        orb.position.copy(position);
        orb.castShadow = true;

        const effect = {
            mesh: orb,
            startTime: Date.now(),
            duration: 3000,
            initialOpacity: 0.8,
            floatHeight: 0,
            floatSpeed: 0.01
        };

        this.scene.add(orb);
        this.effects.push(effect);

        return orb;
    }

    // Create light streaks
    createLightStreaks(start, end, color = 0xd4af37, count = 5) {
        const streaks = [];
        
        for (let i = 0; i < count; i++) {
            const offset = (Math.random() - 0.5) * 5;
            const geometry = new THREE.TubeGeometry(
                new THREE.LineCurve3(start, end),
                8,
                0.2 + Math.random() * 0.2,
                8,
                false
            );

            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.7,
                transparent: true,
                opacity: 0.6 + Math.random() * 0.2
            });

            const streak = new THREE.Mesh(geometry, material);

            const effect = {
                mesh: streak,
                startTime: Date.now(),
                duration: 1500 + Math.random() * 1000
            };

            this.scene.add(streak);
            this.effects.push(effect);
            streaks.push(streak);
        }

        return streaks;
    }

    // Update all effects
    update(deltaTime) {
        this.time += deltaTime;

        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            const elapsed = Date.now() - effect.startTime;
            const progress = Math.min(elapsed / effect.duration, 1);

            // Fade out
            if (effect.startOpacity !== undefined) {
                effect.mesh.material.opacity = effect.startOpacity * (1 - progress);
            }

            // Expand (pulse explosion)
            if (effect.initialRadius !== undefined) {
                const scale = 1 + progress * effect.velocity;
                effect.mesh.scale.set(scale, scale, scale);
            }

            // Wave expansion
            if (effect.initialScale !== undefined) {
                const scale = 1 + progress * 3;
                effect.mesh.scale.set(scale, scale, scale);
            }

            // Particle movement
            if (effect.userData && effect.userData.velocity) {
                const pos = effect.mesh.geometry.attributes.position;
                pos.array[0] += effect.userData.velocity.x;
                pos.array[1] += effect.userData.velocity.y;
                pos.array[2] += effect.userData.velocity.z;
                pos.needsUpdate = true;
            }

            // Floating effect
            if (effect.floatHeight !== undefined) {
                effect.floatHeight += effect.floatSpeed;
                effect.mesh.position.y += Math.sin(effect.floatHeight) * 0.01;
            }

            // Remove completed effects
            if (progress >= 1) {
                this.scene.remove(effect.mesh);
                this.effects.splice(i, 1);
            }
        }
    }

    clear() {
        this.effects.forEach(effect => {
            this.scene.remove(effect.mesh);
        });
        this.effects = [];
    }
}

// Create a starfield background
export function createStarfield(count = 1000) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 500;
        positions[i + 1] = (Math.random() - 0.5) * 500;
        positions[i + 2] = (Math.random() - 0.5) * 500;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });

    return new THREE.Points(geometry, material);
}

// Create nebula effect
export function createNebula(color = 0xd4af37) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Create nebula texture
    const imageData = ctx.createImageData(256, 256);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise * 0.8;
        data[i + 1] = noise * 0.6;
        data[i + 2] = noise * 0.4;
        data[i + 3] = noise * 0.3;
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);

    const geometry = new THREE.SphereGeometry(200, 64, 64);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });

    return new THREE.Mesh(geometry, material);
}
