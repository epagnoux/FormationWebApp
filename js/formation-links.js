/**
 * Génère un lien mailto à partir des données de formation
 * @param {Object} formation - L'objet formation contenant email, subject, et body
 * @returns {string} L'URL mailto encodée
 */
function generateMailtoLink(formation) {
  const body = `${formation.bodyIntro} ${formation.bodyMain}\n${formation.bodyClosing}`;
  const encodedSubject = encodeURIComponent(formation.subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${formation.email}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Charge les données des formations et met à jour les liens mailto
 */
async function initializeFormationLinks() {
  try {
    const response = await fetch('../../data/formations-messages.json');
    const data = await response.json();
    
    data.formations.forEach((formation) => {
      const mailtoLink = generateMailtoLink(formation);
      const formationElements = document.querySelectorAll(`[data-formation-id="${formation.id}"]`);
      
      formationElements.forEach((element) => {
        element.href = mailtoLink;
      });
    });
  } catch (error) {
    console.error('Erreur lors du chargement des messages de formation:', error);
  }
}

// Initialiser les liens au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFormationLinks);
} else {
  initializeFormationLinks();
}
