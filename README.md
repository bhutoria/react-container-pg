# react-container-pg

`react-container-pg` is a containerized application that provides access to a terminal using Node.js' `pty` (Pseudo Terminal) module. It connects to a socket server, allowing a client to access and modify files in the `/home/player/code` directory within the container.

The `base` folder is a boilerplate react application created using vite. It has no effect on the main application which resides in `code` folder.

Check the comments in Dockerfile for clearer understanding.

## Features

- Runs as a container only (testing has been done in a containerized environment).
- Enables access to a terminal through Node.js' `pty` module.
- Establishes a connection with a socket server.
- Allows a client connected to the other end of the server to read and write files in the `/home/player/code` directory within the container.

## Prerequisites

Before running the application, ensure that you have the following prerequisites installed:

- Docker (for running the application in a containerized environment)
