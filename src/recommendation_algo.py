# Recommendation algorithm takes liked movies from the user and recommends top 5 movies from the unwatched movies in the dataset
from pymongo import MongoClient
import statistics
import sys
import ast
import time


response = ast.literal_eval(sys.argv[1])    #Converts the string JSON object to JSON object
movieId = list(response.values())       #Values in JSON object are stored in list
movieId = movieId[:-1]                  #Last element Submit value is omitted
movieId = list(map(int,movieId))        #Converts all the string elements in movieID to integers and this becomes the liked movies list

client = MongoClient('mongodb+srv://shreeya:engage1@recommendationsystem.kt1oyc0.mongodb.net/Registration?retryWrites=true&w=majority')
# Database Name
db = client["Registration"]
 
# Collection Name
col = db["moovies"]

def calculation(distance):
    # mean_distance = statistics.mean(distance)
    distance = [0.01 if x==0 else x for x in distance]
    mean_distance = statistics.mean(distance)
    weighted_distance =[1/x for x in distance]
    norm_weighted_distance = [x/sum(weighted_distance) for x in weighted_distance]
    score = 0
    for x in range(len(distance)):
        if(distance[x] <= mean_distance):
            score += norm_weighted_distance[x]
    return score

# Euclidean Distance Calculation for rating, duration and year
def euclidean_dist(i,ids,movie_rec):
    distance =[]
    for j in ids:
        dist = ((movie_rec[i]['rating'] - movie_rec[j]['rating'])**2 + (movie_rec[i]['duration'] - movie_rec[j]['duration'])**2 + (movie_rec[i]['year'] - movie_rec[j]['year'])**2 )**0.5
        distance.append(dist)
    return calculation(distance)

# Hamming Distance Calculation based on genres
def genre_similarity(i,ids,movie_rec,lk_genre_sum):
    distance =[]
    for j in ids:
        # #Calculating the similarity in genres with the weights calculated from liked movies
        dist = (movie_rec[i]['horror'] * lk_genre_sum[0]) + (movie_rec[i]['comedy'] * lk_genre_sum[1]) + (movie_rec[i]['action'] * lk_genre_sum[2])

    return dist

# Hamming Distance Calculation based on languages
def ham_dist_language(i,ids,movie_rec):
    distance =[]
    for j in ids:
        dist = abs(movie_rec[i]['English'] - movie_rec[j]['English'])+ abs(movie_rec[i]['Hindi'] - movie_rec[j]['Hindi']) + abs(movie_rec[i]['Telugu'] - movie_rec[j]['Telugu'])
        distance.append(dist)
    distance = [1 if x==0 else x-2 for x in distance]
    mean_distance = statistics.mean(distance)
    return (mean_distance)


def get_recommendation_ids(ids,movie_rec):
    total_movie_list = list(movie_rec.keys())    #Stores all movie ids in a list
    process_movie_id = []       #Stores unwatched movie ids in a list
    for i in total_movie_list:
        if i not in ids:
            process_movie_id.append(i)
    movies_prediction = [] 
    #Each genre weightage calculation from the liked movies
    lk_genre_sum=[0,0,0]
    for i in ids:
        lk_genre_sum[0]+=movie_rec[i]['horror']
        lk_genre_sum[1]+=movie_rec[i]['comedy']
        lk_genre_sum[2]+=movie_rec[i]['action']
    l_sum = sum(lk_genre_sum)
    lk_genre_sum =[i/l_sum for i in lk_genre_sum]
    

    for i in process_movie_id:
        #Calculates the similarity of unwatched movies with the liked movies given by the user
        similarity = (euclidean_dist(i,ids,movie_rec)*0.2) + (genre_similarity(i,ids,movie_rec,lk_genre_sum)*0.4) + (ham_dist_language(i,ids,movie_rec)*0.4)     
        movies_prediction.append([i,similarity])  
    #Sort the predicted movie ids according to the similarity in descending order
    movies_prediction.sort(key = lambda x: x[1],reverse=True)
    recommended_list = [x[0] for x in movies_prediction]    #Contains sorted movie ids    
    return recommended_list

def get_recommendation(ids):
    res = list(col.find({},{'_id':0 ,'id' : 1,'year' : 1,'duration' :1,'rating':1,'English' : 1,'Hindi' : 1,'Telugu' : 1,'horror' : 1,'comedy' : 1,'action' : 1,'title' : 1,'genre':1,'language':1}))
    movie_rec = {}
    for i in res:
        movie_rec[i['id']] = i
    response=get_recommendation_ids(ids,movie_rec)
    for i in response:
        #Sending movie details to app.js
        print(movie_rec[i]['title'])
        print(movie_rec[i]['year'])
        print(movie_rec[i]['duration'])
        print(movie_rec[i]['genre'])
        print(movie_rec[i]['language'])
        print(movie_rec[i]['rating'])

get_recommendation(movieId)    #Sending the liked movie list to get_recommendation function
