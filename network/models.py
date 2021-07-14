from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.CharField( max_length=255)
    post_data = models.TextField()
    timestamp = models.DateTimeField()
    like_count = models.IntegerField()
    post_id = models.AutoField(primary_key=True)
    def __str__(self):
        return f"{self.user , self.post_data, self.timestamp , self.like_count}"

class comment(models.Model):
    user = models.CharField(max_length=255)
    post_id = models.IntegerField()
    comment_data = models.TextField()
    timestamp = models.DateTimeField()
    def __str__(self):
        return f"{self.user , self.post_id, self.comment_data, self.timestamp}"


class following(models.Model):
    user = models.CharField(max_length=255)
    friends = models.CharField(max_length=255)
    timestamp  = models.DateTimeField()

    def __str__(self):
        return f"{self.user, self.friends, self.timestamp}"

class like(models.Model):
    user = models.CharField(max_length=255)
    post_id = models.IntegerField()
    timestamp = models.DateTimeField()
    
    def __str__(self):
        return f"{self.user, self.post_id, self.timestamp}"







