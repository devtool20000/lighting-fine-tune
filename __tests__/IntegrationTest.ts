import { FineTuneManager } from "../lib/models/FineTuneManager";
import { MockTextEditor } from "../lib/test/MockTextEditor";
import {
  fineTunes,
  listReplacer,
  numberReplacer,
  tokenReplacer,
} from "../lib/index";

describe("TokenReplacer", () => {
  let mockEditor: MockTextEditor;
  let manager: FineTuneManager;

  beforeEach(() => {
    mockEditor = new MockTextEditor();
    manager = fineTunes(
      // an customize fine tune item
      {
        canActivate(ctx) {
          return ctx.line === "xx"
        },
        up(ctx) {
          this.replaceText!("up",1,0,1,ctx.line.length)
        },
        down(ctx) {
          this.replaceText!("down",1,0,1,ctx.line.length)
        },
      },
      // default catch all fine tune item
      tokenReplacer({
        token: /[^\b "`'.#@:\n ]+/g,
        replacers: [
          listReplacer(
            "text-xs",
            "text-sm",
            { abbr: "ts", value: "text-base" },
            "text-lg",
            "text-xl",
            "text-2xl",
            "text-3xl",
            "text-4xl"
          ),
          numberReplacer(),
        ],
      })
    );
    manager.replaceText = mockEditor.replaceText;
  });

  test('expanding padding', async ()=> { 
    const ctx = mockEditor.ctx("p-2$$")
      await manager.up(ctx)
      expect(mockEditor.line).toBe("p-3")
  })

  test('expanding text size', async ()=> { 
    const ctx = mockEditor.ctx("ts$$")
      await manager.up(ctx)
      expect(mockEditor.line).toBe("text-lg")
  })

  test('customize up and down', async ()=> { 
    const ctx = mockEditor.ctx("xx$$")
      await manager.up(ctx)
      expect(mockEditor.line).toBe("up")
  })
});
