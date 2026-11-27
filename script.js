// Archana & Mohit Royal Wedding Invitation Experience
(function () {
  const WEDDING_DATE = new Date("2026-12-11T19:00:00+05:30").getTime();

  const curtain = document.getElementById("invite-curtain");
  const openBtn = document.getElementById("open-invite-btn");
  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  const toastEl = document.getElementById("toast");

  let isPlaying = false;
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 3000);
  }

  function updateMusicUI(playing) {
    isPlaying = playing;
    musicToggle.classList.toggle("is-playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.querySelector(".music-pill__text").textContent = playing ? "संगीत चालू" : "संगीत";
  }

  function tryPlayMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.65;
    const p = bgMusic.play();
    if (p && typeof p.then === "function") {
      p.then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
    }
  }

  if (openBtn && curtain) {
    openBtn.addEventListener("click", () => {
      curtain.classList.add("is-open");
      tryPlayMusic();
      burstPetals(30);
    });
  }

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", () => {
      if (isPlaying) {
        bgMusic.pause();
        updateMusicUI(false);
      } else {
        tryPlayMusic();
      }
    });
  }

  // Live Wedding Countdown
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function tickCountdown() {
    const diff = WEDDING_DATE - Date.now();
    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      return;
    }
    elDays.textContent = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    elHours.textContent = pad(Math.floor((diff / (1000 * 60 * 60)) % 24));
    elMins.textContent = pad(Math.floor((diff / (1000 * 60)) % 60));
    elSecs.textContent = pad(Math.floor((diff / 1000) % 60));
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);

  // Save the Date (.ics download)
  const saveCalBtn = document.getElementById("save-calendar-btn");
  if (saveCalBtn) {
    saveCalBtn.addEventListener("click", () => {
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Barman Family//Wedding Invitation//HI",
        "BEGIN:VEVENT",
        "UID:archana-mohit-20261211@barmanfamily",
        "DTSTAMP:20261127T060000Z",
        "DTSTART:20261211T133000Z",
        "DTEND:20261211T183000Z",
        "SUMMARY:शुभ विवाह: अर्चना (ज्योति) संग मोहित",
        "DESCRIPTION:बर्मन परिवार का स्नेहिल आमंत्रण — बारात स्वागत, आशीर्वाद समारोह एवं प्रीतिभोज। सायं 7 बजे से। संपर्क: 8319887047, 8839596045",
        "LOCATION:नेमा गार्डन, नित्य गोपाल मंदिर के आगे, शहपुरा रोड, पाटन, जिला-जबलपुर (म.प्र.)",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Archana_Mohit_Shubh_Vivah.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("कैलेंडर रिमाइंडर डाउनलोड हो गया!");
    });
  }

  // Copy Venue Address
  const copyVenueBtn = document.getElementById("copy-venue-btn");
  if (copyVenueBtn) {
    copyVenueBtn.addEventListener("click", async () => {
      const addr = "नेमा गार्डन, नित्य गोपाल मंदिर के आगे, शहपुरा रोड, पाटन, जिला-जबलपुर (म.प्र.)";
      try {
        await navigator.clipboard.writeText(addr);
        showToast("कार्यस्थल का पता कॉपी हो गया!");
      } catch {
        showToast(addr);
      }
    });
  }

  // Interactive Family Tabs
  const tabBtns = document.querySelectorAll(".family-tab");
  const panels = document.querySelectorAll(".family-panel");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      tabBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      panels.forEach((p) => {
        p.classList.toggle("is-active", p.id === `panel-${target}`);
      });
    });
  });

  // Scroll Reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Blush Rose Petals & Champagne Gold Sparkles Canvas
  const canvas = document.getElementById("petals-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const particles = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle(fromTop) {
    const isGold = Math.random() < 0.35;
    return {
      x: Math.random() * (canvas ? canvas.width : 1000),
      y: fromTop ? -20 - Math.random() * 120 : Math.random() * (canvas ? canvas.height : 800),
      size: isGold ? 2 + Math.random() * 2.5 : 5 + Math.random() * 6,
      vy: 0.5 + Math.random() * 0.85,
      vx: (Math.random() - 0.5) * 0.55,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.03,
      alpha: isGold ? 0.45 + Math.random() * 0.35 : 0.36 + Math.random() * 0.32,
      isGold,
      color: isGold ? "#ebd294" : Math.random() < 0.5 ? "#eab0be" : "#d7bfe6",
    };
  }

  function burstPetals(count) {
    if (!canvas || reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const p = createParticle(true);
      p.y = Math.random() * canvas.height * 0.35;
      p.vy += 0.9;
      particles.push(p);
    }
    if (particles.length > 56) {
      particles.splice(0, particles.length - 56);
    }
  }

  if (canvas && ctx && !reducedMotion) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    for (let i = 0; i < 20; i++) {
      particles.push(createParticle(false));
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.y * 0.015) * 0.35;
        p.rot += p.vrot;

        if (p.y > canvas.height + 24) {
          particles[i] = createParticle(true);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.isGold) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.58, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
})();
