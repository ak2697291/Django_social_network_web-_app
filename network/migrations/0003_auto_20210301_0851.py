# Generated by Django 3.1.5 on 2021-03-01 03:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_comment_following_post'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='id',
        ),
        migrations.AlterField(
            model_name='post',
            name='post_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
