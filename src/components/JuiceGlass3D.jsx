import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const glassProfile = [
  [0, 0.64], [0.14, 0.65], [0.21, 0.68], [0.25, 0.74], [0.28, 0.84],
  [0.31, 1.00], [0.35, 1.25], [0.39, 1.55], [0.43, 1.85], [0.47, 2.17],
  [0.50, 2.38], [0.50, 2.43], [0.48, 2.44], [0.47, 2.39], [0.45, 2.17],
  [0.41, 1.86], [0.37, 1.56], [0.33, 1.26], [0.29, 1.01], [0.26, 0.86],
  [0.22, 0.79], [0.13, 0.77], [0, 0.77]
];

const footProfile = [
  [0, 0.08], [0.20, 0.08], [0.29, 0.10], [0.33, 0.14], [0.31, 0.18],
  [0.24, 0.21], [0.12, 0.24], [0.08, 0.29], [0.08, 0.62],
  [0.14, 0.68], [0.22, 0.72], [0.23, 0.76], [0.20, 0.79],
  [0.12, 0.76], [0, 0.75]
];

function makeLathe(profile, segments = 96) {
  const curve = new THREE.SplineCurve(profile.map(([radius, height]) => new THREE.Vector2(radius, height)));
  return new THREE.LatheGeometry(curve.getPoints(96), segments);
}

function makeFlutedBowl() {
  const geometry = makeLathe(glassProfile);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const radius = Math.hypot(x, z);

    if (y < 0.82 || y > 2.42 || radius < 0.12) continue;

    const bowlProgress = Math.min(1, (y - 0.82) / 0.18, (2.42 - y) / 0.1);
    const flute = Math.cos(Math.atan2(z, x) * 24) * 0.009 * Math.max(0, bowlProgress);
    positions.setXYZ(index, x + (x / radius) * flute, y, z + (z / radius) * flute);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function makeJuice(product, hasBerenjena) {
  const color = new THREE.Color(product.color);
  if (hasBerenjena) color.lerp(new THREE.Color('#63371f'), 0.12);
  const sideProfile = [
    [0, 2.32], [0.16, 2.33], [0.32, 2.31], [0.45, 2.27],
    [0.445, 2.16], [0.41, 1.86], [0.37, 1.56], [0.33, 1.26],
    [0.29, 1.01], [0.255, 0.86], [0.18, 0.81], [0, 0.81]
  ];
  const juice = new THREE.Mesh(
    makeLathe(sideProfile, 72),
    new THREE.MeshBasicMaterial({
      color,
      toneMapped: false
    })
  );

  juice.name = 'juice';
  return juice;
}

function addPulp(group, product, hasBerenjena) {
  if (!product.hasFiber && !hasBerenjena) return;

  const count = hasBerenjena ? 16 : 10;
  const pulpColor = hasBerenjena ? '#49301f' : '#fff0b3';
  const material = new THREE.MeshStandardMaterial({
    color: pulpColor,
    roughness: 0.7,
    transparent: !hasBerenjena,
    opacity: hasBerenjena ? 0.9 : 0.58
  });

  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.39996;
    const height = 0.95 + ((index * 37) % 120) / 100;
    const radius = Math.min(0.38, 0.12 + ((index * 17) % 25) / 100);
    const seed = new THREE.Mesh(new THREE.SphereGeometry(hasBerenjena ? 0.012 : 0.009, 8, 6), material);
    seed.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    seed.scale.set(1, hasBerenjena ? 1.5 : 0.9, 0.7);
    group.add(seed);
  }
}

function addGlassHighlights(group) {
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.48
  });

  [
    [[-0.31, 1.02, 0.21], [-0.37, 1.48, 0.18], [-0.42, 1.95, 0.12], [-0.45, 2.32, 0.04]],
    [[0.30, 0.99, 0.22], [0.35, 1.42, 0.18], [0.40, 1.88, 0.12], [0.45, 2.32, 0.04]]
  ].forEach((points) => {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.008, 6, false), highlightMaterial));
  });
}

