import * as THREE from "./vendor/three.module.js";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";
import { GLTFLoader } from "./vendor/GLTFLoader.js";

(() => {
    "use strict";

    const hero = document.querySelector("[data-sp3d-hero]");
    const form = document.getElementById("startProjectForm");
    if (!hero || !form) return;

    const canvas = hero.querySelector("#sp3dCanvas");
    const status = hero.querySelector("#sp3dStatus");
    const heroTitle = hero.querySelector("#sp3dHeroTitle");
    const syncRippleText = () => {
        if (heroTitle) heroTitle.setAttribute("data-ripple-text", (heroTitle.textContent || "").trim());
    };
    syncRippleText();
    if (heroTitle && "MutationObserver" in window) {
        new MutationObserver(syncRippleText).observe(heroTitle, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const lowPower = coarsePointer || (navigator.deviceMemory && navigator.deviceMemory <= 4);

    const MODEL_URLS = {
        galaxy: "/static/models/milky_way_galaxy.glb?v=2",
        blackHole: "/static/models/black_hole.glb?v=3"
    };

    const startButton = document.getElementById("spStartBuilding");
    startButton?.addEventListener("click", () => {
        document.getElementById("spConfigurator")?.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
        });
    });

    let renderer;
    let scene;
    let camera;
    let spaceRoot;
    let galaxyPivot;
    let blackHolePivot;
    let starField;
    let blackHoleMixer;
    let frame = 0;
    let visible = true;
    // Damped orbit camera: mouse drag rotates, wheel zooms toward the galactic core.
    let orbitTheta = 0;
    let targetOrbitTheta = 0;
    let orbitPhi = Math.PI / 2;
    let targetOrbitPhi = Math.PI / 2;
    let cameraDistance = 22.5;
    let targetCameraDistance = 22.5;
    let pageScrollDive = 0;
    let isOrbitDragging = false;
    let activePointerId = null;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let resizeObserver;
    let lastFrameTime = 0;

    const CAMERA_MIN_DISTANCE = 3.1;
    const CAMERA_MAX_DISTANCE = 42;
    const CAMERA_DRAG_SENSITIVITY = 0.006;
    const CAMERA_WHEEL_SENSITIVITY = 0.00135;

    function localizedText(key, fallback) {
        const language = document.documentElement.lang || "en";
        const lookup = window.getTranslation;
        if (typeof lookup !== "function") return fallback;
        return lookup(language, `startProject.${key}`)
            || lookup("en", `startProject.${key}`)
            || fallback;
    }

    const modelLoader = hero.querySelector("#sp3dModelLoader");
    const modelLoaderTitle = hero.querySelector("#sp3dModelLoaderTitle");
    const modelLoaderHint = hero.querySelector("#sp3dModelLoaderHint");
    const modelLoaderRetry = hero.querySelector("#sp3dModelLoaderRetry");
    const modelLoaderCopy = {
        en: {
            loading: "Loading 3D models...",
            loadingHint: "Preparing the live 3D scene. This notice disappears when the models are ready.",
            error: "The 3D models could not be loaded.",
            errorHint: "Check your connection and try loading the scene again.",
            retry: "RETRY"
        },
        hy: {
            loading: "3D մոդելները բեռնվում են...",
            loadingHint: "Պատրաստվում է կենդանի 3D տեսարանը։ Հաղորդագրությունը կանհետանա, երբ մոդելները պատրաստ լինեն։",
            error: "Չհաջողվեց բեռնել 3D մոդելները։",
            errorHint: "Ստուգեք ինտերնետ կապը և կրկին փորձեք բեռնել տեսարանը։",
            retry: "ԿՐԿԻՆ ՓՈՐՁԵԼ"
        },
        ru: {
            loading: "Загрузка 3D-моделей...",
            loadingHint: "Подготавливается 3D-сцена. Сообщение исчезнет, когда модели будут готовы.",
            error: "Не удалось загрузить 3D-модели.",
            errorHint: "Проверьте подключение к интернету и повторите загрузку сцены.",
            retry: "ПОВТОРИТЬ"
        }
    };

    let modelLoaderState = "loading";

    function getModelLoaderCopy() {
        const pageLanguage = (document.documentElement.lang || navigator.language || "en").toLowerCase();
        return modelLoaderCopy[pageLanguage.slice(0, 2)] || modelLoaderCopy.en;
    }

    function renderModelLoaderCopy() {
        if (!modelLoader) return;
        const copy = getModelLoaderCopy();
        const isError = modelLoaderState === "error";
        if (modelLoaderTitle) modelLoaderTitle.textContent = isError ? copy.error : copy.loading;
        if (modelLoaderHint) modelLoaderHint.textContent = isError ? copy.errorHint : copy.loadingHint;
        if (modelLoaderRetry) {
            modelLoaderRetry.textContent = copy.retry;
            modelLoaderRetry.hidden = !isError;
        }
    }

    function setModelLoaderState(state) {
        modelLoaderState = state;
        if (!modelLoader) return;
        renderModelLoaderCopy();
        const isReady = state === "ready";
        modelLoader.classList.toggle("is-error", state === "error");
        modelLoader.classList.toggle("is-hidden", isReady);
        modelLoader.setAttribute("aria-hidden", String(isReady));
    }

    renderModelLoaderCopy();
    if ("MutationObserver" in window) {
        new MutationObserver(renderModelLoaderCopy).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["lang"]
        });
    }
    modelLoaderRetry?.addEventListener("click", () => window.location.reload());

    let currentStatus = null;

    function setStatus(key, fallback, failed = false) {
        currentStatus = { key, fallback, failed };
        if (!status) return;
        status.textContent = localizedText(key, fallback);
        status.classList.toggle("is-error", failed);
        status.classList.toggle("is-ready", !failed);
    }

    function addStarField() {
        const count = lowPower ? 260 : 620;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let index = 0; index < count; index += 1) {
            const radius = 13 + Math.random() * 27;
            const azimuth = Math.random() * Math.PI * 2;
            const vertical = (Math.random() - 0.5) * 23;
            positions[index * 3] = Math.cos(azimuth) * radius;
            positions[index * 3 + 1] = vertical;
            positions[index * 3 + 2] = Math.sin(azimuth) * radius * 0.7;

            const tint = Math.random();
            colors[index * 3] = 0.62 + tint * 0.30;
            colors[index * 3 + 1] = 0.70 + tint * 0.24;
            colors[index * 3 + 2] = 0.82 + tint * 0.18;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: lowPower ? 0.055 : 0.065,
            vertexColors: true,
            transparent: true,
            opacity: 0.64,
            sizeAttenuation: true,
            depthWrite: false
        });

        starField = new THREE.Points(geometry, material);
        starField.name = "KNOWME_Background_Stars";
        scene.add(starField);
    }

    function normalizeModel(model, targetDiameter) {
        // Keep the source GLB's own node transforms. Both supplied assets already
        // carry their correct Sketchfab axis conversion. Adding another -90deg
        // rotation turns the accretion disc face-on; leaving the root untouched
        // presents the galaxy and black-hole disc in their natural side orientation.
        model.rotation.set(0, 0, 0);
        model.updateMatrixWorld(true);

        const bounds = new THREE.Box3().setFromObject(model);
        if (bounds.isEmpty()) {
            throw new Error("The GLB model contains no visible geometry");
        }

        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const largestDimension = Math.max(size.x, size.y, size.z);
        if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
            throw new Error("The GLB model has invalid dimensions");
        }

        const fitScale = targetDiameter / largestDimension;
        model.scale.setScalar(fitScale);
        model.position.set(
            -center.x * fitScale,
            -center.y * fitScale,
            -center.z * fitScale
        );
        model.updateMatrixWorld(true);

        model.traverse((object) => {
            if (object.isPoints) {
                // The Milky Way asset is an authored 160k-point GLB. Keep its
                // original positions, vertex colors and GLTF PointsMaterial.
                // glTF specifies one-pixel points; do not replace them with a
                // custom oversized additive shader or invent additional geometry.
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.filter(Boolean).forEach((material) => {
                    if (material.isPointsMaterial) {
                        material.size = 1.0;
                        material.sizeAttenuation = false;
                        material.depthWrite = false;
                        material.needsUpdate = true;
                    }
                });
                object.renderOrder = 1;
                object.frustumCulled = true;
            }

            if (object.isMesh) {
                object.frustumCulled = true;
                object.renderOrder = 10;

                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.filter(Boolean).forEach((material) => {
                    material.depthTest = true;

                    if (material.name === "EventHorizon") {
                        // Keep the event horizon opaque so the galaxy cannot show
                        // through the black centre. DoubleSide also protects the
                        // silhouette from winding differences in exported assets.
                        material.transparent = false;
                        material.opacity = 1;
                        material.depthWrite = true;
                        material.side = THREE.DoubleSide;
                    } else if (material.name === "AccretionDisk_Emissive") {
                        // Retain the GLB's emissive texture and original alpha mode.
                        material.transparent = true;
                        material.depthWrite = false;
                    } else if (material.name === "PhotonRing") {
                        material.depthWrite = true;
                        material.side = THREE.DoubleSide;
                    }

                    material.needsUpdate = true;
                });
            }
        });

        return { scale: fitScale, size, center };
    }

    const orbitTracks = [];

    function addOrbitalGuides() {
        // Fine, restrained navigation rings add motion around the supplied GLBs
        // without replacing or obscuring any part of either source model.
        const guideRoot = new THREE.Group();
        guideRoot.name = "KNOWME_Animated_Orbital_Guides";

        const tracks = [
            { radius: 7.5, color: 0x55aaff, planetColor: 0x5caeff, opacity: 0.24, speed: 0.024, phase: 0.2, tiltX: 0.17, tiltY: 0.11, tiltZ: -0.13, planetSize: 0.115 },
            { radius: 8.7, color: 0xf05b71, planetColor: 0xff6b78, opacity: 0.18, speed: -0.018, phase: 1.7, tiltX: -0.23, tiltY: -0.15, tiltZ: 0.19, planetSize: 0.105 },
            { radius: 6.55, color: 0xb8d8ff, planetColor: 0xd7e8ff, opacity: 0.16, speed: 0.014, phase: 2.9, tiltX: 0.31, tiltY: 0.22, tiltZ: 0.08, planetSize: 0.095 }
        ];

        tracks.forEach((config, index) => {
            const orbit = new THREE.Group();
            orbit.name = `KNOWME_Orbital_Track_${index + 1}`;
            orbit.rotation.set(config.tiltX, config.tiltY, config.tiltZ);

            const ringGeometry = new THREE.TorusGeometry(config.radius, 0.009, 6, 220);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: config.opacity,
                depthTest: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                toneMapped: false
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.renderOrder = 3;
            orbit.add(ring);

            // A small physical planet now travels along each orbital guide.
            // The orbit group carries the planet around the black hole at a slow pace.
            const planetSystem = new THREE.Group();
            planetSystem.name = `KNOWME_Orbiting_Planet_${index + 1}`;
            planetSystem.position.set(config.radius, 0, 0);

            const planetMaterial = new THREE.MeshStandardMaterial({
                color: config.planetColor,
                emissive: config.color,
                emissiveIntensity: 0.34,
                metalness: 0.52,
                roughness: 0.3,
                transparent: false
            });
            const planet = new THREE.Mesh(
                new THREE.SphereGeometry(config.planetSize, 22, 16),
                planetMaterial
            );
            planet.name = `KNOWME_Planet_Body_${index + 1}`;
            planet.castShadow = false;
            planet.receiveShadow = false;
            planet.renderOrder = 5;
            planetSystem.add(planet);

            const auraMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.13,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                toneMapped: false
            });
            const aura = new THREE.Mesh(
                new THREE.SphereGeometry(config.planetSize * 1.72, 16, 12),
                auraMaterial
            );
            aura.name = `KNOWME_Planet_Aura_${index + 1}`;
            aura.renderOrder = 4;
            planetSystem.add(aura);

            const satellitePivot = new THREE.Group();
            satellitePivot.name = `KNOWME_Planet_Satellite_Orbit_${index + 1}`;
            const satelliteMaterial = new THREE.MeshStandardMaterial({
                color: 0xe7f2ff,
                emissive: config.color,
                emissiveIntensity: 0.55,
                metalness: 0.35,
                roughness: 0.25
            });
            const satellite = new THREE.Mesh(
                new THREE.SphereGeometry(config.planetSize * 0.24, 12, 10),
                satelliteMaterial
            );
            satellite.position.set(config.planetSize * 2.05, config.planetSize * 0.32, 0);
            satellite.name = `KNOWME_Planet_Moon_${index + 1}`;
            satellitePivot.add(satellite);
            planetSystem.add(satellitePivot);

            // A faint ring around each planet helps the eye track its motion
            // without turning the guide into a bright arcade-style effect.
            const planetRing = new THREE.Mesh(
                new THREE.TorusGeometry(config.planetSize * 1.42, 0.006, 5, 44),
                new THREE.MeshBasicMaterial({
                    color: config.color,
                    transparent: true,
                    opacity: 0.46,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    toneMapped: false
                })
            );
            planetRing.rotation.x = Math.PI / 2.65;
            planetRing.rotation.y = 0.28 + index * 0.2;
            planetSystem.add(planetRing);
            orbit.add(planetSystem);

            guideRoot.add(orbit);
            orbitTracks.push({
                orbit,
                ringMaterial,
                planetMaterial,
                auraMaterial,
                planet,
                satellitePivot,
                speed: config.speed,
                phase: config.phase,
                opacity: config.opacity,
                tiltX: config.tiltX,
                tiltY: config.tiltY,
                tiltZ: config.tiltZ
            });
        });

        spaceRoot.add(guideRoot);
    }

    function buildFallbackCore() {
        const fallback = new THREE.Group();
        const sphere = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.35, 2),
            new THREE.MeshBasicMaterial({
                color: 0x9bb9e5,
                wireframe: true,
                transparent: true,
                opacity: 0.23
            })
        );
        const inner = new THREE.Mesh(
            new THREE.SphereGeometry(0.72, 32, 24),
            new THREE.MeshBasicMaterial({
                color: 0x0b1425,
                transparent: true,
                opacity: 0.72
            })
        );
        fallback.add(sphere, inner);
        fallback.name = "KNOWME_3D_Fallback";
        spaceRoot.add(fallback);
        return fallback;
    }

    async function loadSpaceModels() {
        const loader = new GLTFLoader();
        const results = await Promise.allSettled([
            loader.loadAsync(MODEL_URLS.galaxy),
            loader.loadAsync(MODEL_URLS.blackHole)
        ]);

        const galaxyResult = results[0];
        const blackHoleResult = results[1];
        let loadedCount = 0;

        if (galaxyResult.status === "fulfilled") {
            const galaxy = galaxyResult.value.scene;
            // Preserve the GLB's native node transforms: the galaxy disc remains
            // horizontal and is viewed from its edge at the initial camera angle.
            normalizeModel(galaxy, 12.8);
            galaxyPivot = new THREE.Group();
            galaxyPivot.name = "KNOWME_Milky_Way_Pivot";
            galaxyPivot.add(galaxy);
            spaceRoot.add(galaxyPivot);
            loadedCount += 1;
        } else {
            console.error("[KNOWME Builder] Milky Way model failed to load:", galaxyResult.reason);
        }

        if (blackHoleResult.status === "fulfilled") {
            const blackHole = blackHoleResult.value.scene;
            normalizeModel(blackHole, 3.75);
            blackHolePivot = new THREE.Group();
            blackHolePivot.name = "KNOWME_Black_Hole_Pivot";
            blackHolePivot.add(blackHole);
            blackHolePivot.renderOrder = 10;
            spaceRoot.add(blackHolePivot);

            if (blackHoleResult.value.animations?.length) {
                blackHoleMixer = new THREE.AnimationMixer(blackHole);
                const diskRotation = blackHoleMixer.clipAction(blackHoleResult.value.animations[0]);
                diskRotation.setEffectiveTimeScale(1.22);
                diskRotation.play();
            }
            loadedCount += 1;
        } else {
            console.error("[KNOWME Builder] Black hole model failed to load:", blackHoleResult.reason);
        }

        if (loadedCount === 2) {
            setStatus("heroReady", "MILKY WAY + BLACK HOLE · 3D READY");
        } else if (loadedCount === 1) {
            setStatus("heroPartial", "PARTIAL 3D LOAD · CHECK MODEL ASSETS", true);
        } else {
            buildFallbackCore();
            setStatus("heroFallback", "3D MODELS UNAVAILABLE · FALLBACK SCENE", true);
        }

        if (renderer && camera) renderer.render(scene, camera);
        // Hide the notice only after both GLB assets have been added and the scene renders.
        setModelLoaderState(loadedCount === 2 ? "ready" : "error");
    }

    function initScene() {
        if (!canvas || !window.WebGLRenderingContext) {
            setStatus("heroFallback", "3D PREVIEW NOT AVAILABLE · STATIC FALLBACK", true);
            setModelLoaderState("error");
            hero.classList.add("sp3d-fallback");
            return;
        }

        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: !lowPower,
                powerPreference: lowPower ? "low-power" : "high-performance",
                stencil: false,
                depth: true
            });
        } catch (error) {
            console.warn("[KNOWME Builder] WebGL renderer unavailable:", error?.name || "Error");
            setStatus("heroFallback", "3D PREVIEW NOT AVAILABLE · STATIC FALLBACK", true);
            setModelLoaderState("error");
            hero.classList.add("sp3d-fallback");
            return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.1 : 1.45));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.92;
        renderer.setClearColor(0x03060c, 0);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x050810, 24, 54);
        camera = new THREE.PerspectiveCamera(40, 1, 0.08, 120);
        cameraDistance = targetCameraDistance = lowPower ? 25 : 22.5;
        orbitTheta = targetOrbitTheta = 0.16;
        orbitPhi = targetOrbitPhi = 1.39;

        const updateCameraPosition = (smooth = true) => {
            const damping = smooth ? 0.16 : 1;
            orbitTheta += (targetOrbitTheta - orbitTheta) * damping;
            orbitPhi += (targetOrbitPhi - orbitPhi) * damping;
            cameraDistance += (targetCameraDistance - cameraDistance) * damping;

            // Normal page scrolling through the hero adds a gentle forward dive.
            const effectiveDistance = THREE.MathUtils.clamp(
                cameraDistance - pageScrollDive,
                CAMERA_MIN_DISTANCE,
                CAMERA_MAX_DISTANCE
            );
            const sinPhi = Math.sin(orbitPhi);
            camera.position.set(
                effectiveDistance * sinPhi * Math.sin(orbitTheta),
                effectiveDistance * Math.cos(orbitPhi),
                effectiveDistance * sinPhi * Math.cos(orbitTheta)
            );
            camera.lookAt(0, 0, 0);
        };

        const renderAfterInteraction = () => {
            updateCameraPosition(false);
            if (reducedMotion && renderer) renderer.render(scene, camera);
        };

        spaceRoot = new THREE.Group();
        spaceRoot.name = "KNOWME_Galactic_System";
        scene.add(spaceRoot);
        addOrbitalGuides();

        scene.add(new THREE.HemisphereLight(0xc6d9ff, 0x090d18, 1.08));
        scene.add(new THREE.AmbientLight(0x526b91, 0.68));

        const keyLight = new THREE.DirectionalLight(0xe7efff, 2.25);
        keyLight.position.set(-5, 7, 9);
        scene.add(keyLight);

        const redLight = new THREE.PointLight(0xff334f, 8.5, 18, 2);
        redLight.position.set(-5.2, -1.5, 3.5);
        scene.add(redLight);

        const blueLight = new THREE.PointLight(0x367eff, 10.5, 20, 2);
        blueLight.position.set(5.1, 2.2, 4.2);
        scene.add(blueLight);

        try {
            const pmrem = new THREE.PMREMGenerator(renderer);
            const room = new RoomEnvironment();
            const environment = pmrem.fromScene(room, 0.04).texture;
            scene.environment = environment;
            room.dispose?.();
            pmrem.dispose();
        } catch (error) {
            console.info("[KNOWME Builder] Environment map fallback:", error?.name || "Error");
        }

        addStarField();
        setStatus("heroLoading", "LOADING MILKY WAY + BLACK HOLE MODELS");

        const resize = () => {
            const bounds = hero.getBoundingClientRect();
            const width = Math.max(1, Math.floor(bounds.width));
            const height = Math.max(1, Math.floor(bounds.height));
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            updateCameraPosition(false);
            renderer.render(scene, camera);
        };

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(hero);
        resize();

        const interactiveTarget = (target) => Boolean(
            target?.closest?.("a, button, input, textarea, select, label")
        );

        const onPointerDown = (event) => {
            const isTouchPointer = event.pointerType === "touch";
            if ((!isTouchPointer && event.button !== 0) || interactiveTarget(event.target)) return;
            isOrbitDragging = true;
            activePointerId = event.pointerId;
            lastPointerX = event.clientX;
            lastPointerY = event.clientY;
            hero.classList.add("is-orbiting");
            if (isTouchPointer) hero.classList.add("is-touch-orbiting");
            try { hero.setPointerCapture(event.pointerId); } catch (_) { /* optional */ }
            if (!isTouchPointer) event.preventDefault();
        };

        const onPointerMove = (event) => {
            if (!isOrbitDragging || event.pointerId !== activePointerId) return;
            const deltaX = event.clientX - lastPointerX;
            const deltaY = event.clientY - lastPointerY;
            lastPointerX = event.clientX;
            lastPointerY = event.clientY;

            const isTouchPointer = event.pointerType === "touch";
            // Touch: horizontal swipes orbit the scene while vertical movement remains
            // available to the browser for normal page scrolling.
            targetOrbitTheta -= deltaX * CAMERA_DRAG_SENSITIVITY * (isTouchPointer ? 1.18 : 1);
            if (!isTouchPointer) {
                targetOrbitPhi = THREE.MathUtils.clamp(
                    targetOrbitPhi + deltaY * CAMERA_DRAG_SENSITIVITY,
                    0.13,
                    Math.PI - 0.13
                );
                event.preventDefault();
            }
            if (reducedMotion) renderAfterInteraction();
        };

        const finishOrbitDrag = (event) => {
            if (!isOrbitDragging || (event && event.pointerId !== activePointerId)) return;
            isOrbitDragging = false;
            activePointerId = null;
            hero.classList.remove("is-orbiting", "is-touch-orbiting");
        };

        hero.addEventListener("pointerdown", onPointerDown);
        hero.addEventListener("pointermove", onPointerMove);
        hero.addEventListener("pointerup", finishOrbitDrag);
        hero.addEventListener("pointercancel", finishOrbitDrag);
        hero.addEventListener("lostpointercapture", finishOrbitDrag);

        const onWheel = (event) => {
            // Scroll up (negative deltaY) moves closer; scroll down moves farther.
            // Hold Shift to pass the wheel through to normal page scrolling.
            if (event.shiftKey || event.ctrlKey || event.altKey) return;

            const nextDistance = THREE.MathUtils.clamp(
                targetCameraDistance * Math.exp(event.deltaY * CAMERA_WHEEL_SENSITIVITY),
                CAMERA_MIN_DISTANCE,
                CAMERA_MAX_DISTANCE
            );
            const hitZoomLimit = Math.abs(nextDistance - targetCameraDistance) < 0.001;
            if (hitZoomLimit) return; // At the limit, continue scrolling the page.

            targetCameraDistance = nextDistance;
            event.preventDefault();
            if (reducedMotion) renderAfterInteraction();
        };
        hero.addEventListener("wheel", onWheel, { passive: false });

        const resetCameraButton = document.getElementById("sp3dResetView");
        const zoomInButton = document.getElementById("sp3dZoomIn");
        const zoomOutButton = document.getElementById("sp3dZoomOut");
        const diveInButton = document.getElementById("sp3dDiveIn");

        const setCameraDistance = (distance) => {
            targetCameraDistance = THREE.MathUtils.clamp(
                distance,
                CAMERA_MIN_DISTANCE,
                CAMERA_MAX_DISTANCE
            );
            if (reducedMotion) renderAfterInteraction();
        };

        zoomInButton?.addEventListener("click", () => {
            setCameraDistance(targetCameraDistance * 0.82);
        });
        zoomOutButton?.addEventListener("click", () => {
            setCameraDistance(targetCameraDistance * 1.22);
        });
        diveInButton?.addEventListener("click", () => {
            // A guided close-up stop: close enough to study the accretion disk,
            // while keeping the black-hole silhouette in the camera frame.
            targetOrbitTheta = 0.08;
            targetOrbitPhi = 1.47;
            setCameraDistance(6.8);
        });
        resetCameraButton?.addEventListener("click", () => {
            targetOrbitTheta = 0.16;
            targetOrbitPhi = 1.39;
            setCameraDistance(lowPower ? 25 : 22.5);
        });

        const onScroll = () => {
            const bounds = hero.getBoundingClientRect();
            const progress = THREE.MathUtils.clamp(-bounds.top / Math.max(1, bounds.height * 0.75), 0, 1);
            pageScrollDive = -progress * 2.8;
            hero.style.setProperty("--sp3d-scroll-progress", progress.toFixed(3));
            canvas.style.opacity = (1 - progress * 0.12).toFixed(3);
            canvas.style.transform = `scale(${(1 + progress * 0.035).toFixed(3)})`;
            if (reducedMotion) renderAfterInteraction();
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        const visibilityObserver = new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            if (visible && !reducedMotion && !document.hidden && !frame) animate();
        }, { threshold: 0.01 });
        visibilityObserver.observe(hero);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if (frame) cancelAnimationFrame(frame);
                frame = 0;
            } else if (visible && !reducedMotion && !frame) {
                animate();
            }
        });

        loadSpaceModels().catch((error) => {
            console.error("[KNOWME Builder] 3D model setup failed:", error?.name || "Error");
            if (!spaceRoot.children.length) buildFallbackCore();
            setStatus("heroFallback", "3D MODELS UNAVAILABLE · FALLBACK SCENE", true);
            if (renderer && camera) renderer.render(scene, camera);
            setModelLoaderState("error");
        });

        if (!reducedMotion) animate();
        else renderer.render(scene, camera);

        function animate() {
            if (frame || !renderer || !visible || document.hidden) return;
            const tick = (now) => {
                frame = 0;
                if (!visible || document.hidden) return;

                const delta = lastFrameTime ? Math.min((now - lastFrameTime) / 1000, 0.05) : 0;
                lastFrameTime = now;

                const time = now * 0.001;

                if (spaceRoot) spaceRoot.position.y = Math.sin(time * 0.28) * 0.035;
                if (galaxyPivot) galaxyPivot.rotation.y = time * 0.026;
                if (blackHolePivot) blackHolePivot.rotation.y = -time * 0.009;
                if (blackHoleMixer) blackHoleMixer.update(delta);

                orbitTracks.forEach((track, index) => {
                    // Each ring and planet move together on a slow orbital path.
                    track.orbit.rotation.y = track.tiltY + time * track.speed;
                    track.orbit.rotation.x = track.tiltX + Math.sin(time * 0.10 + track.phase) * 0.012;
                    track.orbit.rotation.z = track.tiltZ + Math.cos(time * 0.085 + track.phase) * 0.01;
                    const pulse = 0.88 + Math.sin(time * 0.42 + track.phase) * 0.12;
                    track.ringMaterial.opacity = track.opacity * pulse;
                    track.planetMaterial.emissiveIntensity = 0.25 + pulse * 0.18;
                    track.auraMaterial.opacity = 0.09 + pulse * 0.07;
                    track.planet.rotation.y = time * (0.34 + index * 0.07) + track.phase;
                    track.planet.rotation.x = Math.sin(time * 0.18 + track.phase) * 0.12;
                    track.satellitePivot.rotation.y = time * (0.58 + index * 0.08) + track.phase;
                });
                if (starField) starField.rotation.y = time * 0.004;

                updateCameraPosition(true);

                renderer.render(scene, camera);
                frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        }
    }

    try {
        initScene();
    } catch (error) {
        console.error("[KNOWME Builder] 3D scene initialization failed:", error?.name || "Error");
        setStatus("heroFallback", "3D PREVIEW NOT AVAILABLE · STATIC FALLBACK", true);
        setModelLoaderState("error");
        hero.classList.add("sp3d-fallback");
    }

    // ---------- Live HTML/CSS website preview ----------
    const preview = document.getElementById("spPreviewScreen");
    const previewUrl = document.getElementById("spPreviewUrl");
    const previewBrand = document.getElementById("spPreviewBrand");
    const previewHeading = document.getElementById("spPreviewHeadingText");
    const previewDescription = document.getElementById("spPreviewDescription");
    const previewEyebrow = document.getElementById("spPreviewEyebrow");
    const previewSectionName = document.getElementById("spPreviewSectionName");
    const previewStyle = document.getElementById("spPreviewStyle");
    const topDomain = document.getElementById("spTopDomain");
    const topType = document.getElementById("spTopType");
    const topStyle = document.getElementById("spTopStyle");
    const topSecurity = document.getElementById("spTopSecurity");
    const topProgress = document.getElementById("spTopProgress");
    const companyInput = form.elements.company;

    const typeContent = {
        business: ["BUSINESS / DIGITAL PRESENCE", "Your business, made unmistakable.", "A professional digital home built to explain your value and convert visitors.", "OUR SERVICES"],
        portfolio: ["PORTFOLIO / SELECTED WORK", "Work that speaks for itself.", "A clear, expressive space for your projects, skills and professional story.", "SELECTED PROJECTS"],
        ecommerce: ["COMMERCE / ONLINE STORE", "Make every product discoverable.", "A considered shopping experience with clear product stories and a direct path to purchase.", "FEATURED PRODUCTS"],
        landing: ["LANDING PAGE / ONE CLEAR GOAL", "One page. One clear action.", "A focused experience designed around your most important message and conversion goal.", "WHY CHOOSE US"],
        webapp: ["WEB APPLICATION / PRODUCT UI", "A system designed around people.", "A functional interface for your users, workflows and data-driven product.", "PRODUCT CAPABILITIES"],
        other: ["CUSTOM / YOUR IDEA", "A digital experience shaped around you.", "Start with the idea. Define the right structure together with KNOWME Studio.", "PROJECT HIGHLIGHTS"]
    };

    function selectedValue(name, fallback = "") {
        const input = form.querySelector(`input[name="${name}"]:checked`);
        return input ? input.value : fallback;
    }

    function selectedLabel(name, fallback) {
        const input = form.querySelector(`input[name="${name}"]:checked`);
        if (!input) return fallback;
        const label = input.closest("label");
        const textNode = label?.querySelector("strong, span[data-i18n]");
        return (textNode?.textContent || label?.textContent || input.value).replace(/\s+/g, " ").trim();
    }

    function updatePreview() {
        if (!preview) return;
        const type = selectedValue("website_type", "business");
        const style = selectedValue("design_style", "modern");
        const layout = selectedValue("layout_style", "balanced");
        const font = selectedValue("font_style", "modern");
        const motion = selectedValue("animation_level", "subtle");
        const primary = form.elements.primary_color?.value || "#ef4444";
        const secondary = form.elements.secondary_color?.value || "#006eff";
        const domain = form.elements.preferred_domain?.value.trim() || "your-domain.com";
        const [eyebrow, heading, description, section] = typeContent[type] || typeContent.other;
        const styleName = selectedLabel("design_style", "Modern");
        const layoutName = selectedLabel("layout_style", "Balanced");
        const selectedSecurity = form.querySelectorAll('input[name="security_requirements"]:checked').length;
        const company = companyInput?.value.trim();

        preview.dataset.style = style;
        preview.dataset.layout = layout;
        preview.dataset.font = font;
        preview.dataset.motion = motion;
        preview.style.setProperty("--sp-preview-primary", primary);
        preview.style.setProperty("--sp-preview-secondary", secondary);
        if (previewUrl) previewUrl.textContent = domain;
        if (topDomain) topDomain.textContent = domain;
        if (topType) topType.textContent = selectedLabel("website_type", "—");
        if (topStyle) topStyle.textContent = styleName || "—";
        if (topSecurity) {
            const securityWord = selectedSecurity
                ? localizedText("securityExtra", "EXTRA")
                : localizedText("securityBaselineShort", "BASELINE");
            topSecurity.textContent = selectedSecurity ? `${selectedSecurity} ${securityWord}` : securityWord;
        }
        if (previewBrand) previewBrand.firstChild.textContent = (company || "YOUR BRAND").slice(0, 22).toUpperCase();
        if (previewHeading) previewHeading.textContent = heading;
        if (previewDescription) previewDescription.textContent = description;
        if (previewEyebrow) previewEyebrow.textContent = eyebrow;
        if (previewSectionName) previewSectionName.textContent = section;
        if (previewStyle) previewStyle.textContent = `${styleName.toUpperCase()} / ${layoutName.toUpperCase()}`;
    }

    function updateProgress() {
        const indicators = Array.from(form.querySelectorAll("[data-step-indicator]"));
        const activeIndex = Math.max(0, indicators.findIndex((indicator) => indicator.classList.contains("is-active")));
        if (topProgress) topProgress.style.width = `${((activeIndex + 1) / Math.max(1, indicators.length)) * 100}%`;
    }

    const stepObserver = new MutationObserver(updateProgress);
    form.querySelectorAll("[data-step-indicator]").forEach((indicator) => {
        stepObserver.observe(indicator, { attributes: true, attributeFilter: ["class"] });
    });

    const deviceButtons = Array.from(document.querySelectorAll("[data-sp-preview-device]"));
    const livePreview = document.querySelector(".sp-live-preview");
    const previewScreen = document.getElementById("spPreviewScreen");
    const setPreviewDeviceMode = (rawDevice) => {
        if (!livePreview) return;
        const device = ["desktop", "tablet", "mobile"].includes(rawDevice) ? rawDevice : "desktop";
        livePreview.dataset.previewDevice = device;
        livePreview.classList.toggle("is-desktop", device === "desktop");
        livePreview.classList.toggle("is-tablet", device === "tablet");
        livePreview.classList.toggle("is-mobile", device === "mobile");
        if (previewScreen) previewScreen.dataset.previewDevice = device;
        deviceButtons.forEach((item) => {
            const active = item.dataset.spPreviewDevice === device;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-pressed", String(active));
        });
    };
    deviceButtons.forEach((button) => {
        button.addEventListener("click", () => setPreviewDeviceMode(button.dataset.spPreviewDevice));
    });
    if (livePreview) setPreviewDeviceMode(livePreview.dataset.previewDevice || "desktop");

    form.addEventListener("input", () => {
        updatePreview();
        updateProgress();
    });
    form.addEventListener("change", () => {
        updatePreview();
        updateProgress();
    });
    document.addEventListener("knowme:languagechange", () => {
        updatePreview();
        if (currentStatus) setStatus(currentStatus.key, currentStatus.fallback, currentStatus.failed);
    });
    updatePreview();
    updateProgress();
})();
