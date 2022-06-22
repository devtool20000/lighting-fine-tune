import { FineTuneItem, FineTuneItemContext } from "./FineTuneItem";
import { ReplaceTextFn } from "./FineTuneManager";


export class TokenReplacerItem implements FineTuneItem {

  public replaceText!: ReplaceTextFn

  private cache: Map<string, TokenReplacer> = new Map();

  constructor(public options: TokenReplacerOptions) {
    // this is for unit test purpose
    if(this.options.replaceText) {
      this.replaceText = this.options.replaceText
    }
  }

  async canActivate(ctx: FineTuneItemContext): Promise<boolean> {
    if (!this.options.canActive) {
      return true;
    }

    return await this.options.canActive(ctx);
  }
  async up(ctx: FineTuneItemContext) {
    await this._replaceToken(ctx, true);
  }

  async down(ctx: FineTuneItemContext) {
    await this._replaceToken(ctx, false);
  }

  private async _replaceToken(ctx: FineTuneItemContext, isUp: boolean) {
    let token: string;
    let range: [number, number, number, number];

    // find token from current line
    if (typeof this.options.token === "function") {
      const match = this.options.token(ctx);
      if (!match) {
        return;
      }
      [token, range] = match;
    } else {
      const match = [...ctx.line.matchAll(this.options.token)].find((match) => {
        const startIndex = match.index!;
        if (startIndex <= ctx.col && ctx.col <= startIndex + match[0].length) {
          return true;
        } else {
          return false;
        }
      });

      if (!match) {
        return;
      }

      token = match[0];
      const start = match.index!;
      const end = start + token.length;
      const lineNumber = ctx.row;
      range = [lineNumber, start, lineNumber, end];
    }

    // check cache first 
    let targetReplacer:TokenReplacer | null = null

    if(this.cache.has(token)) {
      targetReplacer = this.cache.get(token)!
    }
    else {
      for (const replacer of this.options.replacers) {
        if (!replacer.canActive(token)) {
          continue;
        }
        targetReplacer = replacer
        this.cache.set(token, targetReplacer);
        break
      }
    }

    

    // match the first replacer
    if(!targetReplacer) {
      return
    }
    
    const replacedToken = isUp
      ? await targetReplacer.up(token)
      : await targetReplacer.down(token);
    await this.replaceText(replacedToken, ...range);
    return;
  }
}

export interface TokenReplacerOptions {
  token: TokenExtractPattern;
  replacers: TokenReplacer[];
  replaceText?: ReplaceTextFn; // function to replace the current word
  canActive?: (ctx: FineTuneItemContext) => Promise<boolean> | boolean;
}
export type TokenExtractPattern =
  | RegExp
  | ((
      ctx: FineTuneItemContext
    ) => [string, [number, number, number, number]] | null);

export interface TokenReplacer {
  canActive: (token: string) => Promise<boolean> | boolean;
  up(token: string): Promise<string> | string;
  down(token: string): Promise<string> | string;
}
