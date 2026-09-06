gsap.registerPlugin(ScrollTrigger);

const initLenis = () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
};

const initLoading = () => {
  const progress = document.querySelector(".loader-progress");
  const percentage = document.querySelector(".loader-percentage");
  const loader = document.querySelector(".loader");

  let loadProgress = 0;

  const interval = setInterval(() => {
    loadProgress += Math.random() * 15;
    if (loadProgress > 100) loadProgress = 100;

    progress.style.width = `${loadProgress}%`;
    percentage.textContent = `${Math.floor(loadProgress)}%`;

    if (loadProgress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            loader.style.display = "none";
            document.body.classList.remove("loading");
            initHeroAnimations();
          },
        });
      }, 500);
    }
  }, 150);
};

const initCustomCursor = () => {
  const cursor = document.querySelector(".custom-cursor");
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const text = document.querySelector(".cursor-text");

  if (window.innerWidth <= 1024 || !cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const render = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    text.style.transform = `translate(${ringX}px, ${ringY}px)`;

    requestAnimationFrame(render);
  };
  render();

  const hoverElements = document.querySelectorAll('[data-cursor="hover"]');
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  const projectElements = document.querySelectorAll('[data-cursor="project"]');
  projectElements.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursor.classList.add("project-hover"),
    );
    el.addEventListener("mouseleave", () =>
      cursor.classList.remove("project-hover"),
    );
  });
};

const initWheelAnimation = () => {
  const outer = document.getElementById("wheel-outer");
  const symbols = document.getElementById("wheel-symbols");
  const inner = document.getElementById("wheel-inner");

  gsap.to(outer, {
    rotation: 360,
    transformOrigin: "center center",
    duration: 60,
    repeat: -1,
    ease: "none",
  });

  const symbolsTl = gsap.timeline({ repeat: -1 });
  symbolsTl
    .to(symbols, { rotation: -180, duration: 20, ease: "power1.inOut" })
    .to(symbols, { rotation: -170, duration: 2, ease: "bounce.out" })
    .to(symbols, { rotation: -360, duration: 25, ease: "power2.inOut" });

  const innerTl = gsap.timeline({ repeat: -1 });
  innerTl
    .to(inner, { rotation: 360, duration: 15, ease: "power3.inOut" })
    .to(inner, { rotation: 350, duration: 1, ease: "power1.inOut" })
    .to(inner, { rotation: 720, duration: 20, ease: "none" });

  const light = document.querySelector(".hero-ambient-light");
  gsap.to(light, {
    opacity: 0.3,
    scale: 1.2,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

const initGlitchEffect = () => {
  const glitches = document.querySelectorAll(".portrait-glitch");
  if (!glitches.length) return;

  const doGlitch = () => {
    const activeGlitch = glitches[Math.floor(Math.random() * glitches.length)];
    const type = Math.random();

    if (type < 0.5) {
      gsap.set(activeGlitch, {
        opacity: 0.7,
        x: Math.random() * 20 - 10,
        filter: `hue-rotate(${Math.random() * 90}deg) contrast(1.5)`,
        clipPath: `polygon(0 ${Math.random() * 40 + 40}%, 100% ${Math.random() * 40 + 40}%, 100% ${Math.random() * 20 + 80}%, 0 ${Math.random() * 20 + 80}%)`,
      });
    } else {
      gsap.set(activeGlitch, {
        opacity: 0.5,
        x: Math.random() * -15,
        filter: `hue-rotate(-${Math.random() * 90}deg)`,
        clipPath: `polygon(0 ${Math.random() * 50 + 30}%, 100% ${Math.random() * 50 + 30}%, 100% ${Math.random() * 10 + 90}%, 0 ${Math.random() * 10 + 90}%)`,
      });
    }

    setTimeout(
      () => {
        gsap.set(activeGlitch, { opacity: 0, x: 0 });
        setTimeout(doGlitch, Math.random() * 3000 + 500);
      },
      Math.random() * 150 + 50,
    );
  };

  setTimeout(doGlitch, 1500);
};

const initMouseParallax = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth <= 768) return;

  const hero = document.querySelector(".hero");
  const wheel = document.querySelector(".wheel-container");
  const portrait = document.querySelector(".portrait-wrapper");
  const bgText = document.querySelector(".hero-bg-text");

  hero.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    gsap.to(wheel, { x: x * 30, y: y * 30, duration: 1, ease: "power2.out" });
    gsap.to(portrait, {
      x: x * -10,
      y: y * -10,
      duration: 1,
      ease: "power2.out",
    });
    gsap.to(bgText, { x: x * 15, y: y * 15, duration: 1, ease: "power2.out" });
  });
};

