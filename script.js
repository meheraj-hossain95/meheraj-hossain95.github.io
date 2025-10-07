// Loading Animation
const loading = document.createElement("div");
loading.className = "loading";
loading.innerHTML = '<div class="loading-spinner"></div>';
document.body.appendChild(loading);

// Scroll Handling
let isScrolling = false;
let currentSection = 0;
const sections = document.querySelectorAll("section");
const totalSections = sections.length;

// Function to update active nav link
function updateActiveNavLink(sectionIndex) {
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link, index) => {
    if (index === sectionIndex) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Function to scroll to a specific section
function scrollToSection(index) {
  if (index >= 0 && index < totalSections) {
    isScrolling = true;
    sections[index].scrollIntoView({
      behavior: "smooth"
    });
    currentSection = index;

    // Update active nav link
    updateActiveNavLink(index);

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }
}

// Handle wheel events
window.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();

    if (isScrolling) return;

    if (e.deltaY > 0) {
      // Scrolling down
      scrollToSection(currentSection + 1);
    } else {
      // Scrolling up
      scrollToSection(currentSection - 1);
    }
  }, {
    passive: false
  }
);

// Handle keyboard navigation
window.addEventListener("keydown", function (e) {
  if (isScrolling) return;

  if (e.key === "ArrowDown" || e.key === "PageDown") {
    e.preventDefault();
    scrollToSection(currentSection + 1);
  } else if (e.key === "ArrowUp" || e.key === "PageUp") {
    e.preventDefault();
    scrollToSection(currentSection - 1);
  }
});

// Handle touch events for mobile
let touchStartY = 0;
window.addEventListener(
  "touchstart",
  function (e) {
    touchStartY = e.touches[0].clientY;
  }, {
    passive: true
  }
);

window.addEventListener(
  "touchend",
  function (e) {
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        // Swipe up
        scrollToSection(currentSection + 1);
      } else {
        // Swipe down
        scrollToSection(currentSection - 1);
      }
    }
  }, {
    passive: true
  }
);

// Update current section on scroll
window.addEventListener("scroll", function () {
  if (isScrolling) return;

  const scrollPosition = window.scrollY;
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop - sectionHeight / 3 &&
      scrollPosition < sectionTop + sectionHeight / 3
    ) {
      currentSection = index;
      updateActiveNavLink(index);
    }
  });
});

// Remove loading screen when page is loaded
window.addEventListener("load", () => {
  loading.classList.add("hidden");
  setTimeout(() => {
    loading.remove();
  }, 500);
});

// Mobile Menu Toggle with Animation
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuBtn.classList.toggle("active");
});

// Smooth Scrolling with Offset
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
        menuBtn.classList.remove("active");
      }
    }
  });
});

// Enhanced Navbar Background Change
const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    navbar.classList.remove("scroll-up");
    return;
  }

  // Always keep navbar visible
  navbar.classList.remove("scroll-down");
  navbar.classList.add("scroll-up");
  lastScroll = currentScroll;
});

// Parallax Effect for Hero Section
const hero = document.querySelector(".hero");
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Enhanced Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      if (entry.target.classList.contains("skill-item")) {
        entry.target.style.transitionDelay = `${entry.target.dataset.delay}s`;
      }
    }
  });
}, observerOptions);

// Observe all sections and skill items
document
  .querySelectorAll("section, .skill-item")
  .forEach((element, index) => {
    if (element.classList.contains("skill-item")) {
      element.dataset.delay = (index * 0.1).toFixed(1);
    }
    observer.observe(element);
  });

// Enhanced Typing Animation
const heroTitle = document.querySelector(".hero-content h1");
const typingText = "Hello, I'm Meheraj Hossain";
heroTitle.innerHTML =
  '<span class="typing-text"></span><span class="typing-cursor"></span>';

const typingElement = heroTitle.querySelector(".typing-text");
const cursorElement = heroTitle.querySelector(".typing-cursor");

let charIndex = 0;
let isDeleting = false;
let typeSpeed = 150;

function typeWriter() {
  const currentText = typingText.substring(0, charIndex);
  typingElement.textContent = currentText;

  if (!isDeleting && charIndex < typingText.length) {
    charIndex++;
    typeSpeed = 150; // Typing speed
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    typeSpeed = 100; // Deleting speed (faster)
  } else {
    // Change direction
    isDeleting = !isDeleting;
    typeSpeed = isDeleting ? 2000 : 1000; // Pause at ends
  }

  setTimeout(typeWriter, typeSpeed);
}

