import { ReplaceTextFn } from "./FineTuneManager";

export interface FineTuneItem {
  canActivate?: (ctx:FineTuneItemContext) => Promise<boolean> | boolean;
  up:(ctx:FineTuneItemContext)=>(void | Promise<void>)
  down:(ctx:FineTuneItemContext)=>(void | Promise<void>)

  // will be injected by runtime
  replaceText?: ReplaceTextFn
}


export interface FineTuneItemContext {
  line: string
  col: number 
  row:number
  text: string
  filepath:string
}