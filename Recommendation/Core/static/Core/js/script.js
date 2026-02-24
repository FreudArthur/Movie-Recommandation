function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');




// Utilitaire pour récupérer les cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Éléments DOM
const filmButton = document.querySelector('#post_button');
const filmInput = document.querySelector('#film');
const resultatContainer = document.querySelector('#resultat');
const loadingSpinner = document.querySelector('#loading');
const dataUrl = filmButton.getAttribute('data_url');

// Fonction pour afficher le spinner de chargement
function showLoading() {
  loadingSpinner.classList.add('show');
}

function hideLoading() {
  loadingSpinner.classList.remove('show');
}

// Fonction pour afficher les résultats
function displayResults(filmsSuggestions) {
  resultatContainer.innerHTML = '';
  
  if (!filmsSuggestions || filmsSuggestions.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'error-message';
    emptyMsg.innerHTML = '⚠️ Aucun film ne correspond à votre recherche. Veuillez essayer un autre titre.';
    resultatContainer.appendChild(emptyMsg);
    return;
  }
  
  filmsSuggestions.forEach((film, index) => {
    const filmCard = document.createElement('div');
    filmCard.className = 'film-card';
    filmCard.style.animationDelay = `${index * 0.1}s`;
    
    const title = film[0];
    const score = (parseFloat(film[1]) * 100).toFixed(1);
    const description = film[3];
    
    filmCard.innerHTML = `
      <div class="film-title">🎥 ${title}</div>
      <span class="film-score">Compatibilité: ${score}%</span>
      <p class="film-description">${description}</p>
    `;
    
    resultatContainer.appendChild(filmCard);
  });
}

// Fonction pour effectuer la recherche
function searchMovies() {
  const filmName = filmInput.value.trim();
  
  if (!filmName) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = '⚠️ Veuillez entrer le titre d\'un film';
    resultatContainer.innerHTML = '';
    resultatContainer.appendChild(errorMsg);
    return;
  }
  
  showLoading();
  resultatContainer.innerHTML = '';
  
  fetch(dataUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ film: filmName })
  })
  .then(async response => {
    const text = await response.text();
    if (!text) return {};
    return JSON.parse(text);
  })
  .then(data => {
    hideLoading();
    displayResults(data.films_suggestions);
  })
  .catch(error => {
    hideLoading();
    console.error('Erreur:', error);
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.innerHTML = '❌ Une erreur est survenue lors de la recherche. Veuillez réessayer.';
    resultatContainer.innerHTML = '';
    resultatContainer.appendChild(errorMsg);
  });
}

// Écouteurs d'événements
filmButton.addEventListener('click', searchMovies);

// Permettre la recherche en appuyant sur Entrée
filmInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    searchMovies();
  }
});

// Focus initial sur l'input de recherche
window.addEventListener('load', function() {
  filmInput.focus();
});