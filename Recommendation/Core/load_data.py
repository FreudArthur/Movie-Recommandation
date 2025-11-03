import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SuggestionLoader:

    _df = None # Permet de garder la dataset chargé une seule fois en mémoire pour économiser la ram

    _g_k_vectoriser = None
    _title_vectoriser = None

    Vectoriser_of_combined = TfidfVectorizer()
    Vectoriser_of_title = TfidfVectorizer()
    

    @classmethod # Permet de definir une méthode qui recoit en parametre la classe elle meme plutot qu'une instance celle ci comme avec classe : la variable _df  est donc partagé par toutes les instances et permet 


    def get_dataframe(cls):
      
        if cls._df is None:

            print("Chargement du dataset en mémoire…")

            colonnes_utiles = ['title' , 'vote_average' ,'homepage' , 'overview' ,'genres','keywords' , 'adult']
            dtype_dict = {
                'vote_average': 'float32',
                'score': 'float32',
                'adult': 'bool'
            }
            df = pd.read_csv("../Recommandation imdb/dataset movies imdb/TMDB_movie_dataset_v11.zip", usecols=colonnes_utiles, dtype=dtype_dict)


            # Remplacer les valeurs manquantes par unknow
            df.loc[: , ['title','homepage' , 'genres' ,'keywords' ,'overview']] = df[['title','homepage' ,'genres', 'keywords' , 'overview']].fillna('Unknow')


            # Nouvelle colonne pour la combinaison
            df['combined'] = df['genres'] + " " + df['keywords']

            # Pour éviter que deux titres ne soient identiques
            df.drop_duplicates(subset='title' , inplace=True)
          

            cls._df = df
        return cls._df
    
    
    @classmethod
    def load_combined_vectorise(cls):

        if cls._g_k_vectoriser is None:
            data_vectorise = cls.Vectoriser_of_combined.fit_transform(cls.get_dataframe()['combined'])
            cls._g_k_vectoriser = data_vectorise

        return cls._g_k_vectoriser
    
    
    @classmethod
    def load_title(cls):

        if cls._title_vectoriser is None:
          
            data_title_vectorise = cls.Vectoriser_of_title.fit_transform(cls.get_dataframe()['title'])
            cls._title_vectoriser = data_title_vectorise

        return cls._title_vectoriser
    


    @classmethod
    def suggestions_de_films(cls , film):

        data = cls.get_dataframe().loc[cls.get_dataframe()['title'].str.lower() == str(film).lower() , ['genres' , 'keywords']]

        if data.empty : 
            print ("Aucun film trouvé")
            return

        recommendation =[]

        data_found = data.iloc[0]
        texte_film = [data_found['genres'] + " " + data_found['keywords']]

        donnees_vectoriser = cls.load_combined_vectorise()      
        g_k_film_vectorise = cls.Vectoriser_of_combined.transform(texte_film)

        score  = cosine_similarity(g_k_film_vectorise , donnees_vectoriser  ).flatten()
        
            
        recommendation = list(zip(cls.get_dataframe()['title'] , score, cls.get_dataframe()['vote_average'] , cls.get_dataframe()['overview'])  )

        recommendation.sort(key=lambda x: x[1], reverse=True)

        return recommendation[1:6]

        
    @classmethod
    def suggestions_de_titres(cls , title):

        search = [title]
        df_title_vectorise = cls.load_title()

        search_v = cls.Vectoriser_of_title.transform(search)

        score_title = cosine_similarity(df_title_vectorise , search_v ).flatten()
        results = list(zip(cls.get_dataframe()['title'] , score_title))

        results.sort(key=lambda x : x[1] , reverse=True)

        return results[:5]

