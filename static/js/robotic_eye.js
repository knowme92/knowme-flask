import * as THREE from "./vendor/three.module.js";

import { GLTFLoader } from
    "./vendor/GLTFLoader.js";

import { RoomEnvironment } from
    "./vendor/RoomEnvironment.js";
(() => {
    "use strict";

    const canvas = document.getElementById("roboticEyeCanvas");
    if (!canvas) return;

    const stage = canvas.closest(".robotic-eye-stage");
    if (!stage) {
        console.error("[KNOWME Eye] .robotic-eye-stage was not found.");
        return;
    }

    const modelUrl = stage.dataset.modelUrl;
    const statusLabel = stage.querySelector(".robotic-eye-label span:last-child");
    const statusWrap = stage.querySelector(".robotic-eye-label");

    if (!modelUrl) {
        console.error("[KNOWME Eye] Missing data-model-url on stage.");
        setStatus("MODEL PATH MISSING", true);
        return;
    }

    function setStatus(message, failed = false) {
        if (statusLabel) statusLabel.textContent = message;
        if (statusWrap) statusWrap.classList.toggle("is-error", failed);
    }

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
    } catch (error) {
        console.error("[KNOWME Eye] WebGL renderer could not initialize:", error);
        setStatus("3D GRAPHICS UNAVAILABLE", true);
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);

    // Camera faces the model's front lens side (negative Z in this GLB).
    // Robotic Eye front lens faces the local negative Y axis.
// The robotic eye lens faces the local +Z axis.
camera.up.set(0, 1, 0);
camera.position.set(0, 0.04, 5.2);
camera.lookAt(0, 0, 0);

    // A procedural studio environment supplies reflections to the GLB's
    // metallic and glass-like PBR materials, similar to a model viewer HDRI.
    let pmremGenerator;
    let environmentTarget;
    try {
        pmremGenerator = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        environmentTarget = pmremGenerator.fromScene(room, 0.04);
        scene.environment = environmentTarget.texture;
        room.dispose();
    } catch (error) {
        console.warn("[KNOWME Eye] Studio environment setup failed; using direct lights.", error);
    }

    scene.add(new THREE.HemisphereLight(0xdbe5ff, 0x15131c, 1.55));

    const keyLight = new THREE.DirectionalLight(
    0xfff4eb,
    3.0
);
keyLight.position.set(-3.5, -4.5, 3.5);
scene.add(keyLight);

const frontFill = new THREE.DirectionalLight(
    0xb8d5ff,
    2.0
);
frontFill.position.set(3.8, -5.0, 0.8);
scene.add(frontFill);

const violetRim = new THREE.PointLight(
    0x8957ff,
    20,
    10,
    2
);
violetRim.position.set(2.8, -2.0, -1.5);
scene.add(violetRim);

const blueRim = new THREE.PointLight(
    0x328cff,
    17,
    11,
    2
);
blueRim.position.set(-3.0, 1.5, 2.4);
scene.add(blueRim);

    const modelPivot = new THREE.Group();
    scene.add(modelPivot);

    let modelReady = false;
    let loadedModel = null;
    let animationFrame = 0;
    let isIntersecting = true;
    let isPageVisible = !document.hidden;
    let disposed = false;
    // Camera orbit controls
    let cameraDistance = 5.2;

    let orbitAzimuth = 0;
    let orbitPolar = Math.PI / 2;

    let isDragging = false;

    let lastPointerX = 0;
    let lastPointerY = 0;
    let modelRadius = 1.35;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const clock = new THREE.Clock();

    const loader = new GLTFLoader();
    setStatus("LOADING ROBOTIC EYE");

    loader.load(
        modelUrl,
        (gltf) => {
            if (disposed) return;

            const model = gltf.scene;
            loadedModel = model;
            model.updateMatrixWorld(true);

            const bounds = new THREE.Box3().setFromObject(model);
            if (bounds.isEmpty()) {
                setStatus("MODEL HAS NO VISIBLE MESH", true);
                console.error("[KNOWME Eye] The GLB loaded but contains no measurable geometry.");
                return;
            }

            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
                setStatus("INVALID MODEL DIMENSIONS", true);
                return;
            }

            // The Sketchfab GLB has a small root transform. Normalize its
            // overall size without changing its internal mesh/material setup.
            model.position.sub(center);
            const targetSize = 2.65;
            const normalizationScale = targetSize / maxDimension;
            model.scale.multiplyScalar(normalizationScale);



model.traverse((object) => {

    if (!object.isMesh) return;

    object.frustumCulled = true;
    object.castShadow = false;
    object.receiveShadow = false;

    const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

    for (const material of materials) {

        if (!material) continue;

        if ("envMapIntensity" in material) {
            material.envMapIntensity =
                material.metalness > 0.35 ? 1.35 : 1.0;
        }

        material.needsUpdate = true;
    }

});
// =====================================================
// RESTORE ORIGINAL RED LED TEXTURE
// =====================================================

// =====================================================
// FIND AND RESTORE ORIGINAL RED LED MESH
// =====================================================

const ledMeshes = [];

model.traverse((object) => {

    if (!object.isMesh) return;

    const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

    // Find the original LED material instead of relying
    // on an exact mesh name.
    const ledMaterial = materials.find(
        material =>
            material &&
            material.name.trim().toLowerCase() === "light"
    );

    if (!ledMaterial) return;

    ledMeshes.push(object);

    object.visible = true;
    object.frustumCulled = false;

    if (ledMaterial.emissiveMap) {

    // Preserve original embedded red LED texture.
    ledMaterial.emissiveMap.colorSpace =
        THREE.SRGBColorSpace;

    ledMaterial.emissiveMap.needsUpdate = true;

} else {

    console.error(
        "[KNOWME Eye] Light material has no emissive texture."
    );

}

ledMaterial.emissive.setRGB(1, 1, 1);
ledMaterial.emissiveIntensity = 2.5;
ledMaterial.toneMapped = false;

// Draw LED geometry above the dark lens geometry.
ledMaterial.depthTest = false;
ledMaterial.depthWrite = false;

object.renderOrder = 100;

ledMaterial.needsUpdate = true;


});

if (ledMeshes.length > 0) {

    console.info(
        "[KNOWME Eye] Original LED meshes restored:",
        ledMeshes.map(mesh => ({
            name: mesh.name,
            material: "Light",
            textureLoaded: !!ledMeshes.length
        }))
    );

} else {

    console.error(
        "[KNOWME Eye] No mesh using the Light material was found."
    );

    model.traverse((object) => {

        if (!object.isMesh) return;

        console.log(
            "[KNOWME Eye] Available mesh:",
            object.name,
            Array.isArray(object.material)
                ? object.material.map(m => m?.name)
                : object.material?.name
        );

    });

}







            modelPivot.add(model);
            modelReady = true;
            modelRadius = targetSize * 0.5;
            fitCamera();
            setStatus("KNOWME · VISUAL INTELLIGENCE");
            startRendering();
            console.info("[KNOWME Eye] GLB loaded successfully.", {
                url: modelUrl,
                meshes: countMeshes(model),
                materials: countMaterials(model),
                sourceDimensions: size.toArray(),
                normalizationScale
            });
        },
        (event) => {
            if (event.total > 0) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setStatus(`LOADING ROBOTIC EYE · ${percent}%`);
            }
        },
        (error) => {
            if (disposed) return;
            setStatus("3D MODEL COULD NOT LOAD", true);
            console.error("[KNOWME Eye] GLB load failed. Check the URL and Network tab:", modelUrl, error);
        }
    );

    function countMeshes(root) {
        let count = 0;
        root.traverse((node) => { if (node.isMesh) count += 1; });
        return count;
    }

    function countMaterials(root) {
        const found = new Set();
        root.traverse((node) => {
            if (!node.isMesh) return;
            for (const material of (Array.isArray(node.material) ? node.material : [node.material])) {
                if (material) found.add(material);
            }
        });
        return found.size;
    }
    function updateOrbitCamera() {

    const sinPolar = Math.sin(orbitPolar);

    camera.position.set(
        cameraDistance * sinPolar * Math.sin(orbitAzimuth),
        cameraDistance * Math.cos(orbitPolar),
        cameraDistance * sinPolar * Math.cos(orbitAzimuth)
    );

    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
}
    function fitCamera() {

    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);

    const aspect = width / height;

    const verticalFov = THREE.MathUtils.degToRad(camera.fov);

    const horizontalFov = 2 * Math.atan(
        Math.tan(verticalFov / 2) * aspect
    );

    const limitingFov = Math.min(
        verticalFov,
        horizontalFov
    );

    const distance =
        modelRadius / Math.sin(limitingFov / 2);

    cameraDistance = Math.max(3.6, distance * 1.16);

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    updateOrbitCamera();
}

    function resize() {
        if (disposed) return;
        const width = Math.max(1, stage.clientWidth);
        const height = Math.max(1, stage.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (modelReady) fitCamera();
        renderOnce();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    // =====================================================

    // =====================================================
    // MOUSE DRAG CAMERA ORBIT
    // =====================================================

    canvas.style.cursor = "grab";

    canvas.addEventListener("pointerdown", (event) => {

        if (event.button !== 0) return;

        isDragging = true;

        lastPointerX = event.clientX;
        lastPointerY = event.clientY;

        canvas.style.cursor = "grabbing";

        canvas.setPointerCapture(event.pointerId);

        event.preventDefault();
    });

    canvas.addEventListener("pointermove", (event) => {

    if (!isDragging) return;

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;

    const sensitivity = 0.0045;

    // Horizontal mouse movement.
    orbitAzimuth -= deltaX * sensitivity;

    // Vertical mouse movement.
    orbitPolar -= deltaY * sensitivity;

    orbitPolar = THREE.MathUtils.clamp(
        orbitPolar,
        0.25,
        Math.PI - 0.25
    );

    updateOrbitCamera();
    renderOnce();

    event.preventDefault();

}, { passive: false });

    function stopCameraDrag(event) {

        if (!isDragging) return;

        isDragging = false;

        canvas.style.cursor = "grab";

        if (
            event &&
            canvas.hasPointerCapture(event.pointerId)
        ) {
            canvas.releasePointerCapture(event.pointerId);
        }
    }

    canvas.addEventListener("pointerup", stopCameraDrag);
    canvas.addEventListener("pointercancel", stopCameraDrag);

    canvas.addEventListener("lostpointercapture", () => {

        isDragging = false;
        canvas.style.cursor = "grab";

    });


    function renderOnce() {
        if (!disposed && isPageVisible && isIntersecting) {
            renderer.render(scene, camera);
        }
    }

    function animate() {
        animationFrame = 0;
        if (disposed || !isPageVisible || !isIntersecting) return;

        const elapsed = clock.getElapsedTime();
        if (modelReady) {

    // Keep the eye facing forward by default.
    // Only subtle vertical floating remains.

    modelPivot.position.y = reducedMotion
        ? 0
        : Math.sin(elapsed * 0.72) * 0.018;
}

        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
    }

    function startRendering() {
        if (disposed || !modelReady || animationFrame || !isPageVisible || !isIntersecting) return;
        clock.start();
        animationFrame = requestAnimationFrame(animate);
    }

    function stopRendering() {
        if (!animationFrame) return;
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) startRendering();
        else stopRendering();
    }, { threshold: 0.02 });
    intersectionObserver.observe(stage);

    document.addEventListener("visibilitychange", () => {
        isPageVisible = !document.hidden;
        if (isPageVisible) startRendering();
        else stopRendering();
    });

    window.addEventListener("pagehide", () => {
        disposed = true;
        stopRendering();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        if (loadedModel) {
            const geometries = new Set();
            const materials = new Set();
            const textures = new Set();
            loadedModel.traverse((object) => {
                if (object.geometry) geometries.add(object.geometry);
                const list = Array.isArray(object.material)
                    ? object.material
                    : (object.material ? [object.material] : []);
                for (const material of list) {
                    materials.add(material);
                    for (const value of Object.values(material)) {
                        if (value && value.isTexture) textures.add(value);
                    }
                }
            });
            for (const texture of textures) texture.dispose();
            for (const material of materials) material.dispose();
            for (const geometry of geometries) geometry.dispose();
        }
        if (environmentTarget) environmentTarget.dispose();
        if (pmremGenerator) pmremGenerator.dispose();
        renderer.dispose();
    }, { once: true });

    // Initial layout; GLB callback repeats fitCamera after bounds are known.
    resize();
})();