function createGlassModel(product, hasBerenjena) {
  const model = new THREE.Group();
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.08,
    metalness: 0,
    transmission: 0.12,
    thickness: 0.08,
    ior: 1.1,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const glass = new THREE.Group();

  glass.add(new THREE.Mesh(makeFlutedBowl(), glassMaterial));
  glass.add(new THREE.Mesh(makeLathe(footProfile), glassMaterial));

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.49, 0.018, 12, 96),
    new THREE.MeshPhysicalMaterial({
      color: '#f4fbff',
      roughness: 0.11,
      metalness: 0.1,
      transmission: 0.5,
      thickness: 0.1,
      transparent: true,
      opacity: 0.75
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 2.425;
  glass.add(rim);
  glass.add(makeJuice(product, hasBerenjena));
  addPulp(glass, product, hasBerenjena);
  addGlassHighlights(glass);
  glass.position.y = -1.34;
  model.add(glass);

  return model;
}

function scheduleRender(renderer, scene, camera, frameRef, inertiaRef, model) {
  if (frameRef.current !== null) return;

  const drawFrame = () => {
    frameRef.current = null;

    if (inertiaRef.current.active && model) {
      model.rotation.y += inertiaRef.current.x;
      model.rotation.x = THREE.MathUtils.clamp(model.rotation.x + inertiaRef.current.y, -0.5, 0.5);
      inertiaRef.current.x *= 0.94;
      inertiaRef.current.y *= 0.94;
    }

    renderer.render(scene, camera);

    if (inertiaRef.current.active && Math.abs(inertiaRef.current.x) + Math.abs(inertiaRef.current.y) > 0.0003) {
      frameRef.current = window.requestAnimationFrame(drawFrame);
    } else {
      inertiaRef.current.active = false;
    }
  };

  frameRef.current = window.requestAnimationFrame(drawFrame);
}

export default function JuiceGlass3D({ product, hasBerenjena }) {
  const hostRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const frameRef = useRef(null);
  const dragRef = useRef({ pointerId: null, x: 0, y: 0 });
  const pointersRef = useRef(new Map());
  const pinchRef = useRef(null);
  const inertiaRef = useRef({ x: 0, y: 0, active: false });
  const [rendererFailed, setRendererFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0.05, 4.8);
    camera.lookAt(0, -0.08, 0);
    sceneRef.current = scene;
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (error) {
      console.error('No se pudo iniciar la vista 3D del vaso.', error);
      setRendererFailed(true);
      sceneRef.current = null;
      cameraRef.current = null;
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0xffffff, 0);
    renderer.domElement.className = 'juice-glass-3d-canvas';
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', `Vaso 3D de ${product.title}. Desliza para girarlo y pellizca para acercar.`);
    renderer.domElement.tabIndex = 0;
    host.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    setRendererFailed(false);

    scene.add(new THREE.HemisphereLight(0xf4f9ff, 0x8b7660, 2.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(-3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc4e4ff, 1.1);
    fillLight.position.set(3, 2.5, -3);
    scene.add(fillLight);

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      scheduleRender(renderer, scene, camera, frameRef, inertiaRef, modelRef.current);
    });
    resizeObserver.observe(host);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      inertiaRef.current.active = false;
      pointersRef.current.clear();
      pinchRef.current = null;
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      modelRef.current = null;
    };
  }, [product.title]);

  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!scene || !renderer || !camera) return undefined;

    const model = createGlassModel(product, hasBerenjena);
    model.rotation.set(rotationRef.current.x, rotationRef.current.y, rotationRef.current.z);
    modelRef.current = model;
    scene.add(model);
    scheduleRender(renderer, scene, camera, frameRef, inertiaRef, model);

    return () => {
      rotationRef.current = { x: model.rotation.x, y: model.rotation.y, z: model.rotation.z };
      scene.remove(model);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      inertiaRef.current.active = false;
      model.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      });
      modelRef.current = null;
    };
  }, [product, hasBerenjena]);

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    inertiaRef.current = { x: 0, y: 0, active: false };

    if (pointersRef.current.size === 1) {
      dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      event.currentTarget.classList.add('is-dragging');
    } else if (pointersRef.current.size === 2) {
      dragRef.current.pointerId = null;
      event.currentTarget.classList.remove('is-dragging');
      const [first, second] = Array.from(pointersRef.current.values());
      pinchRef.current = {
        distance: Math.max(1, Math.hypot(second.x - first.x, second.y - first.y)),
        zoom: cameraRef.current.zoom
      };
    }
  };

  const handlePointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pinchRef.current) {
      const [first, second] = Array.from(pointersRef.current.values());
      const camera = cameraRef.current;
      if (!camera || !first || !second) return;
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      camera.zoom = THREE.MathUtils.clamp(
        pinchRef.current.zoom * distance / pinchRef.current.distance,
        1,
        2.2
      );
      camera.updateProjectionMatrix();
      scheduleRender(
        rendererRef.current,
        sceneRef.current,
        camera,
        frameRef,
        inertiaRef,
        modelRef.current
      );
      return;
    }

    if (dragRef.current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;
    const model = modelRef.current;

    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    if (!model) return;

    model.rotation.y += deltaX * 0.012;
    model.rotation.x = THREE.MathUtils.clamp(model.rotation.x + deltaY * 0.008, -0.5, 0.5);
    inertiaRef.current.x = deltaX * 0.0018;
    inertiaRef.current.y = deltaY * 0.0012;
    scheduleRender(rendererRef.current, sceneRef.current, cameraRef.current, frameRef, inertiaRef, model);
  };

  const handlePointerUp = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.delete(event.pointerId);

    if (pinchRef.current) {
      pinchRef.current = null;
      const camera = cameraRef.current;
      if (camera) {
        camera.zoom = 1;
        camera.updateProjectionMatrix();
      }
      inertiaRef.current.active = false;
      const remaining = Array.from(pointersRef.current.entries())[0];
      if (remaining) {
        dragRef.current = { pointerId: remaining[0], ...remaining[1] };
        event.currentTarget.classList.add('is-dragging');
      } else {
        dragRef.current.pointerId = null;
        event.currentTarget.classList.remove('is-dragging');
      }
      if (rendererRef.current && camera) {
        scheduleRender(
          rendererRef.current,
          sceneRef.current,
          camera,
          frameRef,
          inertiaRef,
          modelRef.current
        );
      }
      return;
    }

    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = null;
    event.currentTarget.classList.remove('is-dragging');
    inertiaRef.current.active = true;
    if (rendererRef.current) {
      scheduleRender(
        rendererRef.current,
        sceneRef.current,
        cameraRef.current,
        frameRef,
        inertiaRef,
        modelRef.current
      );
    }
  };

  const handleKeyDown = (event) => {
    const model = modelRef.current;
    if (!model) return;

    if (event.key === 'ArrowLeft') model.rotation.y -= 0.12;
    else if (event.key === 'ArrowRight') model.rotation.y += 0.12;
    else if (event.key === 'ArrowUp') model.rotation.x = THREE.MathUtils.clamp(model.rotation.x - 0.08, -0.5, 0.5);
    else if (event.key === 'ArrowDown') model.rotation.x = THREE.MathUtils.clamp(model.rotation.x + 0.08, -0.5, 0.5);
    else return;

    event.preventDefault();
    if (rendererRef.current) {
      scheduleRender(
        rendererRef.current,
        sceneRef.current,
        cameraRef.current,
        frameRef,
        inertiaRef,
        model
      );
    }
  };

  return (
    <div
      ref={hostRef}
      className={`juice-glass-3d ${rendererFailed ? 'is-fallback' : ''}`}
      onPointerDown={rendererFailed ? undefined : handlePointerDown}
      onPointerMove={rendererFailed ? undefined : handlePointerMove}
      onPointerUp={rendererFailed ? undefined : handlePointerUp}
      onPointerCancel={rendererFailed ? undefined : handlePointerUp}
      onLostPointerCapture={rendererFailed ? undefined : handlePointerUp}
      onKeyDown={rendererFailed ? undefined : handleKeyDown}
      aria-label={rendererFailed ? undefined : `Modelo 3D interactivo de ${product.title}`}
    >
      {rendererFailed && <img src={product.image} alt={`Vaso de ${product.title}`} />}
    </div>
  );
}
