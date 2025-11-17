export class Input {
  private keys: { [key: string]: boolean } = {}; //  Record<string, boolean>

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key] = false;
  };

  public start() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public stop() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  public isDown(key: string): boolean { // .toLowerCase() somewhere i guess ?
    return this.keys[key] === true;
  }

  public getPressedKeys(): string[] {
    return Object.keys(this.keys).filter(k => this.keys[k]);
  }
}