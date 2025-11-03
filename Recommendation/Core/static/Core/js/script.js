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




const film_button = document.querySelector('#post_button')
const data_url = film_button.getAttribute('data_url')
console.log(data_url)

film_button.addEventListener("click", function() 
{
const film = document.querySelector('#film').value
document.querySelector('#resultat').textContent = ''

  fetch(data_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ film: film })
  })

  .then(async response => {
    
      const text = await response.text();
  if (!text) return {}; // corps vide → retourne objet vide
  return JSON.parse(text);
  })

  .then(data => {
    console.log(data);
    const resultat = document.querySelector('#resultat');
    resultat.textContent = '';
    if (!data.films_suggestions || data.films_suggestions.length === 0)
      resultat.textContent = 'Aucun film ne crrespond à votre recherche'

    else{
      
      data.films_suggestions.forEach(element => {
      const new_film = document.createElement('div')
      new_film.innerHTML = `Titre : <strong>${element[0]}</strong> <br> Score de compatibilité : ${element[1]} <br> Description : ${element[3]}` ;
      resultat.appendChild(new_film)
      
    })
  };
    
  })
  .catch(() => {
    document.querySelector('#resultat').textContent = "Une erreur est survenue";
  });
}
)
;