const initParticles = () => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const count = window.innerWidth < 768 ? 30 : 80;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: Math.random() * 0.3 - 0.5,
      color:
        Math.random() > 0.8
          ? "rgba(157, 78, 221, 0.5)"
          : "rgba(255, 255, 255, 0.2)",
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) p.y = canvas.height;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
};

const initScanline = () => {
  const scanline = document.querySelector(".scanline");
  gsap.to(scanline, {
    y: window.innerHeight,
    duration: 8,
    repeat: -1,
    ease: "none",
  });
};

const initNavbarScroll = () => {
  const nav = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
};

const initHeroAnimations = () => {
  const tl = gsap.timeline();

  tl.fromTo(
    ".hero-title-main",
    { opacity: 0, scale: 0.9, y: 50 },
    { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power3.out" },
  )
    .fromTo(
      ".wheel-container",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
      "-=1",
    )
    .fromTo(
      ".portrait-wrapper",
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
      "-=1.5",
    )
    .fromTo(
      [
        ".hero-quote",
        ".cta-button",
        ".signature",
        ".hero-desc",
        ".hero-coords",
        ".vertical-text",
      ],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" },
      "-=1",
    );
};

const initScrollTriggers = () => {
  gsap.to(".hero-title-main", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
    y: 150,
    opacity: 0,
  });

  gsap.to(".portrait-wrapper", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
    scale: 1.08,
    y: 50,
  });

  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: "power2.out",
    });
  });

  const processItems = document.querySelectorAll(".process-item");
  processItems.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
      },
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  });

  gsap.from(".footer-title-script", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
};

