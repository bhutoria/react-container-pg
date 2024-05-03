import SocketClient from "./SocketClient";
import fs from "fs";

console.log("checking for base files...");

fs.readdir("/home/player/code", (err, files) => {
  console.log(err);
  if (files.length < 3) {
    console.log("base files not available");
    console.log("copying base files");
    fs.cp("/code", "/home/player/code", { recursive: true }, (err) => {
      console.log(err);
    });
  }
});

if (process.env.CNC_SERVER && process.env.DEPLOYMENT_ID) {
  const socketClient = new SocketClient(process.env.DEPLOYMENT_ID);
  socketClient.listen(process.env.CNC_SERVER);
} else {
  console.log("cnc server url not available..");
}
