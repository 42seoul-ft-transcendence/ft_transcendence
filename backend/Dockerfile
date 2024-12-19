FROM python:3.9-alpine

ENV PYTHONUNBUFFERED=1

ARG DJANGO_SUPERUSER
ENV DJANGO_SUPERUSER=${DJANGO_SUPERUSER}

ARG HOSTNAME
ENV HOSTNAME=${HOSTNAME}

WORKDIR /app
EXPOSE 443
VOLUME [ "/app" ]

COPY conf/requirements.txt requirements.txt

RUN apt update && \
    apt upgrade -y && \
    apt install -y openssl coreutils gettext && \
    apt clean && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    groupadd -r appGroup && \
    useradd -r -g appGroup ${DJANGO_SUPERUSER} && \
    mkdir -p /static /ssl/ && \
    chown ${DJANGO_SUPERUSER}:appGroup /static /ssl/

USER ${DJANGO_SUPERUSER}

COPY --chown=${DJANGO_SUPERUSER}:appGroup transcendence /app
COPY --chown=${DJANGO_SUPERUSER}:appGroup conf/start.sh /start.sh

RUN chmod a+x /start.sh

CMD [ "/start.sh" ]