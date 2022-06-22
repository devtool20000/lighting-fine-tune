import { FineTuneItem, FineTuneItemContext } from "./FineTuneItem";
import { TokenReplacer } from "./TokenReplacerItem";

const NUMBER_PATTERN = /(\d+)/
export class NumberTokenReplacer implements TokenReplacer {

  constructor() {
    
  }

  canActive(token: string): boolean | Promise<boolean> {
    return NUMBER_PATTERN.exec(token) !== null;
  }

  up(token: string): string | Promise<string> {
    return token.replace(NUMBER_PATTERN,(x,n)=>{
      return String(Number(n) + 1)
    });
  }
  down(token: string): string | Promise<string> {
    return token.replace(NUMBER_PATTERN,(x,n)=>{
      return String(Number(n) - 1)
    });
  }

}
