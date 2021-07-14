
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    #API paths
    path("newpost",views.newpost,name="newpost"),
    path("allposts",views.allposts, name = "allposts"),
    path("check_like_post",views.check_like_post, name= "check_like_post"),
    path("new_like",views.new_like,name = "new_like"),
    path("unlike",views.unlike,name = "unlike"),
    path("follow_count",views.follow_count,name = "follow_count"),
    path("follow_add",views.follow_add,name = "follow_add"),
    path("follow_remove",views.follow_remove,name = "follow_remove"),
    path("follow_check",views.follow_check,name = "follow_check"),
    path("edit_post",views.edit_post,name="edit_post")
    
   
]
