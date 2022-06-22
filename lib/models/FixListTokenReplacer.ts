import { FineTuneItem, FineTuneItemContext } from "./FineTuneItem";
import { TokenReplacer } from "./TokenReplacerItem";

export class FixListTokenReplacer implements TokenReplacer {
  private _token_index_cache: Map<string, number> = new Map();

  constructor(public list: FixListTokenReplacerItem[]) {
    list.forEach((item, i) => {
      if (typeof item === "string") {
        this._token_index_cache.set(item, i);
      } else {
        this._token_index_cache.set(item.abbr, i);
        this._token_index_cache.set(item.value, i);
      }
    });
  }

  canActive(token: string): boolean | Promise<boolean> {
    return this._token_index_cache.has(token);
  }

  up(token: string): string | Promise<string> {
    const index = this._findIndexFor(token);
    if (index === -1) {
      return token;
    }
    return this._getToken(index + 1, token);
  }
  down(token: string): string | Promise<string> {
    const index = this._findIndexFor(token);
    if (index === -1) {
      return token;
    }
    return this._getToken(index - 1, token);
  }

  private _getToken(index: number, originToken: string): string {
    if (index < 0) {
      index = 0;
    }
    if (index >= this.list.length) {
      index = this.list.length - 1;
    }

    const match = this.list[index];
    if (typeof match === "string") {
      return match;
    } else {
      return match.value;
    }
  }

  private _findIndexFor(token: string): number {
    if (!this._token_index_cache.has(token)) {
      return -1;
    } else {
      return this._token_index_cache.get(token)!;
    }
  }
}

export type FixListTokenReplacerItem = string | { abbr: string; value: string };
