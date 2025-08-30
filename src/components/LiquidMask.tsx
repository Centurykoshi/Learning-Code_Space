// --- Add these at the very top of LiquidMask.tsx ---
interface ImageProp {
  src: string;
  srcSet?: string;
  alt?: string;
  positionX?: string;
  positionY?: string;
}

interface HoverTransition {
  type?: "spring" | "tween";
  stiffness?: number;
  damping?: number;
  mass?: number;
  restDelta?: number;
  restSpeed?: number;
  bounce?: number;
  duration?: number;
  delay?: number;
  ease?: any;
}

interface HoverProp {
  enabled?: boolean;
  scale?: number;
  transition?: HoverTransition;
}

export interface LiquidMaskProps {
  imageBase: ImageProp;
  imageHover?: ImageProp;
  borderRadius?: number;
  radius?: number;
  blur?: number;
  circleBoost?: number;
  texture?: number;
  timeSpeed?: number;
  hover?: HoverProp;
  preview?: boolean;
  style?: React.CSSProperties;
}
// --- End of type interfaces ---

//


import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime"; import { useRef, useEffect, useState, useCallback } from "react"; import { useMotionValue, useSpring, animate } from "framer-motion"; import { Scene, PerspectiveCamera, WebGLRenderer, PlaneGeometry, Mesh, ShaderMaterial, Vector2, LinearFilter, SRGBColorSpace, Clock, TextureLoader } from "https://cdn.jsdelivr.net/gh/framer-university/components/npm-bundles/liquid-mask.js"; import { addPropertyControls, ControlType, RenderTarget } from "framer"; import { ComponentMessage } from "https://framer.com/m/Utils-FINc.js";/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 400
 * @framerDisableUnlink
   const LiquidMask: React.FC<LiquidMaskProps> = (props) => {
    const { imageBase, imageHover, borderRadius = 10, radius = 100, blur = .5, circleBoost = .5, texture = .5, timeSpeed = 5, hover, preview = false } = props;// Check if base image is missing
    const hasBaseImage = imageBase && imageBase.src;// Show ComponentMessage if no base image is provided
    if (!hasBaseImage) { return /*#__PURE__*/_jsx("div", { style: { height: "100%", width: "100%", position: "relative", borderRadius: borderRadius }, children:/*#__PURE__*/_jsx("div", { style: { height: "100%", width: "100%", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }, children:/*#__PURE__*/_jsx(ComponentMessage, { style: { position: "relative", width: "100%", height: "100%", minWidth: 0, minHeight: 0 }, title: "Liquid Mask Effect", description: "Add a base image to create stunning liquid mask effects with gooey animations" }) }) }); } const canvasRef = useRef(null); const imgRef = useRef(null); const containerRef = useRef(null); const uniformsRef = useRef(null);// Detect mobile: disable effect and show base image only
    const [isMobile, setIsMobile] = useState(false); useEffect(() => { const checkMobile = () => { const coarse = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false; const small = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(max-width: 768px)").matches : false; setIsMobile(coarse || small); }; checkMobile(); window.addEventListener("resize", checkMobile); return () => window.removeEventListener("resize", checkMobile); }, []);// Motion/value state for hover scaling
    const scaleMV = useMotionValue(1); const [springOptions, setSpringOptions] = useState(() => ({ stiffness: 170, damping: 26, mass: 1 })); const springScaleMV = useSpring(1, springOptions); const tweenAnimRef = useRef(null); const hoverScaleRef = useRef(hover?.scale ?? 1.2); useEffect(() => { hoverScaleRef.current = Math.max(1, Math.min(3, hover?.scale ?? 1.2)); }, [hover?.scale]); useEffect(() => { const tr = hover?.transition || {}; if (tr && tr.type === "spring") { if (typeof tr.stiffness === "number" || typeof tr.damping === "number" || typeof tr.mass === "number") { setSpringOptions({ stiffness: typeof tr.stiffness === "number" ? tr.stiffness : 170, damping: typeof tr.damping === "number" ? tr.damping : 26, mass: typeof tr.mass === "number" ? tr.mass : 1, restDelta: typeof tr.restDelta === "number" ? tr.restDelta : undefined, restSpeed: typeof tr.restSpeed === "number" ? tr.restSpeed : undefined }); } else { const bounce = Math.max(0, Math.min(1, tr.bounce ?? 0)); const duration = Math.max(.05, tr.duration ?? .5); const mass = 1; const dampingRatio = 1 - .85 * bounce; const stiffness = Math.max(50, Math.min(700, 200 / duration)); const damping = 2 * Math.sqrt(stiffness * mass) * dampingRatio; setSpringOptions({ stiffness, damping, mass }); } } }, [hover?.transition]);// Apply base image and hover image scale whenever motion values change
    useEffect(() => { const applyScale = v => { const clamped = Math.max(1, Math.min(3, v)); const img = imgRef.current; if (img) { img.style.transform = `scale(${clamped})`; img.style.transformOrigin = "50% 50%"; img.style.willChange = "transform"; } if (uniformsRef.current && uniformsRef.current.u_hoverScale) { uniformsRef.current.u_hoverScale.value = clamped; } }; const unsubA = scaleMV.on("change", applyScale); const unsubB = springScaleMV.on("change", applyScale); applyScale(1); return () => { unsubA?.(); unsubB?.(); }; }, [scaleMV, springScaleMV]); const animateToScale = useCallback(target => { const clamped = Math.max(1, Math.min(3, target)); const tr = hover?.transition || {}; if (tweenAnimRef.current && typeof tweenAnimRef.current.stop === "function") { tweenAnimRef.current.stop(); tweenAnimRef.current = null; } if (tr && tr.type === "spring") { springScaleMV.set(clamped); } else if (tr && tr.type === "tween") { tweenAnimRef.current = animate(scaleMV, clamped, { duration: typeof tr.duration === "number" ? tr.duration : .5, delay: typeof tr.delay === "number" ? tr.delay : 0, ease: tr.ease }); } else { tweenAnimRef.current = animate(scaleMV, clamped, { duration: .25, ease: [.44, 0, .56, 1] }); } }, [hover?.transition, scaleMV, springScaleMV]);// State for hover effect
    // (no local hover state needed; Motion values drive scale)
    // Debounced prop values to prevent excessive re-renders
    const [debouncedProps, setDebouncedProps] = useState({ radius, blur, circleBoost, texture, timeSpeed, preview });// Debounce prop changes to improve performance
    useEffect(() => {
        const timeoutId = setTimeout(() => { setDebouncedProps({ radius, blur, circleBoost, texture, timeSpeed, preview }); }, 100)// 100ms debounce
        ; return () => clearTimeout(timeoutId);
    }, [radius, blur, circleBoost, texture, timeSpeed, preview]);// Value mapping functions to convert normalized property values to internal shader values
    const mapRadius = useCallback(normalizedRadius => {// Map 10-1000px to 10-200px (current internal range)
        return 10 + (normalizedRadius - 10) * (190 / 990);
    }, []); const mapBlur = useCallback(normalizedBlur => {// Map 0-1 to 0.2-3.0 (current internal range)
        return .2 + normalizedBlur * 2.8;
    }, []); const mapCircleBoost = useCallback(normalizedCircleBoost => {// Map 0-1 to 0.5-4.0 (current internal range)
        return .5 + normalizedCircleBoost * 3.5;
    }, []); const mapTimeSpeed = useCallback(normalizedTimeSpeed => {// Map 0-10 to 0.0-1.0 for true linear mapping from static to fast
        return normalizedTimeSpeed * .1;
    }, []);// Single texture mapping that controls the overall graininess/texture of the effect
    const mapTexture = useCallback(normalizedTexture => {// Map 0-1 texture control to appropriate noise parameters
        // 0 = smooth/minimal texture, 1 = very textured/grainy
        const freq = 2 + normalizedTexture * 12// frequency range 2-14 (more dramatic)
            ; const strength = normalizedTexture * 3// strength range 0-3 (stronger effect)
            ; const size = 1 - normalizedTexture * .7// size range 1.0-0.3 (smaller = finer grain at high texture)
            ; return { freq, strength, size };
    }, []); useEffect(() => {
        if (isMobile) return; const canvas = canvasRef.current; const imgEl = imgRef.current; const container = containerRef.current; if (!canvas || !imgEl || !container) return;// Animation state variable
        let isAnimating = false;// Scene setup
        const scene = new Scene; const perspective = 800; const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));// Use clientWidth/clientHeight for more reliable initial sizing
        const initialWidth = Math.max(container.clientWidth, 300)// Fallback minimum
            ; const initialHeight = Math.max(container.clientHeight, 200)// Fallback minimum
            ; renderer.setSize(initialWidth, initialHeight); const computeFov = () => {// Use clientHeight for consistent field of view calculation
                return 180 * (2 * Math.atan(container.clientHeight / 2 / perspective)) / Math.PI;
            }; const camera = new PerspectiveCamera(computeFov(), initialWidth / initialHeight, 1, 5e3); camera.position.set(0, 0, perspective);// Load hover image texture for direct rendering
        const loader = new TextureLoader; const hoverSrc = imageHover?.src || "/random-assets/blue-profile-image.png"; const hoverTexture = loader.load(hoverSrc, () => {// Update aspect ratio when texture loads
            if (hoverTexture.image) {
                const imageAspect = hoverTexture.image.width / hoverTexture.image.height; uniforms.u_hoverImageAspect.value = imageAspect;// Force a re-render to update the effect with new aspect ratio
                if (isAnimating) { renderer.render(scene, camera); }
            }
        });// Color space for modern three versions
        // @ts-ignore - guard older versions
        if (SRGBColorSpace) {// @ts-ignore
            hoverTexture.colorSpace = SRGBColorSpace;
        } hoverTexture.minFilter = LinearFilter; const textureParams = mapTexture(debouncedProps.texture); const uniforms = { u_time: { value: 0 }, u_mouse: { value: new Vector2(.5, .5) }, u_progress: { value: 0 }, u_planeRes: { value: new Vector2(1, 1) }, u_radius: { value: mapRadius(debouncedProps.radius) }, u_blur: { value: mapBlur(debouncedProps.blur) }, u_circleBoost: { value: mapCircleBoost(debouncedProps.circleBoost) }, u_noiseFreq: { value: textureParams.freq }, u_noiseStrength: { value: textureParams.strength }, u_noiseSize: { value: textureParams.size }, u_timeSpeed: { value: mapTimeSpeed(debouncedProps.timeSpeed) }, u_hoverScale: { value: 1 }, u_hoverImage: { value: hoverTexture }, u_hoverImageAspect: { value: 1 }, u_containerAspect: { value: 1 }, u_windowSize: { value: new Vector2(window.innerWidth, window.innerHeight) }, u_containerOffset: { value: new Vector2(0, 0) } }; uniformsRef.current = uniforms; const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;// Shader that renders the hover image masked by the gooey effect
        const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_progress;
      uniform vec2 u_planeRes;
      uniform float u_radius;
      uniform float u_blur;
      uniform float u_circleBoost;
      uniform float u_noiseFreq;
      uniform float u_noiseStrength;
      uniform float u_noiseSize;
      uniform float u_timeSpeed;
      uniform sampler2D u_hoverImage;
      uniform float u_hoverScale;
      uniform float u_hoverImageAspect;
      uniform float u_containerAspect;
      uniform vec2 u_windowSize;
      uniform vec2 u_containerOffset;

              // Simplex noise 3D from https://github.com/ashima/webgl-noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0 + 3.0 * C.x = -0.5 = -D.y

        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  // mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      // Pixel-based circle implementation
      float circle_pixel(vec2 pixelPos, vec2 mousePixel, float radiusPixels, float blurriness, vec2 resolution){
        float dist = length(pixelPos - mousePixel);
        return 1.0 - smoothstep(
          radiusPixels - (radiusPixels * blurriness),
          radiusPixels + (radiusPixels * blurriness),
          dist
        );
      }

      void main() {
        vec2 uv = vUv;

        // Convert UV coordinates to pixel coordinates
        vec2 pixelPos = uv * u_planeRes;
        vec2 mousePixel = u_mouse * u_planeRes;

        // Convert radius from normalized to pixels (u_radius is now in pixels)
        float radiusPixels = u_radius;

        // Window-relative noise coordinates for consistent grain size across component sizes
        // Convert UV to absolute window coordinates, then normalize by window size
        vec2 windowCoord = (uv * u_planeRes + u_containerOffset) / u_windowSize;
        
        // Apply time speed to ALL time-based movement
        float offx = windowCoord.x + (u_time * u_timeSpeed * 0.1) + sin(windowCoord.y + u_time * u_timeSpeed * 0.1);
        float offy = windowCoord.y - cos(u_time * u_timeSpeed * 0.001) * 0.01;
        
        // Apply noise size scaling for user control over grain size
        float effectiveNoiseFreq = u_noiseFreq / u_noiseSize;
        
        // Apply time speed to multiple noise layers for more dramatic effect
        float n1 = snoise(vec3(offx * effectiveNoiseFreq, offy * effectiveNoiseFreq, u_time * u_timeSpeed)) - 1.0;
        float n2 = snoise(vec3(offx * effectiveNoiseFreq * 0.5, offy * effectiveNoiseFreq * 0.5, u_time * u_timeSpeed * 0.7)) - 1.0;
        float n = (n1 + n2 * 0.5) * 0.7;

        // Pixel-based circle calculation
        float c = circle_pixel(pixelPos, mousePixel, radiusPixels, u_blur, u_planeRes) * u_circleBoost * u_progress;
        float finalMask = smoothstep(0.4, 0.5, (n * u_noiseStrength) + pow(c, 2.0));

        // Responsive UV mapping for hover image (maintains aspect ratio like object-fit: cover)
        vec2 responsiveUV = uv;
        
        // Ensure we're not getting NaN or invalid values
        if (u_hoverImageAspect > 0.0 && u_containerAspect > 0.0) {
            if (u_hoverImageAspect > u_containerAspect) {
              // Image is wider than container - scale to fit height
              float scale = u_containerAspect / u_hoverImageAspect;
              responsiveUV.x = (uv.x - 0.5) * scale + 0.5;
            } else {
              // Image is taller than container - scale to fit width
              float scale = u_hoverImageAspect / u_containerAspect;
              responsiveUV.y = (uv.y - 0.5) * scale + 0.5;
            }
        } else {
            // Fallback to original UV if aspect ratios are invalid
            responsiveUV = uv;
        }

        // Sample the hover image with responsive UV mapping and apply the mask
        responsiveUV = (responsiveUV - vec2(0.5)) / max(u_hoverScale, 1.0) + vec2(0.5);
        vec4 hoverColor = texture2D(u_hoverImage, responsiveUV);
        
        // Output the hover image with mask applied as alpha
        gl_FragColor = vec4(hoverColor.rgb, hoverColor.a * finalMask);
      }
    `; const geometry = new PlaneGeometry(1, 1, 1, 1); const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true }); const mesh = new Mesh(geometry, material); scene.add(mesh); const sizes = new Vector2; const offset = new Vector2; const updateFromDOM = () => {// Use clientWidth/clientHeight for more reliable sizing
            const actualWidth = Math.max(container.clientWidth, 2); const actualHeight = Math.max(container.clientHeight, 2);// Make the mesh fill the entire container (not just the image)
            sizes.set(actualWidth, actualHeight); offset.set(0, 0)// Center in container
                ; mesh.position.set(0, 0, 0); mesh.scale.set(actualWidth, actualHeight, 1);// Update renderer size to match container exactly
            renderer.setSize(actualWidth, actualHeight, false);// Update camera to match new dimensions
            camera.aspect = actualWidth / actualHeight; camera.updateProjectionMatrix();// Ensure camera is positioned correctly for the new dimensions
            camera.position.z = perspective; camera.lookAt(0, 0, 0); uniforms.u_planeRes.value.set(actualWidth, actualHeight);// Update window size and container offset for consistent noise scaling
            uniforms.u_windowSize.value.set(window.innerWidth, window.innerHeight);// Get container position for offset calculations
            const containerRect = container.getBoundingClientRect(); uniforms.u_containerOffset.value.set(containerRect.left, containerRect.top);// Update aspect ratio uniforms for responsive hover image
            const containerAspect = actualWidth / actualHeight; uniforms.u_containerAspect.value = containerAspect;// Calculate hover image aspect ratio when texture is loaded
            if (hoverTexture.image) { const imageAspect = hoverTexture.image.width / hoverTexture.image.height; uniforms.u_hoverImageAspect.value = imageAspect; }// Force a re-render to update the effect
            if (isAnimating) { renderer.render(scene, camera); }
        };// Initial setup
        updateFromDOM(); let targetProgress = 0; let rafId = 0; const clock = new Clock;// Function to determine if we should animate
        const shouldAnimate = () => {
            const isCanvasMode = RenderTarget.current() === RenderTarget.canvas; const isInView = container.getBoundingClientRect().top < window.innerHeight && container.getBoundingClientRect().bottom > 0;// Only animate if:
            // 1. We're in Canvas mode AND preview is enabled, OR
            // 2. We're not in Canvas mode (live website) AND component is in view
            return isCanvasMode && debouncedProps.preview || !isCanvasMode && isInView;
        }; const render = () => {// Check if we should continue animating
            if (!shouldAnimate()) { isAnimating = false; return; } isAnimating = true; rafId = requestAnimationFrame(render); uniforms.u_time.value += clock.getDelta();// Update uniforms with debounced prop values (mapped to internal ranges)
            uniforms.u_blur.value = mapBlur(debouncedProps.blur); uniforms.u_circleBoost.value = mapCircleBoost(debouncedProps.circleBoost); const currentTextureParams = mapTexture(debouncedProps.texture); uniforms.u_noiseFreq.value = currentTextureParams.freq; uniforms.u_noiseStrength.value = currentTextureParams.strength; uniforms.u_noiseSize.value = currentTextureParams.size; uniforms.u_timeSpeed.value = mapTimeSpeed(debouncedProps.timeSpeed);// Check if we're in Canvas mode and preview is enabled
            const isCanvasMode = RenderTarget.current() === RenderTarget.canvas; if (isCanvasMode && debouncedProps.preview) {// In Canvas mode with preview enabled, show effect in center
                targetProgress = 1;// Set mouse position to center (0.5, 0.5)
                uniforms.u_mouse.value.set(.5, .5);// Use normal radius (no scaling needed with proper dimension detection)
                uniforms.u_radius.value = mapRadius(debouncedProps.radius); uniforms.u_noiseFreq.value = currentTextureParams.freq * 1.25;// Boost noise intensity by 10% in Canvas mode to match live preview
                //uniforms.u_noiseStrength.value = currentTextureParams.strength * 1.5
            } else {// Normal behavior - use mouse position and hover state
                // targetProgress will be updated by mouse events
                uniforms.u_radius.value = mapRadius(debouncedProps.radius); uniforms.u_noiseStrength.value = currentTextureParams.strength;
            }// ease progress
            uniforms.u_progress.value += (targetProgress - uniforms.u_progress.value) * .08; renderer.render(scene, camera);// Canvas now renders hover image directly - no data URL needed
        };// Start animation if needed
        if (shouldAnimate()) { render(); }// Throttled resize handler
        let resizeTimeout = null; const throttledResize = () => {
            if (resizeTimeout) return; resizeTimeout = setTimeout(() => {// Update DOM and force re-render
                updateFromDOM();// Ensure the effect is properly updated
                if (isAnimating) { renderer.render(scene, camera); } resizeTimeout = null;
            }, 100)// 100ms throttle
                ;
        };// Use ResizeObserver for container changes
        const resizeObserver = new ResizeObserver(entries => {// Immediate update for critical dimension changes
            entries.forEach(entry => {
                const { width, height } = entry.contentRect;// Update if dimensions have changed
                if (width !== sizes.x || height !== sizes.y) { updateFromDOM(); }
            });// Also use throttled resize for performance
            throttledResize();
        }); resizeObserver.observe(container);// Also listen to window resize for global changes
        window.addEventListener("resize", throttledResize);// Intersection Observer to pause rendering when out of view
        const intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating && shouldAnimate()) {// Component came into view and should animate
                    render();
                }
            });
        }, { root: null, rootMargin: "50px", threshold: .01 }); intersectionObserver.observe(container); const onMove = e => {// Only handle mouse events if not in Canvas preview mode
            const isCanvasMode = RenderTarget.current() === RenderTarget.canvas; if (isCanvasMode && debouncedProps.preview) return;// Start animation if not already running
            if (!isAnimating && shouldAnimate()) { render(); } const containerRect = container.getBoundingClientRect(); const x = (e.clientX - containerRect.left) / containerRect.width; const y = 1 - (e.clientY - containerRect.top) / containerRect.height; uniforms.u_mouse.value.set(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)));
        }; const onEnter = () => {// Only handle hover events if not in Canvas preview mode
            const isCanvasMode = RenderTarget.current() === RenderTarget.canvas; if (isCanvasMode && debouncedProps.preview) return; targetProgress = 1; if (hover && hover.enabled) { animateToScale(hoverScaleRef.current); }// Start animation if not already running
            if (!isAnimating && shouldAnimate()) { render(); }
        }; const onLeave = () => {// Only handle hover events if not in Canvas preview mode
            const isCanvasMode = RenderTarget.current() === RenderTarget.canvas; if (isCanvasMode && debouncedProps.preview) return; targetProgress = 0; if (hover && hover.enabled) { animateToScale(1); }
        }; container.addEventListener("mousemove", onMove); container.addEventListener("mouseenter", onEnter); container.addEventListener("mouseleave", onLeave); return () => { if (rafId) { cancelAnimationFrame(rafId); } resizeObserver.disconnect(); intersectionObserver.disconnect(); window.removeEventListener("resize", throttledResize); if (resizeTimeout) { clearTimeout(resizeTimeout); } container.removeEventListener("mousemove", onMove); container.removeEventListener("mouseenter", onEnter); container.removeEventListener("mouseleave", onLeave); geometry.dispose(); material.dispose(); renderer.dispose(); };
    }, [debouncedProps.radius, debouncedProps.blur, debouncedProps.circleBoost, debouncedProps.texture, debouncedProps.timeSpeed,// no debounced hoverScale in new pattern
    debouncedProps.preview, imageBase?.positionX, imageBase?.positionY, imageHover?.positionX, imageHover?.positionY, mapRadius, mapBlur, mapCircleBoost, mapTexture, mapTimeSpeed, isMobile]); return /*#__PURE__*/_jsxs("div", { ref: containerRef, style: { width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: borderRadius, overflow: "clip", ...props.style }, children: [/*#__PURE__*/_jsx("figure", { style: { width: "100%", height: "100%", maxWidth: "100%", flex: "0 0 auto", margin: 0, padding: 0, position: "absolute", zIndex: 1 }, children:/*#__PURE__*/_jsx("img", { ref: imgRef, src: imageBase?.src, srcSet: imageBase?.srcSet, alt: imageBase?.alt || "Base image", draggable: false, style: { width: "100%", height: "100%", objectFit: "cover", objectPosition: `${imageBase?.positionX || "50%"} ${imageBase?.positionY || "50%"}`, margin: 0, padding: 0, userSelect: "none", pointerEvents: "none" } }) }), !isMobile &&/*#__PURE__*/_jsx("canvas", { ref: canvasRef, id: "stage", style: { position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 3, pointerEvents: "none", opacity: 1, minWidth: "100%", minHeight: "100%", maxWidth: "100%", maxHeight: "100%" } })] });
} addPropertyControls(LiquidMask, { preview: { type: ControlType.Boolean, title: "Preview", defaultValue: false, enabledTitle: "On", disabledTitle: "Off" }, imageBase: { type: ControlType.ResponsiveImage, title: "Base" }, imageHover: { type: ControlType.ResponsiveImage, title: "Hover" }, borderRadius: { type: ControlType.Number, title: "Radius", min: 0, max: 100, step: 1, defaultValue: 10, unit: "px" }, radius: { type: ControlType.Number, title: "Size", min: 10, max: 1e3, step: 10, defaultValue: 100, unit: "px" }, blur: { type: ControlType.Number, title: "Interaction", min: 0, max: 1, step: .01, defaultValue: .5, unit: "" }, circleBoost: { type: ControlType.Number, title: "Boost", min: 0, max: 1, step: .01, defaultValue: .5, unit: "" }, texture: { type: ControlType.Number, title: "Texture", min: 0, max: 1, step: .1, defaultValue: .5, unit: "" }, timeSpeed: { type: ControlType.Number, title: "Speed", min: 0, max: 10, step: .5, defaultValue: 5, unit: "" }, hover: { type: ControlType.Object, title: "Hover", description: "More components at [Framer University](https://frameruni.link/cc).", controls: { enabled: { type: ControlType.Boolean, title: "Enabled", defaultValue: false, enabledTitle: "On", disabledTitle: "Off" }, scale: { type: ControlType.Number, title: "Scale", min: 1, max: 3, step: .1, defaultValue: 1.2, unit: "x", hidden: props => !props.enabled }, transition: { type: ControlType.Transition, title: "Transition", defaultValue: { type: "tween", duration: .5, ease: [.44, 0, .56, 1], delay: 0 }, hidden: props => !props.enabled } } } }); LiquidMask.displayName = "Liquid Mask";
export const __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "LiquidMask", "slots": [], "annotations": { "framerSupportedLayoutWidth": "fixed", "framerIntrinsicWidth": "300", "framerIntrinsicHeight": "400", "framerDisableUnlink": "", "framerSupportedLayoutHeight": "fixed", "framerContractVersion": "1" } }, "__FramerMetadata__": { "type": "variable" } } }
//# sourceMappingURL=./Liquid_mask_Prod.map