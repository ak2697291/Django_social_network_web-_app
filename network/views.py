from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User,Post,comment,following,like
import datetime
from django.core.paginator import Paginator
import json
def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
@csrf_exempt
@login_required
def newpost(request):
    if request.method !="POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    post_body = data.get("post_body")
    user = request.user.username
    timestamp = datetime.datetime.now()
    like_count = 0
    newpost = Post(user = user,post_data=post_body,timestamp = timestamp, like_count = like_count)
    newpost.save()

    return JsonResponse({"message": "New Post Added successfully."},status=201)
@csrf_exempt
def allposts(request):
    if request.method !="POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    section = data.get("section")
    print("anil kumar sing chaudhary")
    if section == "allposts":
        posts = Post.objects.all().values()
        
        posts = posts.order_by("-timestamp").all()
        print(list(posts))
    elif section == "user-post":
        user = data.get("postUser")
        posts = Post.objects.filter(user=user).values()
        posts = posts.order_by("-timestamp").all()
    elif section == "follow-post":
        user = request.user.username
        
        eg = following.objects.filter(friends=user).values('user').all()
        print(f"eg ka bbaaap{eg}")
        monkey = []
        for item in eg:
            monkey.append(Post.objects.filter(user = item['user']).values())
        
        print(f"mera naam joker {monkey}")
        elephant =[]
        for items in monkey:
            for item in items:
                elephant.append(item)
        print(f"jsdkbcjhsbcjhb {elephant}")
        posts = elephant[::-1]
 

        



        # posts = Post.objects.filter(user=user).values()
        # posts = posts.order_by("-timestamp").all()

    paginator = Paginator(posts,10) #show 10 posts per page
    
    page_number = data.get("page_no")
    page_obj = paginator.get_page(page_number)

    return JsonResponse(list(page_obj), safe=False)


@csrf_exempt
def check_like_post(request):
    if request.method !="PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    data = json.loads(request.body)
    # user = data.get("username")
    user = request.user.username
    print(user)
    post_id = data.get("post_id")
    
    check = like.objects.filter(user=user, post_id=post_id)
    true= ["True"]
    false = ["False"]
    if check:
        return JsonResponse(true,safe = False)
    else:
        return JsonResponse(false,safe =False)
    

@login_required
@csrf_exempt
def new_like(request):
    if request.method !="POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    post_id = data.get("post_id")
    username = request.user.username
    like1 = like(user=username,timestamp=datetime.datetime.now(),post_id = post_id)
    like1.save()
    add_like = Post.objects.get(post_id =post_id)
    add_like.like_count = like.objects.filter(post_id = post_id).count()
    add_like.save()
    return JsonResponse({"message": "New like Added successfully."},status=201)


@login_required
@csrf_exempt
def unlike(request):
    if request.method !="PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    data = json.loads(request.body)
    post_id = data.get("post_id")
    username = request.user.username
    like.objects.filter(user = username,post_id = post_id).delete()
    unlike = Post.objects.get(post_id =post_id)
    unlike.like_count = like.objects.filter(post_id = post_id).count() - 1
    print(unlike.like_count)
    if(unlike.like_count<0):
        unlike.like_count =0
    
    unlike.save()
    return JsonResponse({"message": "unlike successfully."},status=201)


@login_required
@csrf_exempt
def follow_count(request):
    if request.method !="PUT":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    user = data.get("username")
    followers = following.objects.filter(user=user).count()
    follow = following.objects.filter(friends = user).count()
    strength = []
    strength.append(followers)
    strength.append(follow)
    return JsonResponse(list(strength), safe=False)    

    
@login_required
@csrf_exempt
def follow_add(request):
    if request.method !="POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data= json.loads(request.body)
    user = data.get("user")
    friend = data.get("friend")
    new_follower = following(user=user,friends=friend,timestamp=datetime.datetime.now())
    new_follower.save()
    return JsonResponse({"message": "Followed successfully."},status=201)

    



@login_required
@csrf_exempt
def follow_remove(request):
    if request.method !="POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data= json.loads(request.body)
    user = data.get("user")
    friend = data.get("friend")
    following.objects.filter(user=user,friends=friend).delete()
    
    return JsonResponse({"message": "Unfollowed successfully."},status=201)


@login_required
@csrf_exempt
def follow_check(request):
    if request.method !="POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data= json.loads(request.body)
    user = data.get("user")
    friend = data.get("friend")
    if(following.objects.filter(user=user,friends=friend).count()):
        result= ["true"]
        return JsonResponse(list(result),safe=False)
    else:
        result= ["false"]
        return JsonResponse(list(result),safe=False)


@login_required
@csrf_exempt
def edit_post(request):
    if request.method !="POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data =json.loads(request.body)
    post_id = data.get("post_id")
    post_data = data.get("post_data")
    edit_post = Post.objects.get(post_id =post_id)
    edit_post.post_data = post_data
    edit_post.save()
    return JsonResponse({"message": "Edit Post  successfully."},status=201)

    