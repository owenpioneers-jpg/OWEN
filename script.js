
const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  nav.classList.toggle("show");
  toggle.classList.toggle("active");
  toggle.textContent = nav.classList.contains("show") ? "✕" : "☰";
});


document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      nav.classList.remove("show");
      toggle.classList.remove("active");
      toggle.textContent = "☰";
    }
  });
});


function initCarousel(carouselSelector, cardSelector, interval = 4000) {
  const carousel = document.querySelector(carouselSelector);
  const track = carousel.querySelector(".carousel-track");
  let cards = carousel.querySelectorAll(cardSelector);

  let index = 1;
  let autoSlide;

  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.prepend(lastClone);
  cards = carousel.querySelectorAll(cardSelector);

  function updateCarousel(animate = true) {
    const cardWidth = cards[0].offsetWidth + 32; 
    track.style.transition = animate ? "0.6s" : "none";
    track.style.transform = `translateX(${-index * cardWidth}px)`;
    cards.forEach(card => card.classList.remove("active"));
    cards[index].classList.add("active");
  }

  function startAuto() { autoSlide = setInterval(() => { index++; updateCarousel(); }, interval); }
  function stopAuto() { clearInterval(autoSlide); }

  track.addEventListener("transitionend", () => {
    if (cards[index].isSameNode(firstClone)) index = 1;
    if (cards[index].isSameNode(lastClone)) index = cards.length - 2;
    updateCarousel(false);
  });

 
  let startX = 0, dragging = false;
  track.addEventListener("mousedown", e => { dragging = true; startX = e.pageX; stopAuto(); });
  track.addEventListener("mouseup", e => { if (dragging) handleSwipe(e.pageX - startX); });
  track.addEventListener("mouseleave", e => { if (dragging) handleSwipe(e.pageX - startX); });
  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; stopAuto(); });
  track.addEventListener("touchend", e => { handleSwipe(e.changedTouches[0].clientX - startX); });

  function handleSwipe(diff) {
    if (diff > 50) index--;
    else if (diff < -50) index++;
    updateCarousel();
    startAuto();
    dragging = false;
  }

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  updateCarousel(false);
  startAuto();
}


initCarousel(".projects-carousel", ".project-card", 4000);
initCarousel(".services-carousel", ".service-card", 4000);


const counters = document.querySelectorAll(".stat-card h3");
let statsRun = false;

function runCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 100);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.textContent = target;
        clearInterval(interval);
      } else counter.textContent = count;
    }, 20);
  });
}


window.addEventListener("scroll", () => {
  const statsSection = document.getElementById("stats");
  if (!statsRun && statsSection.getBoundingClientRect().top < window.innerHeight - 100) {
    runCounters();
    statsRun = true;
    document.querySelectorAll(".stat-card").forEach(card => card.classList.add("active"));
  }
});
function initCarousel(carouselSelector, cardSelector, interval = 4000) {
  const carousel = document.querySelector(carouselSelector);
  const track = carousel.querySelector(".carousel-track");
  const cards = carousel.querySelectorAll(cardSelector);

  let index = 0;
  let autoSlide;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 32; 
    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translateX(${-index * cardWidth}px)`;
  }

  function nextSlide() {
    index++;
    if (index >= cards.length) index = 0; // loop back smoothly
    updateCarousel();
  }

  function startAuto() {
    autoSlide = setInterval(nextSlide, interval);
  }

  function stopAuto() {
    clearInterval(autoSlide);
  }

  
  let startX = 0, dragging = false;

  track.addEventListener("mousedown", e => { dragging = true; startX = e.pageX; stopAuto(); });
  track.addEventListener("mouseup", e => { if(dragging){ handleSwipe(e.pageX-startX); } });
  track.addEventListener("mouseleave", e => { if(dragging){ handleSwipe(e.pageX-startX); } });
  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; stopAuto(); });
  track.addEventListener("touchend", e => { handleSwipe(e.changedTouches[0].clientX - startX); });

  function handleSwipe(diff){
    if(diff > 50) { index = Math.max(0, index - 1); }
    if(diff < -50) { index = Math.min(cards.length - 1, index + 1); }
    updateCarousel();
    startAuto();
    dragging = false;
  }

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  updateCarousel();
  startAuto();
}