// Start typing animation when page loads
window.addEventListener("load", () => {
  setTimeout(typeWriter, 1000);
});

// Cursor Animation
const cursor = document.createElement("div");
cursor.className = "cursor";
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Add hover effect to interactive elements
document
  .querySelectorAll("a, button, .project-card, .skill-item")
  .forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });

// Theme Toggle Functionality
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle.querySelector("i");

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeIcon.className = savedTheme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

// Theme toggle click handler
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Update theme
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update icon with animation
  themeIcon.className = newTheme === "dark" ? "fas fa-moon" : "fas fa-sun";
});

// Add click handlers for nav links
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const sectionIndex = Array.from(sections).indexOf(targetSection);
      if (sectionIndex !== -1) {
        scrollToSection(sectionIndex);
      }
    }
    
    // Close mobile menu if open
    if (window.innerWidth <= 768) {
      navLinks.classList.remove("active");
      menuBtn.classList.remove("active");
    }
  });
});

// Project Slider Functionality
const projectsWrapper = document.querySelector('.projects-wrapper');
const projectCards = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlide = 0;
let cardsToShow = 3; // Default: Show 3 projects at a time
let isAnimating = false; // Prevent multiple clicks during animation

function getCardsToShow() {
  const width = window.innerWidth;
  if (width <= 768) return 1; // Mobile: 1 card
  if (width <= 1024) return 2; // Tablet: 2 cards
  return 3; // Desktop: 3 cards
}

function updateSlider() {
  if (projectCards.length === 0) return;
  
  cardsToShow = getCardsToShow();
  const totalCards = projectCards.length;
  const maxSlide = Math.max(0, totalCards - cardsToShow);
  
  // Clamp currentSlide to valid range
  currentSlide = Math.max(0, Math.min(currentSlide, maxSlide));
  
  // Calculate the exact width including margins
  const cardStyle = window.getComputedStyle(projectCards[0]);
  const cardWidth = projectCards[0].offsetWidth;
  const marginLeft = parseFloat(cardStyle.marginLeft);
  const marginRight = parseFloat(cardStyle.marginRight);
  const totalCardWidth = cardWidth + marginLeft + marginRight;
  
  // Apply smooth transform
  projectsWrapper.style.transform = `translateX(-${currentSlide * totalCardWidth}px)`;
  
  // Update button states
  updateButtonStates(maxSlide);
}

function updateButtonStates(maxSlide) {
  const isAtStart = currentSlide === 0;
  const isAtEnd = currentSlide >= maxSlide;
  
  // Update Previous button
  prevBtn.disabled = isAtStart;
  prevBtn.classList.toggle('disabled', isAtStart);
  
  // Update Next button
  nextBtn.disabled = isAtEnd;
  nextBtn.classList.toggle('disabled', isAtEnd);
}

prevBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (isAnimating || currentSlide === 0) return;
  
  isAnimating = true;
  currentSlide--;
  updateSlider();
  
  setTimeout(() => {
    isAnimating = false;
  }, 600); // Match CSS transition duration
});

nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const maxSlide = Math.max(0, projectCards.length - cardsToShow);
  
  if (isAnimating || currentSlide >= maxSlide) return;
  
  isAnimating = true;
  currentSlide++;
  updateSlider();
  
  setTimeout(() => {
    isAnimating = false;
  }, 600); // Match CSS transition duration
});

// Update slider on window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const oldCardsToShow = cardsToShow;
    cardsToShow = getCardsToShow();
    
    // Adjust currentSlide if layout changed
    if (oldCardsToShow !== cardsToShow) {
      currentSlide = Math.floor(currentSlide * oldCardsToShow / cardsToShow);
    }
    
    updateSlider();
  }, 100);
});

// Initialize slider after DOM is fully loaded
setTimeout(() => {
  updateSlider();
}, 100);

// Simple Loading Screen
document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.querySelector(".loading-screen");

  // Hide loading screen after content is loaded
  window.addEventListener("load", function () {
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      // Add a cool transition effect
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 600);
    }, 200); // Reduced from 400ms to 200ms
  });
}); 