const initThreeJSCubes = () => {
  const canvas = document.getElementById("cube-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0, 22);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xd8b4ff, 1.8);
  fillLight.position.set(-15, 0, -10);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0x9d4edd, 2.0);
  backLight.position.set(0, -15, 10);
  scene.add(backLight);

  const texCanvas = document.createElement("canvas");
  texCanvas.width = 512;
  texCanvas.height = 512;
  const ctx = texCanvas.getContext("2d");

  ctx.fillStyle = "#080708";
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "#9D4EDD";
  ctx.fillRect(18, 18, 476, 476);

  const texture = new THREE.CanvasTexture(texCanvas);
  const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    color: 0xccaaff,
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const cubes = [];
  const sizesX = [0.8, 2.8, 0.6];
  const sizesY = [2.2, 0.5, 1.4];
  const sizesZ = [0.5, 1.9, 0.8];
  const gap = 0.12;

  const totalX = sizesX[0] + sizesX[1] + sizesX[2] + gap * 2;
  const totalY = sizesY[0] + sizesY[1] + sizesY[2] + gap * 2;
  const totalZ = sizesZ[0] + sizesZ[1] + sizesZ[2] + gap * 2;

  const group = new THREE.Group();
  scene.add(group);

  let currentX = -totalX / 2;

  for (let i = 0; i < 3; i++) {
    const w = sizesX[i];
    const cx = currentX + w / 2;
    let currentY = -totalY / 2;

    for (let j = 0; j < 3; j++) {
      const h = sizesY[j];
      const cy = currentY + h / 2;
      let currentZ = -totalZ / 2;

      for (let k = 0; k < 3; k++) {
        const d = sizesZ[k];
        const cz = currentZ + d / 2;

        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, material);

        const targetPos = new THREE.Vector3(cx, cy, cz);
        const startPos = new THREE.Vector3(
          cx + (Math.random() - 0.5) * 55,
          cy + (Math.random() - 0.5) * 55,
          cz + (Math.random() - 0.5) * 45 + 20,
        );

        const targetRot = new THREE.Euler(0, 0, 0);
        const startRot = new THREE.Euler(
          Math.random() * Math.PI * 8,
          Math.random() * Math.PI * 8,
          Math.random() * Math.PI * 8,
        );

        mesh.position.copy(startPos);
        mesh.rotation.copy(startRot);

        group.add(mesh);
        cubes.push({
          mesh,
          startPos,
          targetPos,
          startRot,
          targetRot,
          glitchOffset: new THREE.Vector3(0, 0, 0),
          glitchScale: new THREE.Vector3(1, 1, 1),
        });

        currentZ += d + gap;
      }
      currentY += h + gap;
    }
    currentX += w + gap;
  }

  group.rotation.x = 0.5;
  group.rotation.y = -0.5;

  let currentScrollProgress = 0;

  setInterval(() => {
    if (Math.random() > 0.4) {
      const c = cubes[Math.floor(Math.random() * cubes.length)];
      c.glitchOffset.set(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
      );
      c.glitchScale.set(
        1 + (Math.random() - 0.5) * 0.8,
        1 + (Math.random() - 0.5) * 0.8,
        1 + (Math.random() - 0.5) * 0.8,
      );

      setTimeout(
        () => {
          c.glitchOffset.set(0, 0, 0);
          c.glitchScale.set(1, 1, 1);
        },
        Math.random() * 120 + 30,
      );
    }
  }, 80);

  const render = () => {
    const easeProgress = gsap.parseEase("power3.inOut")(currentScrollProgress);

    cubes.forEach((cube) => {
      cube.mesh.position.lerpVectors(
        cube.startPos,
        cube.targetPos,
        easeProgress,
      );
      cube.mesh.position.add(cube.glitchOffset);
      cube.mesh.scale.copy(cube.glitchScale);

      cube.mesh.rotation.x = gsap.utils.interpolate(
        cube.startRot.x,
        cube.targetRot.x,
        easeProgress,
      );
      cube.mesh.rotation.y = gsap.utils.interpolate(
        cube.startRot.y,
        cube.targetRot.y,
        easeProgress,
      );
      cube.mesh.rotation.z = gsap.utils.interpolate(
        cube.startRot.z,
        cube.targetRot.z,
        easeProgress,
      );
    });

    group.rotation.y = -0.5 + easeProgress * Math.PI * 2.5;
    group.rotation.x = 0.5 + easeProgress * 0.6;

    renderer.render(scene, camera);
  };

  gsap.ticker.add(render);

  ScrollTrigger.create({
    trigger: ".projects",
    start: "top 80%",
    endTrigger: ".footer",
    end: "bottom bottom",
    scrub: 1.5,
    onEnter: () =>
      gsap.to(canvas, { opacity: 1, duration: 0.8, ease: "power2.out" }),
    onLeave: () =>
      gsap.to(canvas, { opacity: 0, duration: 0.8, ease: "power2.out" }),
    onEnterBack: () =>
      gsap.to(canvas, { opacity: 1, duration: 0.8, ease: "power2.out" }),
    onLeaveBack: () =>
      gsap.to(canvas, { opacity: 0, duration: 0.8, ease: "power2.out" }),
    onUpdate: (self) => {
      currentScrollProgress = self.progress;
    },
  });

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 1.5;
    const y = (e.clientY / window.innerHeight - 0.5) * 1.5;
    gsap.to(group.position, { x: x, y: -y, duration: 2.5, ease: "power3.out" });
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    initLenis();
  }
  initLoading();
  initCustomCursor();
  initWheelAnimation();
  initGlitchEffect();
  initMouseParallax();
  initParticles();
  initScanline();
  initNavbarScroll();
  initScrollTriggers();
  initThreeJSCubes();
});
