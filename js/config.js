// ============================================
// CONFIGURATION AND UTILITIES
// ============================================

export const CONFIG = {
    // Scene Settings
    scene: {
        backgroundColor: 0x000000,
        fogColor: 0x000000,
        fogDensity: 0.003,
        nearClip: 0.1,
        farClip: 10000
    },

    // Camera Settings
    camera: {
        fov: 75,
        defaultPosition: { x: 0, y: 0, z: 50 },
        minDistance: 15,
        maxDistance: 100,
        scrollSensitivity: 0.1,
        parallaxIntensity: 5
    },

    // Lighting Settings
    lighting: {
        keyLight: {
            color: 0xffffff,
            intensity: 0.5,
            position: { x: 100, y: 100, z: 100 }
        },
        fillLight: {
            color: 0x4a90e2,
            intensity: 0.3,
            position: { x: -100, y: -100, z: 50 }
        },
        rimLight: {
            color: 0xd4af37,
            intensity: 0.4,
            position: { x: -50, y: 100, z: -100 }
        },
        ambientLight: {
            color: 0xffffff,
            intensity: 0.2
        }
    },

    // Sphere Settings
    sphere: {
        geometry: {
            radius: 15,
            detail: 5
        },
        material: {
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x8b6914,
            emissiveIntensity: 0.6
        },
        rotation: {
            x: 0.0003,
            y: 0.0005,
            z: 0.0002
        }
    },

    // Energy Nodes Settings
    energyNodes: {
        count: 20,
        radius: 0.5,
        spreadRadius: 15,
        material: {
            color: 0xffffff,
            metalness: 1,
            roughness: 0,
            emissive: 0xd4af37,
            emissiveIntensity: 1
        },
        pulseSpeed: 1,
        minScale: 0.5,
        maxScale: 1.0
    },

    // Particle Settings
    particles: {
        count: 2000,
        size: 0.2,
        opacity: 0.6,
        color: 0xd4af37,
        spreadRadius: 200,
        velocityRange: 0.02
    },

    // Post-Processing Settings
    postProcessing: {
        bloom: {
            strength: 1.5,
            radius: 0.4,
            threshold: 0.85
        },
        depthOfField: {
            enabled: true,
            focus: 50,
            aperture: 0.025,
            maxBlur: 1.0
        }
    },

    // Animation Timings
    animation: {
        cameraEasing: 0.1,
        scrollEasing: 0.1,
        sectionTransition: 600
    },

    // Color Palette
    colors: {
        primary: 0xd4af37,        // Golden
        primaryDark: 0x8b6914,    // Dark Gold
        secondary: 0x4a90e2,      // Blue
        background: 0x000000,     // Black
        accent: 0xffffff          // White
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export class EasingFunctions {
    static linear(t) {
        return t;
    }

    static easeInQuad(t) {
        return t * t;
    }

    static easeOutQuad(t) {
        return t * (2 - t);
    }

    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static easeInCubic(t) {
        return t * t * t;
    }

    static easeOutCubic(t) {
        return (--t) * t * t + 1;
    }

    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1;
    }

    static easeInQuart(t) {
        return t * t * t * t;
    }

    static easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    static easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }

    static easeInQuint(t) {
        return t * t * t * t * t;
    }

    static easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
    }

    static easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }

    static easeInExpo(t) {
        return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
    }

    static easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    static easeInOutExpo(t) {
        return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
    }

    static easeInCirc(t) {
        return 1 - Math.sqrt(1 - Math.pow(t, 2));
    }

    static easeOutCirc(t) {
        return Math.sqrt(1 - Math.pow(t - 1, 2));
    }

    static easeInOutCirc(t) {
        return t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    }
}

// ============================================
// VECTOR AND MATH UTILITIES
// ============================================

export class MathUtils {
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    static inverseLerp(a, b, value) {
        return (value - a) / (b - a);
    }

    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static map(value, inMin, inMax, outMin, outMax) {
        return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
    }

    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    static normalizeAngle(angle) {
        return ((angle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

export class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.deltaTime = 0;
    }

    update() {
        const now = Date.now();
        this.deltaTime = now - this.lastTime;
        this.lastTime = now;
        this.frameCount++;

        if (this.frameCount % 30 === 0) {
            this.fps = Math.round(1000 / (this.deltaTime * 30));
        }
    }

    getStats() {
        return {
            fps: this.fps,
            frameTime: this.deltaTime.toFixed(2),
            deltaTime: this.deltaTime
        };
    }

    logStats() {
        const stats = this.getStats();
        console.log(`FPS: ${stats.fps} | Frame Time: ${stats.frameTime}ms`);
    }
}

// ============================================
// ANIMATION CONTROLLER
// ============================================

export class AnimationController {
    constructor() {
        this.animations = new Map();
        this.startTimes = new Map();
    }

    add(id, from, to, duration, easing = EasingFunctions.easeInOutQuad, onComplete = null) {
        this.animations.set(id, {
            from,
            to,
            duration,
            easing,
            onComplete,
            isActive: true
        });
        this.startTimes.set(id, Date.now());
    }

    update() {
        const now = Date.now();

        for (const [id, anim] of this.animations) {
            if (!anim.isActive) continue;

            const elapsed = now - this.startTimes.get(id);
            const progress = Math.min(elapsed / anim.duration, 1);
            const easedProgress = anim.easing(progress);

            const current = anim.from + (anim.to - anim.from) * easedProgress;

            if (progress >= 1) {
                anim.isActive = false;
                if (anim.onComplete) {
                    anim.onComplete();
                }
            }

            this.animations.get(id).current = current;
        }
    }

    getValue(id) {
        const anim = this.animations.get(id);
        return anim ? anim.current : null;
    }

    isActive(id) {
        const anim = this.animations.get(id);
        return anim && anim.isActive;
    }

    remove(id) {
        this.animations.delete(id);
        this.startTimes.delete(id);
    }

    clear() {
        this.animations.clear();
        this.startTimes.clear();
    }
}

// ============================================
// EVENT EMITTER
// ============================================

export class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    emit(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
    }

    once(event, listener) {
        const onceWrapper = (...args) => {
            listener(...args);
            this.off(event, onceWrapper);
        };
        this.on(event, onceWrapper);
    }

    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}

// ============================================
// STORAGE UTILITY
// ============================================

export class StorageManager {
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    }

    static load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Failed to remove from localStorage:', e);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.warn('Failed to clear localStorage:', e);
        }
    }
}
