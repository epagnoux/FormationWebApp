// Fichier JavaScript principal pour le site Formation FCP
// Ajoutez ici vos scripts personnalisés.

// ── Intersection Observer pour les animations au scroll ──
(function initScrollAnimations() {
  // Options pour l'Intersection Observer
  const observerOptions = {
    root: null, // Utilise la fenêtre comme référence
    rootMargin: '0px 0px -200px 0px', // Déclenche quand l'élément est à 200px du bas de la fenêtre
    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
  };

  // Créer l'observeur
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Ajouter la classe 'in-view' quand l'élément devient visible
        entry.target.classList.add('in-view');
        // Optionnel: arrêter d'observer après l'animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Éléments à animer (ciblage précis pour éviter les conflits d'opacité parent/enfant)
  const elementsToObserve = document.querySelectorAll(
    '.hero-image, .hero h1, .hero p, .hero-ctas .btn, .presentation, .cta-section, .card, .value-item, ' +
    '.formations-hero, .formation-banner, ' +
    '.contact-intro, .contact-form-section, .contact-info, ' +
    '.page-content, .legal-section'
  );

  elementsToObserve.forEach(function(el) {
    observer.observe(el);
  });
})();

// ── Formation meta : révélation séquentielle type Apple ──
(function initFormationMetaAnimation() {
  var metas = document.querySelectorAll('.formation-meta');
  if (!metas.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var attrs = entry.target.querySelectorAll('.formation-attr');
        attrs.forEach(function(attr, i) {
          setTimeout(function() {
            attr.classList.add('in-view');
          }, i * 110);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

  metas.forEach(function(meta) {
    observer.observe(meta);
  });
})();

// ── Header : effet verre dépoli au scroll ──
(function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

// ── Dark Mode ──
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateFavicon();
})();

// ── Update favicon based on theme ──
function updateFavicon() {
  const theme = document.documentElement.getAttribute('data-theme');
  const faviconLink = document.querySelector('link[rel="icon"]');
  const faviconPath = theme === 'dark' ? 'images/favicon-dark.svg' : 'images/favicon-light.svg';
  
  if (faviconLink) {
    faviconLink.href = faviconPath;
  }
}

function setupThemeToggle() {
  document.querySelectorAll('.theme-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateFavicon();
    });
  });
}

// ── Réinitialiser l'effet scroll du header ──
function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
  // Setup toggle pour les boutons déjà présents dans le DOM
  setupThemeToggle();
  const headerPath = '/pages/header/header.html';
  const footerPath = '/pages/footer/footer.html';
  
  // Inclure dynamiquement le header sur toutes les pages
  const headerTarget = document.getElementById('header-include');
  if (headerTarget) {
    fetch(headerPath)
      .then(response => {
        if (!response.ok) throw new Error('Erreur de chargement du header');
        return response.text();
      })
      .then(html => {
        headerTarget.innerHTML = html;
        setupThemeToggle(); // Re-bind toggle après injection dynamique
        initHeaderScroll(); // Réinitialiser l'effet de scroll du header
      })
      .catch(error => console.error('Erreur:', error));
  }
  
  // Inclure dynamiquement le footer sur toutes les pages
  const footerTarget = document.getElementById('footer-include');
  if (footerTarget) {
    fetch(footerPath)
      .then(response => {
        if (!response.ok) throw new Error('Erreur de chargement du footer');
        return response.text();
      })
      .then(html => { footerTarget.innerHTML = html; })
      .catch(error => console.error('Erreur:', error));
  }

  // Déclencher les animations du hero au chargement (sur la home page, le hero est visible)
  // Ajouter un délai court pour que Safari ait le temps de faire le rendu
  if (!isInPages) {
    setTimeout(function() {
      var heroElements = document.querySelectorAll('.hero h1, .hero p, .hero-ctas .btn');
      heroElements.forEach(function(el) {
        el.classList.add('in-view');
      });
    }, 100);
  }

  // ── Navigation par ancre : afficher immédiatement la cible et recaler le scroll ──
  // if (window.location.hash) {
  //   var target = document.querySelector(window.location.hash);
  //   if (target) {
  //     target.classList.add('in-view');
  //     requestAnimationFrame(function() {
  //       target.scrollIntoView({ behavior: 'auto' });
  //     });
  //   }
  // }
});
