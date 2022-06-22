import { FineTuneItem, FineTuneItemContext } from "./FineTuneItem";

export class FineTuneManager {
  // inject in runtime
  private _replaceText!:ReplaceTextFn 


  
  constructor(public fineTuneItems:FineTuneItem[]) {
    
  }

  set replaceText(fn:ReplaceTextFn) {
    this._replaceText = fn
    this.fineTuneItems.forEach(item=>{
      item.up.bind(item)
      item.down.bind(item)
      item.replaceText = this._replaceText
    })
  }

  async up(ctx:FineTuneItemContext):Promise<void> {
    await this._run(ctx,true)
  }

  async down(ctx:FineTuneItemContext):Promise<void> {
    await this._run(ctx,false)
  }

  async _run(ctx:FineTuneItemContext, isUp:boolean) : Promise<void> {
    for (const fineTuneItem of this.fineTuneItems) {
      if(await fineTuneItem.canActivate!(ctx)) {
        if(isUp) {
          await fineTuneItem.up(ctx)
        }
        else {
          await fineTuneItem.down(ctx)
        }
        return 
      }
    }
  }
}

export type ReplaceTextFn = ((
  text: string,
  startLine: number,
  startCol: number,
  endLine: number,
  endCol: number
) => Promise<void> | void)