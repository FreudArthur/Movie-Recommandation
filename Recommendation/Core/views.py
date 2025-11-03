from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
import json

from .load_data import SuggestionLoader


def search(request):
    
    if request.method == 'POST':
        data = json.loads(request.body)
        film = data.get('film', '')
        print(f"Film reçu 👀⚔️ : {film}") 
        print("Suggestion de film en cours ✏️✏️🕵️")
        Suggestions = SuggestionLoader.suggestions_de_films(film)
       
        print(Suggestions)
        return JsonResponse({'message': f"Film '{film}' reçu avec succès !" , 'films_suggestions' : Suggestions})
   # return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    
    context = {'Auteur' : 'Freud Bok'}
    template = loader.get_template('Core/index.html')

    return HttpResponse(template.render(context , template))
