document.addEventListener('DOMContentLoaded', function () {

  /* ========================================
     Hero Image Slider
     ======================================== */

  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let currentSlide = 0;
  let autoplayTimer = null;

  function showSlide(index) {
    slides.forEach(function (slide) {
      slide.classList.remove('active');
    });
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (slides.length > 1) {
    prevBtn.addEventListener('click', function () {
      prevSlide();
      startAutoplay();
    });

    nextBtn.addEventListener('click', function () {
      nextSlide();
      startAutoplay();
    });

    startAutoplay();
  }

  /* ========================================
     Mobile Navigation Toggle
     ======================================== */

  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  mobileToggle.addEventListener('click', function () {
    mainNav.classList.toggle('open');
  });

  var dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        var link = item.querySelector('.nav-link');
        if (e.target === link || link.contains(e.target)) {
          e.preventDefault();
          item.classList.toggle('dropdown-open');
        }
      }
    });
  });

  var submenuParents = document.querySelectorAll('.has-submenu');
  submenuParents.forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        var link = item.querySelector('a');
        if (e.target === link || link.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('submenu-open');
        }
      }
    });
  });

  /* ========================================
     Simple Form Validation
     ======================================== */

  var form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstName = document.getElementById('firstName').value.trim();
      var lastName = document.getElementById('lastName').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();

      if (!firstName || !lastName) {
        alert('Please enter your full name.');
        return;
      }
      if (!email || email.indexOf('@') === -1) {
        alert('Please enter a valid email address.');
        return;
      }
      if (!phone) {
        alert('Please enter a valid phone number.');
        return;
      }

      alert('Thank you! Your appointment request has been submitted. We will be in touch shortly.');
      form.reset();
    });
  }

  /* ========================================
     Close dropdowns on outside click
     ======================================== */

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header')) {
      mainNav.classList.remove('open');
      dropdownParents.forEach(function (item) {
        item.classList.remove('dropdown-open');
      });
    }
  });

});
