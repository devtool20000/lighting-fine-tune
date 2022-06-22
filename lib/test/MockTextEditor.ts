import { FineTuneItemContext } from "../models/FineTuneItem"
// TODO: make a separate export for this
export class MockTextEditor {
  line:string = ""
  col:number = -1

  ctx(line:string,filepath:string = "",text=""): FineTuneItemContext{
    this.col = line.indexOf("$$")
    this.line = line.replace("$$","")
    return {
      col:this.col,
      filepath,
      line:this.line,
      row:1,
      text: text || this.line
    }
  }

  replaceText = (text:string, startLine:number, startCol:number, endLine:number, endCol:number) => {
    this.line = this.line.substring(0,startCol) + text + this.line.substring(endCol)
  }
}