import { io, Socket } from "socket.io-client";
import { fetchDir, fetchFileContent, newDir, newFile, saveFile } from "./fs";
import path from "path";
import { TerminalManager } from "./TerminalManager";

import http from "http";

class SocketClient {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  listen(server: string) {
    const socket = io(server, {
      transports: ["websocket"],
      query: { id: this.id, type: "deployment" },
      reconnectionAttempts: 100,
      reconnectionDelay: 5000,
      reconnection: true,
      autoConnect: false,
    });

    const terminalManager = TerminalManager.getInstance(this.id);
    console.log("Creating a connection to the socket server...");
    socket.connect();

    socket.io.on("reconnect_attempt", () => {
      console.log("reconnecting");
    });
    socket.io.on("error", (e) => {
      console.log(e);
    });

    socket.on("connect", () => {
      console.log("connected to server.");
    });

    terminalManager.listen((data) => {
      socket.emit("terminal", { data: Buffer.from(data, "utf-8") });
    });
    this.handler(socket, terminalManager);
  }

  private async handler(socket: Socket, terminalManager: TerminalManager) {
    const baseFolder = "/home/player";

    socket.on("getUrl", async () => {
      try {
        const ip = await getIP();
        socket.emit("url", ip);
      } catch (e) {
        console.log(e);
      }
    });

    socket.emit("loaded", {
      rootContent: await fetchDir(baseFolder, ""),
    });

    socket.on("fetchDir", async (dir: string, callback) => {
      console.log(dir);
      const folderPath = path.join(baseFolder, `/${dir}`);
      const contents = await fetchDir(folderPath, dir);
      callback(contents);
    });

    socket.on("fetchContent", async (filePath: string, callback) => {
      const fullPath = path.join(baseFolder, `/${filePath}`);
      const data = await fetchFileContent(fullPath);
      callback(data);
    });

    socket.on("newDir", async (folderPath: string) => {
      const fullPath = path.join(baseFolder, `/${folderPath}`);
      await newDir(fullPath);
    });

    socket.on("newFile", async (filePath: string) => {
      const fullPath = path.join(baseFolder, `/${filePath}`);
      await newFile(fullPath);
    });

    socket.on(
      "updateContent",
      async ({ filePath, content }: { filePath: string; content: string }) => {
        const fullPath = path.join(baseFolder, `/${filePath}`);
        console.log("updating:", fullPath);
        await saveFile(fullPath, content);
      }
    );

    socket.on("terminalData", async ({ data }: { data: string }) => {
      terminalManager.write(data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  }
}

const getIP = () => {
  return new Promise<string>((res, rej) => {
    http
      .get({ host: "api.ipify.org", port: 80, path: "/" }, (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          console.log(`Public IP address: ${data}`);
          res(data);
        });
      })
      .on("error", (err) => {
        console.error(`Error retrieving public IP address: ${err}`);
        rej("unable to get ip");
      });
  });
};

export default SocketClient;
