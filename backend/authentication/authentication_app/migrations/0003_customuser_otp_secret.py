# Generated by Django 4.2.16 on 2024-10-29 06:50

from django.db import migrations, models
import pyotp


class Migration(migrations.Migration):

    dependencies = [
        ('authentication_app', '0002_customuser_avatar_customuser_display_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='otp_secret',
            field=models.CharField(default=pyotp.random_base32, max_length=16),
        ),
    ]
