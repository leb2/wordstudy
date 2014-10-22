from django.shortcuts import render
from django.http import HttpResponse
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
import random
import json

from wordstudy.models import *

def index(request):
    return render(request, 'wordstudy/index.html')

def fetch_words(request):
    if request.method == 'GET':

        # Make sure that all of the words are of the same part of speech
        rand_pos = random.choice(['adv.', 'adj.', 'n.', 'v.'])

        # Randomly picks 'count' number of words from database, converts them to dicts, and sends them to client
        random_words = [model_to_dict(word) for word in Word.objects.filter(part_of_speech=rand_pos).order_by('?')[:request.GET['count']]]
        return HttpResponse(json.dumps(random_words), content_type="application/json")

@csrf_exempt
def send_metadata(request):
    if request.method == 'POST':

        # Deciphers the POST data
        parameters = request.POST.dict()
        word = Word.objects.get(pk=parameters['id'])

        if 'isCorrect' in parameters:
            if json.loads(parameters['isCorrect']):
                word.correct_guesses += 1
            else:
                word.incorrect_guesses += 1

        if 'isUp' in parameters:
            if json.loads(parameters['isUp']):
                word.upvotes += 1
            else:
                word.downvotes += 1

        word.save()
        return HttpResponse('')
