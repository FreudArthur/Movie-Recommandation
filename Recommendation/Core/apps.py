from django.apps import AppConfig
from .load_data import SuggestionLoader

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Core'


    """ def ready(self):
        # Charger le dataset dès le démarrage du serveur
        
        SuggestionLoader.get_dataframe()"""