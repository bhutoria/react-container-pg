FROM node:18

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY base/ /code/

COPY code/package*.json ./

RUN npm install

COPY code/ .

RUN npm run build

RUN npm rebuild node-pty

RUN chown -R root:root /app && \
    chmod -R 555 /app

ARG USER_ID=1001
ARG GROUP_ID=1001

RUN groupadd --gid $GROUP_ID player_group

RUN adduser --disabled-password --gecos "" --uid $USER_ID --gid $GROUP_ID player

RUN mkdir -p /home/player/code && \
    chown -R player:player_group /home/player/code && \
    chmod -R 755 /home/player/code

USER player

CMD ["node","dist/index.js"]
