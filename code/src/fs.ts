import fs from "fs";

interface File {
  type: "file" | "dir";
  name: string;
  path: string;
}

export const fetchDir = (dir: string, baseDir: string): Promise<File[]> => {
  return new Promise((res, rej) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        rej(err);
      } else {
        res(
          files.map((file) => ({
            type: file.isDirectory() ? "dir" : "file",
            name: file.name,
            path: `${baseDir}/${file.name}`,
          }))
        );
      }
    });
  });
};

export const fetchFileContent = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const saveFile = (file: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, "utf8", (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const newDir = (path: string) => {
  return new Promise<void>((res, rej) => {
    fs.mkdir(path, (err) => {
      if (err) {
        return rej(err);
      }
      console.log("created new dir:", path);

      res();
    });
  });
};

export const newFile = (path: string) => {
  return new Promise<void>((res, rej) => {
    fs.writeFile(path, "", (err) => {
      if (err) {
        return rej(err);
      }
      console.log("created new file:", path);
      res();
    });
  });
};
