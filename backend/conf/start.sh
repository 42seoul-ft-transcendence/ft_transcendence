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

echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate --noinput
echo "Database migrations completed."

if [ "$DJANGO_SUPERUSER" ]; then
    echo "Checking if superuser with username ${DJANGO_SUPERUSER} exists..."
    exists=$(python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(username='$DJANGO_SUPERUSER').exists())")
    if [ "$exists" = "True" ]; then
        echo "Superuser ${DJANGO_SUPERUSER} already exists. Skipping creation."
    else
        echo "Superuser ${DJANGO_SUPERUSER} does not exist. Creating superuser..."
        (python manage.py createsuperuser \
            --noinput \
            --username $DJANGO_SUPERUSER) \
        || true
        echo "Superuser ${DJANGO_SUPERUSER} created."
    fi
else
    echo "No superuser username provided. Skipping superuser creation."
fi

django-admin compilemessages

echo "Collecting static files..."
python manage.py collectstatic --noinput
echo "Static files collected."

echo "Starting Daphne server with SSL..."
# daphne -e ssl:8000:privateKey=/ssl/${HOSTNAME}.key:certKey=/ssl/${HOSTNAME}.crt transcendence.asgi:application
daphne -b 0.0.0.0 -p 443 transcendence.asgi:application