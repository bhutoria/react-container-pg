import { spawn, IPty } from "node-pty";

export class TerminalManager {
  private static instance: { [id: string]: TerminalManager } = {};
  private terminal: IPty;

  private constructor() {
    const terminal = spawn("bash", [], {
      cols: 100,
      name: "xterm",
      cwd: "/home/player/code",
    });
    this.terminal = terminal;
  }

  public static getInstance(id: string) {
    if (TerminalManager.instance[id]) {
      return TerminalManager.instance[id];
    }
    console.log("creating new terminal...");
    TerminalManager.instance[id] = new TerminalManager();

    return TerminalManager.instance[id];
  }

  listen(onData: (data: string) => void) {
    console.log("initializing terminal listeners");

    this.terminal.onData((data) => {
      onData(data);
    });
    this.terminal.onExit(() => {
      console.log("exiting terminal");
      TerminalManager.instance = {};
    });
  }

  write(data: string) {
    this.terminal.write(data);
  }
}
