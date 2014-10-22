from django.db import models

# Create your models here.

class Word(models.Model):

    word = models.CharField(max_length=20)
    definition = models.CharField(max_length=150)
    part_of_speech = models.CharField(max_length=10)

    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)

    correct_guesses = models.IntegerField(default=0)
    incorrect_guesses = models.IntegerField(default=0)

    def percent_correct(self):
        return self.correct_guesses / (self.correct_guesses + self.incorrect_guesses)

    def __unicode__(self):
        return self.word

