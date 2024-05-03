FROM node:18

# Install build dependencies for node pty
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy the boilerplate react code
COPY base/ /code/

COPY code/package*.json ./

RUN npm install

# copy node js code
COPY code/ .

RUN npm run build

# node pty is rebuilt to avoid run time errors
RUN npm rebuild node-pty

# disallow "USER" to modify the primary node js application
RUN chown -R root:root /app && \
    chmod -R 555 /app

# create a new user for restricted terminal access
ARG USER_ID=1001
ARG GROUP_ID=1001

RUN groupadd --gid $GROUP_ID player_group

RUN adduser --disabled-password --gecos "" --uid $USER_ID --gid $GROUP_ID player

# create a home directory for the user
RUN mkdir -p /home/player/code && \
    chown -R player:player_group /home/player/code && \
    chmod -R 755 /home/player/code

USER player

CMD ["node","dist/index.js"]
