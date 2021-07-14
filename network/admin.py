from django.contrib import admin
from .models import Post,comment,following,User,like
# Register your models here.
class post_id(admin.ModelAdmin):
    readonly_fields = ('post_id',)

admin.site.register(User)
admin.site.register(Post,post_id)
admin.site.register(comment)
admin.site.register(following)
admin.site.register(like)
