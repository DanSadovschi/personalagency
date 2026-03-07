/* ═══════════════════════════════════════════════════════════
   Hero Sphere — Interactive Three.js particle sphere
   Reacts to mouse/touch movement
   ═══════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('hero-sphere');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ── Build particle sphere ─────────────────────────── */
  const count = 2400;
  const positions = new Float32Array(count * 3);
  const radius = 1.6;

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
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  /* ── Add wireframe sphere for structure ─────────────── */
  const wireGeo = new THREE.IcosahedronGeometry(1.58, 3);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x4F8EF7,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireMesh);

  /* ── Mouse tracking ────────────────────────────────── */
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  function onPointerMove(e) {
    const x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  /* ── Resize ────────────────────────────────────────── */
  function resize() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
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
  function animate() {
    raf = requestAnimationFrame(animate);

    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;

    points.rotation.y += 0.002;
    points.rotation.x += 0.001;
    wireMesh.rotation.y += 0.002;
    wireMesh.rotation.x += 0.001;

    // Mouse influence
    points.rotation.y += target.x * 0.008;
    points.rotation.x += target.y * 0.008;
    wireMesh.rotation.y += target.x * 0.008;
    wireMesh.rotation.x += target.y * 0.008;

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
