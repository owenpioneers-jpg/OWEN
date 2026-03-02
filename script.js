
const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  nav.classList.toggle("show");
  toggle.textContent = nav.classList.contains("show") ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      nav.classList.remove("show");
      toggle.textContent = "☰";
    }
  });
});



function initInfiniteCarousel(carouselSelector, cardSelector, interval = 3500) {
  const carousel = document.querySelector(carouselSelector);
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const originalCards = Array.from(carousel.querySelectorAll(cardSelector));
  if (originalCards.length === 0) return;

  // Clone all cards: append clones at end, prepend clones at start
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add("clone");
    track.appendChild(clone);
  });
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add("clone");
    track.prepend(clone);
  });

  const allCards = Array.from(track.querySelectorAll(cardSelector));
  const total = allCards.length;
  const cloneCount = originalCards.length;

  // Start at first real card (after the prepended clones)
  let currentIndex = cloneCount;
  let autoSlide;
  let isTransitioning = false;

  function getCardWidth() {
    return allCards[0].offsetWidth + parseInt(getComputedStyle(allCards[0]).marginLeft) * 2;
  }

  function goTo(index, animate = true) {
    track.style.transition = animate ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none";
    track.style.transform = `translateX(${-index * getCardWidth()}px)`;
    allCards.forEach(c => c.classList.remove("active"));
    allCards[index].classList.add("active");
  }

  // After transition ends, silently jump if on a clone
  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    if (currentIndex >= total - cloneCount) {
      currentIndex = cloneCount;
      goTo(currentIndex, false);
    } else if (currentIndex < cloneCount) {
      currentIndex = total - cloneCount * 2;
      goTo(currentIndex, false);
    }
  });

  function next() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    goTo(currentIndex);
  }

  function prev() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    goTo(currentIndex);
  }

  function startAuto() {
    autoSlide = setInterval(next, interval);
  }

  function stopAuto() {
    clearInterval(autoSlide);
  }

  // Touch / drag support
  let startX = 0, isDragging = false;

  track.addEventListener("mousedown", e => { isDragging = true; startX = e.pageX; stopAuto(); });
  track.addEventListener("mouseup", e => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    if (diff > 50) prev();
    else if (diff < -50) next();
    isDragging = false;
    startAuto();
  });
  track.addEventListener("mouseleave", () => { isDragging = false; });

  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) prev();
    else if (diff < -50) next();
    startAuto();
  });

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  // Init
  goTo(currentIndex, false);
  startAuto();
}

initInfiniteCarousel(".projects-carousel", ".project-card", 3500);
initInfiniteCarousel(".services-carousel", ".service-card", 3500);



const counters = document.querySelectorAll(".stat-card h3");
let statsRun = false;

function runCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.textContent = target + "+";
        clearInterval(interval);
      } else {
        counter.textContent = count;
      }
    }, 20);
  });
}

window.addEventListener("scroll", () => {
  const statsSection = document.getElementById("stats");
  if (!statsRun && statsSection && statsSection.getBoundingClientRect().top < window.innerHeight - 100) {
    runCounters();
    statsRun = true;
    document.querySelectorAll(".stat-card").forEach(card => card.classList.add("active"));
  }
});
