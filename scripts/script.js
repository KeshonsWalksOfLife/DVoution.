document.addEventListener("DOMContentLoaded", ()=> {
  const circleToggle = document.getElementById("circle-toggle");
  const body = document.body;
  const blogPanel = document.querySelector(".blog-panel");
  const goodiesPanel = document.querySelector(".goodies-panel");
  const toggleIcon = circleToggle.querySelector(".toggle-icon");

  // State management
  let isExpanded = false;

  // Animation timing
  const aniDuration = 600;

  // Toggle function with animation
  function togglePanels() {
    isExpanded = !isExpanded;

    // Toggle body class
    body.classList.toggle("goodies-expanded", isExpanded);

    // Update button content and icon
    updateButtonState();

    // Add subtle haptic feedback (if selected)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
        // Announce state change for accessibility
        announceStateChange();
  }

  // Update button appearance and content
  function updateButtonState() {
    if (isExpanded) {
      toggleIcon.innerHTML = "⌄";
      circleToggle.setAttribute("aria-label", "collapse vault, expand blog");
      circleToggle.title = "Show more blog content";
    } else {
      toggleIcon.innerHTML = "^";
      circleToggle.setAttribute("aria-label", "expand vault, collapse blog");
      circleToggle.title = "Open the vault";
    }
  }


  // Accessibility announcement
  function announceStateChange() {
    const message = isExpanded 
    ? "Vault expanded, blog content minimized" 
    : "Vault minimized, blog content expanded";

    // Create a temporary announcement element
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement); 
    }, 1000);
  }

  // Enhanced click handler with animation callbacks
  circleToggle.addEventListener("click", (e) => {
    e.preventDefault();

    // Prevent rapid clicking during animation 
    if (circleToggle.classList.contains("animating")) {
      return;
    }

    // Add animating state
    circleToggle.classList.add("animating");

    // Execute toggle
    togglePanels();

    // Animating state removed after animation completed
    setTimeout(() => {
      circleToggle.classList.remove("animating");
    }, ANIMATION_DURATION);
  });

  // Keyboard support
  circleToggle.addEventListener("keydown", (e) => {
    if(e.key == "Enter" || e.key == " ") {
      e.preventDefault();
      circleToggle.click();
    }
  });

  // Smooth scroll behavior for blog panel
  blogPanel.addEventListener("scroll", debounce(() => {
    // Add scroll-based visual feedback
    const scrollPercent = blogPanel.scrollTop / (blogPanel.scrollHeight - blogPanel.clientHeight);

    // subtle color shift based on scroll position
    if(!isExpanded) {
      // Shift from blue to purple
      const hue = 230 + (scrollPercent * 20);
      blogPanel.style.borderColor =`hsl(${hue}, 70%, 60%)`;
    } 
  }, 16)); // 60fps

  // Intersection observer for performance optimization
  const observeOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  }, observeOptions);

  // Observe panels for optimization
  panelObserver.observe(blogPanel);
  panelObserver.observe(goodiesPanel);


  // Auto-hide/show toggle button based on scroll 
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    circleToggle.style.opacity = "0.7";

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      circleToggle.style.opacity = "1";
    }, 150);
  });

  // Initialize button state
  updateButtonState();

  // Add focus management for accessibility
  circleToggle.addEventListener("focus", () => {
    circleToggle.style.outline = "3px solid #667eea";
    circleToggle.style.outlineOffset = "2px";
  });

  // preload any animation or content
  function preloadAnimation() {
    // Force browser to calculate initial styles
    window.getComputedStyle(blogPanel).transform;
    window.getComputedStyle(goodiesPanel).transform;
  }

  // Performance optimization: debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later,wait);
    };
  }

  // Initialize 
  preloadAnimation();

  console.log("Circle toggle system initialized");
})