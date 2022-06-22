import { FineTuneItem } from "./models/FineTuneItem";
import { FineTuneManager } from "./models/FineTuneManager";
import { FixListTokenReplacer, FixListTokenReplacerItem } from "./models/FixListTokenReplacer";
import { NumberTokenReplacer } from "./models/NumberTokenReplacer";
import { TokenReplacerItem, TokenReplacerOptions } from "./models/TokenReplacerItem";

export function fineTunes(... items:FineTuneItem[]):FineTuneManager {
  return new FineTuneManager(items)
}

export function tokenReplacer(option:Omit<TokenReplacerOptions,"replaceText">) : TokenReplacerItem{
  return new TokenReplacerItem(option)
}

export function listReplacer(... items:FixListTokenReplacerItem[]): FixListTokenReplacer {
  return new FixListTokenReplacer(items)
}

export function numberReplacer():NumberTokenReplacer {
  return new NumberTokenReplacer()
}