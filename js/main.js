// Fichier JavaScript principal pour le site Charlotte®
// Ajoutez ici vos scripts personnalisés.

// ── Intersection Observer pour les animations au scroll ──
(function initScrollAnimations() {
  // Options pour l'Intersection Observer
  const observerOptions = {
    root: null, // Utilise la fenêtre comme référence
    rootMargin: '0px 0px -50px 0px', // Déclenche quand l'élément est à 50px du bas de la fenêtre
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

  // Éléments à animer
  const elementsToObserve = document.querySelectorAll('section, .hero, .hero-image, .card, .value-item');
  
  elementsToObserve.forEach(function(el) {
    observer.observe(el);
  });
})();

// ── Dark Mode ──
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

function setupThemeToggle() {
  document.querySelectorAll('.theme-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Setup toggle pour les boutons déjà présents dans le DOM
  setupThemeToggle();
  // Déterminer si on est dans /pages/ ou à la racine
  const isInPages = window.location.pathname.includes('/pages/');
  const headerPath = isInPages ? 'header.html' : 'header-root.html';
  const footerPath = isInPages ? 'footer.html' : 'footer-root.html';
  
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
});
