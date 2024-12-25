# Generated by Django 4.2.17 on 2024-12-24 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_user_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='display_name',
        ),
        migrations.AddField(
            model_name='user',
            name='status_message',
            field=models.TextField(blank=True, default='', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='media/avatars/default.png', upload_to='media/avatars/'),
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='otp_secret',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]