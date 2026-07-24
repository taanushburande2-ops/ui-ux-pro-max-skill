// ============================================
// CUSTOM SHADERS FOR ADVANCED EFFECTS
// ============================================

export const shaders = {
    // Volumetric lighting shader
    volumetric: {
        vertex: `
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            void main() {
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            uniform vec3 lightPos;
            uniform vec3 cameraPos;
            uniform vec3 color;
            
            void main() {
                vec3 N = normalize(vNormal);
                vec3 L = normalize(lightPos - vPosition);
                vec3 V = normalize(cameraPos - vPosition);
                vec3 H = normalize(L + V);
                
                float NdotL = max(dot(N, L), 0.0);
                float NdotH = max(dot(N, H), 0.0);
                
                float specular = pow(NdotH, 32.0);
                float diffuse = NdotL;
                
                vec3 finalColor = color * (diffuse + specular * 0.5);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    },

    // Golden glow shader
    goldenGlow: {
        vertex: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = vec3(modelMatrix * vec4(position, 1.0));
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            uniform float time;
            uniform sampler2D texture1;
            
            void main() {
                vec3 normal = normalize(vNormal);
                float fresnel = pow(1.0 - abs(dot(normal, vec3(0, 0, 1))), 3.0);
                
                float pulse = sin(time) * 0.5 + 0.5;
                vec3 glowColor = mix(vec3(0.835, 0.686, 0.216), vec3(0.940, 0.843, 0.502), pulse);
                
                gl_FragColor = vec4(glowColor, fresnel * 0.8 + 0.2);
            }
        `
    },

    // Particle shader
    particle: {
        vertex: `
            attribute float size;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            uniform sampler2D sprite;
            varying vec3 vColor;
            
            void main() {
                vec2 uv = gl_PointCoord;
                vec4 texture = texture2D(sprite, uv);
                gl_FragColor = vec4(vColor, texture.a * 0.8);
            }
        `
    },

    // Displacement shader for wave effects
    displacement: {
        vertex: `
            uniform float time;
            uniform float strength;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vec3 pos = position;
                float wave = sin(pos.x * 0.5 + time) * sin(pos.y * 0.5 + time) * strength;
                pos += normal * wave;
                
                vNormal = normal;
                vPosition = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragment: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 color = mix(
                    vec3(0.835, 0.686, 0.216),
                    vec3(0.2, 0.4, 0.8),
                    dot(normal, vec3(0, 1, 0)) * 0.5 + 0.5
                );
                gl_FragColor = vec4(color, 0.9);
            }
        `
    }
};

export class ShaderMaterial extends THREE.ShaderMaterial {
    constructor(shaderName, uniforms = {}) {
        if (shaders[shaderName]) {
            const shader = shaders[shaderName];
            super({
                vertexShader: shader.vertex,
                fragmentShader: shader.fragment,
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib.common,
                    THREE.UniformsLib.lights,
                    {
                        time: { value: 0 },
                        ...uniforms
                    }
                ]),
                lights: true,
                transparent: true
            });
        }
    }

    updateTime(time) {
        this.uniforms.time.value = time;
    }
}
