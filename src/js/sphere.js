/* ═══════════════════════════════════════════════════════════
   Hero Sphere — Interactive Three.js particle sphere
   Positioned as a centered background behind hero text
   ═══════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('hero-sphere');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ── Container for the whole sphere ──────────────────── */
  const group = new THREE.Group();
  scene.add(group);

  /* ── Build particle sphere ─────────────────────────── */
  const count = 3200;
  const positions = new Float32Array(count * 3);
  const radius = 1.8;

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4F8EF7,
    size: 0.016,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
  });

  const points = new THREE.Points(geometry, material);
  group.add(points);

  /* ── Add wireframe sphere (smooth, high subdivision) ── */
  const wireGeo = new THREE.SphereGeometry(1.78, 48, 48);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x4F8EF7,
    wireframe: true,
    transparent: true,
    opacity: 0.035,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  group.add(wireMesh);

  /* ── Mouse tracking ────────────────────────────────── */
  const mouse = { x: 0, y: 0 };

  function onPointerMove(e) {
    const x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  /* ── Resize — fill the hero section ─────────────────── */
  function resize() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener('resize', resize);

  /* ── Animate ───────────────────────────────────────── */
  let raf;
  const baseSpeed = 0.0005;
  const targetRotation = { x: 0, y: 0 };

  function animate() {
    raf = requestAnimationFrame(animate);

    // Slow constant rotation
    group.rotation.y += baseSpeed;
    group.rotation.x += baseSpeed * 0.3;

    // Mouse influence — lerp toward target tilt (not additive)
    targetRotation.x += (mouse.y * 0.3 - targetRotation.x) * 0.02;
    targetRotation.y += (mouse.x * 0.3 - targetRotation.y) * 0.02;

    group.rotation.x += targetRotation.x * 0.01;
    group.rotation.y += targetRotation.y * 0.01;

    renderer.render(scene, camera);
  }

  animate();

  /* ── Cleanup on page leave ─────────────────────────── */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      animate();
    }
  });
})();
