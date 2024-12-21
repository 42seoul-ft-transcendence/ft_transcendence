#!/bin/sh

echo "Starting Django..."

# Generate SSL certificate if not found
if [ ! -f /ssl/localhost.key ] || [ ! -f /ssl/localhost.crt ]; then
  echo "SSL key for localhost not found. Generating a new self-signed SSL certificate..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /ssl/localhost.key -out /ssl/localhost.crt \
    -subj "/CN=localhost"
  echo "SSL certificate generated and saved at /ssl/localhost.crt"
  chmod 600 /ssl/localhost.key /ssl/localhost.crt
fi

# Apply migrations
echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "Checking if superuser with username ${DJANGO_SUPERUSER} exists..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="${DJANGO_SUPERUSER}").exists():
    user = User.objects.create_superuser(
        username="${DJANGO_SUPERUSER}",
        email="${DJANGO_SUPERUSER_EMAIL}",
        password="${DJANGO_SUPERUSER_PASSWORD}",
        avatar="${DJANGO_DEFAULT_AVATAR}"
    )
    user.avatar = "default_avatar.jpg"  # Set a default avatar
    user.save()
    print("Superuser ${DJANGO_SUPERUSER} created.")
else:
    print("Superuser ${DJANGO_SUPERUSER} already exists.")
EOF

# Start the Django server
echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
