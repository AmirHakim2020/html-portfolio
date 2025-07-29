// ========== Utility Functions ==========

function debounce(func, delay) {
  let timer;
  return function () {
    const context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
}

/**
 * Update text and placeholder based on language
 * @param {boolean} isEnglish - true for English, false for Portuguese
 */
function updateLanguage(isEnglish) {
  $('[data-en]').each(function () {
    const $el = $(this);
    const text = isEnglish ? $el.data('en') : $el.data('pt');
    if ($el.is('input, textarea')) {
      $el.attr('placeholder', text);
    } else {
      $el.text(text);
    }
  });
}

// ========== App Object - Modular Structure ==========

const App = {
  init() {
    this.smoothScroll();
    this.themeToggle();
    this.languageToggle();
    this.readMoreToggle();
    this.mobileNav();
    this.revealOnScroll();
    this.heroAnimation();
    this.skillsAnimation();
    this.counterAnimation();
    this.formHandler(); 
  },

  smoothScroll() {
    $(document).on('click', 'a[href^="#"]', function (e) {
      const hash = this.hash;
      const target = $(hash);
      if (target.length) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 800, 'swing');
      }
    });
  },

  themeToggle() {
    const $toggle = $('#themeToggle');
    if ($toggle.length) {
      const isDark = localStorage.getItem('theme') === 'dark';
      if (isDark) $('body').addClass('dark-mode');
      $toggle.text(isDark ? '☀️' : '🌙');
    }

    $toggle.on('click', function () {
      $('body').toggleClass('dark-mode');
      const isDarkMode = $('body').hasClass('dark-mode');
      $(this).text(isDarkMode ? '☀️' : '🌙');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
  },

  languageToggle() {
    const $toggle = $('#langToggle');
    if ($toggle.length) {
      const isEnglish = localStorage.getItem('lang') !== 'pt';
      $toggle.text(isEnglish ? 'EN' : 'PT');
      updateLanguage(isEnglish);
    }

    $toggle.on('click', function () {
      const isEnglish = $(this).text().trim() !== 'PT';
      const newLang = isEnglish ? 'pt' : 'en';
      localStorage.setItem('lang', newLang);
      updateLanguage(!isEnglish);
      $(this).text(isEnglish ? 'PT' : 'EN');
    });
  },

  readMoreToggle() {
    $(document).on('click', '.read-more-btn', function () {
      const card = $(this).closest('.card, .blog-card');
      const isExpanded = card.hasClass('expanded');
      card.toggleClass('expanded');
      $(this).text(isExpanded ? 'Read More' : 'Read Less');
    });
  },

  mobileNav() {
    const $menuToggle = $('#menuToggle');
    const $navLinks = $('#navLinks');

    if ($menuToggle.length && $navLinks.length) {
      $menuToggle.on('click', function () {
        $navLinks.stop(true, true).slideToggle(300, function () {
          $menuToggle.attr('aria-expanded', $navLinks.is(':visible'));
        });
      });

      $(window).on('resize', debounce(function () {
        if ($(window).width() > 768) {
          $navLinks.removeAttr('style');
        }
      }, 250));

      $(document).on('click', function (e) {
        const $target = $(e.target);
        if (!$target.closest('#menuToggle, #navLinks').length &&
            $navLinks.is(':visible') &&
            $(window).width() <= 768) {
          $navLinks.slideUp(300);
        }
      });
    }
  },

  revealOnScroll() {
    const sections = ['.about', '.card', '.counter', '.education-item', '.courses-list li'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(selector => {
      $(selector).each(function () {
        observer.observe(this);
      });
    });
  },

  heroAnimation() {
    $('.hero-content').css({
      opacity: 1,
      transform: 'translateY(0)'
    });
  },

  skillsAnimation() {
    $('.card').each(function () {
      const $progress = $(this).find('.progress');
      const width = $progress.data('progress');
      if (width && $progress.length) {
        $progress.css('width', '0%').animate({ width: width + '%' }, 1500);
      }
    });
  },

  counterAnimation() {
    const counters = document.querySelectorAll('.counter');

    function animateCount(counter) {
      const target = +counter.getAttribute('data-count');
      let count = 0;
      const speed = Math.max(target / 100, 1);

      const interval = setInterval(() => {
        count += speed;
        counter.textContent = Math.round(count);
        if (count >= target) {
          clearInterval(interval);
          counter.textContent = target;
        }
      }, 20);
    }

    function checkCounters() {
      counters.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100 && !counter.dataset.animated) {
          animateCount(counter);
          counter.dataset.animated = true;
        }
      });
    }

    window.addEventListener('scroll', debounce(checkCounters, 100));
    checkCounters();
  },

  // ========== NEW: Form Submission Handler ==========
  formHandler() {
    $('.contact-form').on('submit', function (e) {
      const $form = $(this);
      const $btn = $form.find('.submit-btn');
      const $success = $form.find('.success-message');

      // Prevent double submission
      if ($btn.prop('disabled')) {
        e.preventDefault();
        return;
      }

      $btn.prop('disabled', true).text('Sending...');


      $success.hide();

      setTimeout(() => {
        $btn.prop('disabled', false).text($btn.data('en'));
        updateLanguage(localStorage.getItem('lang') !== 'pt');
      }, 3000);
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === '1') {
      $('.success-message').fadeIn(500);
      $('html, body').animate({
        scrollTop: $('#contact').offset().top
      }, 500);
    }
  }
};

// ========== Initialize App on Document Ready ==========

$(document).ready(() => {
  App.init();
});