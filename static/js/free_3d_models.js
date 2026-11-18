import * as THREE from "./vendor/three.module.js";
import { GLTFLoader } from "./vendor/GLTFLoader.js";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";

(() => {
    "use strict";

    const stages = Array.from(document.querySelectorAll("[data-free-3d-stage]"));
    if (!stages.length) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    stages.forEach((stage) => {
        const canvas = stage.querySelector("canvas");
        const status = stage.querySelector("[data-viewer-status]");
        const modelUrl = stage.dataset.modelUrl;
        if (!canvas || !modelUrl) return;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        } catch (error) {
            if (status) status.textContent = "3D VIEWER NOT AVAILABLE";
            console.error("[KNOWME 3D] WebGL initialization failed:", error);
            return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
        camera.position.set(0, 0.2, 4.8);

        let pmrem;
        let environment;
        try {
            pmrem = new THREE.PMREMGenerator(renderer);
            const room = new RoomEnvironment();
            environment = pmrem.fromScene(room, 0.04);
            scene.environment = environment.texture;
            room.dispose();
        } catch (error) {
            console.warn("[KNOWME 3D] Studio environment unavailable:", error);
        }

        scene.add(new THREE.HemisphereLight(0xdce8ff, 0x17101c, 1.7));
        const key = new THREE.DirectionalLight(0xffe7df, 2.7);
        key.position.set(-3, 4, 5);
        scene.add(key);
        const blue = new THREE.PointLight(0x247aff, 18, 12, 2);
        blue.position.set(3, 1, -2);
        scene.add(blue);
        const red = new THREE.PointLight(0xff334f, 12, 10, 2);
        red.position.set(-3, -1, 2);
        scene.add(red);

        const pivot = new THREE.Group();
        scene.add(pivot);

        let disposed = false;
        let ready = false;
        let visible = true;
        let pageVisible = !document.hidden;
        let raf = 0;
        let dragging = false;
        let lastX = 0;
        let lastY = 0;
        let azimuth = 0;
        let polar = Math.PI / 2;
        let distance = 4.8;
        let radius = 1.25;
        const clock = new THREE.Clock();
        const loader = new GLTFLoader();

        const updateCamera = () => {
            const sin = Math.sin(polar);
            camera.position.set(distance * sin * Math.sin(azimuth), distance * Math.cos(polar), distance * sin * Math.cos(azimuth));
            camera.lookAt(0, 0, 0);
        };

        const fit = () => {
            const width = Math.max(1, stage.clientWidth);
            const height = Math.max(1, stage.clientHeight);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            const fov = THREE.MathUtils.degToRad(camera.fov);
            distance = Math.max(3.2, (radius / Math.sin(fov / 2)) * 1.18);
            updateCamera();
            renderer.setSize(width, height, false);
            renderOnce();
        };

        const renderOnce = () => {
            if (!disposed && pageVisible && visible) renderer.render(scene, camera);
        };

        const animate = () => {
            raf = 0;
            if (disposed || !pageVisible || !visible) return;
            if (ready && !dragging && !reducedMotion) pivot.rotation.y += 0.0022;
            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };

        const start = () => {
            if (!disposed && ready && pageVisible && visible && !raf) {
                clock.start();
                raf = requestAnimationFrame(animate);
            }
        };
        const stop = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
        };

        if (status) status.textContent = "LOADING 3D MODEL";
        loader.load(modelUrl, (gltf) => {
            if (disposed) return;
            const model = gltf.scene;
            model.updateMatrixWorld(true);
            const bounds = new THREE.Box3().setFromObject(model);
            if (bounds.isEmpty()) {
                if (status) status.textContent = "MODEL HAS NO VISIBLE MESH";
                return;
            }
            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
                if (status) status.textContent = "INVALID MODEL DIMENSIONS";
                return;
            }
            model.position.sub(center);
            model.scale.multiplyScalar(2.25 / maxDimension);
            model.traverse((node) => {
                if (!node.isMesh) return;
                node.frustumCulled = true;
                if (node.material) {
                    const materials = Array.isArray(node.material) ? node.material : [node.material];
                    materials.forEach((material) => { if (material && "envMapIntensity" in material) material.envMapIntensity = 1.1; });
                }
            });
            pivot.add(model);
            radius = 1.2;
            ready = true;
            if (status) status.textContent = "INTERACTIVE PREVIEW READY";
            fit();
            start();
        }, (event) => {
            if (status && event.total > 0) status.textContent = `LOADING · ${Math.round(event.loaded / event.total * 100)}%`;
        }, (error) => {
            if (status) status.textContent = "MODEL PREVIEW COULD NOT LOAD";
            console.error("[KNOWME 3D] Failed to load model:", modelUrl, error);
        });

        canvas.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) return;
            dragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
            canvas.setPointerCapture(event.pointerId);
            canvas.style.cursor = "grabbing";
        });
        canvas.addEventListener("pointermove", (event) => {
            if (!dragging) return;
            azimuth -= (event.clientX - lastX) * 0.005;
            polar = THREE.MathUtils.clamp(polar - (event.clientY - lastY) * 0.005, 0.25, Math.PI - 0.25);
            lastX = event.clientX;
            lastY = event.clientY;
            updateCamera();
            renderOnce();
        });
        const endDrag = () => { dragging = false; canvas.style.cursor = "grab"; };
        canvas.addEventListener("pointerup", endDrag);
        canvas.addEventListener("pointercancel", endDrag);
        canvas.addEventListener("wheel", (event) => {
            event.preventDefault();
            distance = THREE.MathUtils.clamp(distance + event.deltaY * 0.004, 2.4, 12);
            updateCamera();
            renderOnce();
        }, { passive: false });
        canvas.style.cursor = "grab";
        canvas.style.touchAction = "pan-y";

        const resizeObserver = new ResizeObserver(fit);
        resizeObserver.observe(stage);
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start(); else stop();
        }, { threshold: 0.04 });
        intersectionObserver.observe(stage);
        document.addEventListener("visibilitychange", () => {
            pageVisible = !document.hidden;
            if (pageVisible) start(); else stop();
        });
        window.addEventListener("pagehide", () => {
            disposed = true;
            stop();
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            if (environment) environment.dispose();
            if (pmrem) pmrem.dispose();
            renderer.dispose();
        }, { once: true });
        fit();
    });
})();
