import { FineTuneItemContext } from "../lib/models/FineTuneItem"
import { FixListTokenReplacer } from "../lib/models/FixListTokenReplacer"
import { NumberTokenReplacer } from "../lib/models/NumberTokenReplacer"
import { TokenReplacerItem } from "../lib/models/TokenReplacerItem"
import { MockTextEditor } from "../lib/test/MockTextEditor"



describe('TokenReplacer', ()=> { 

  let mockEditor: MockTextEditor

  beforeEach(()=>{
    mockEditor = new MockTextEditor()
  })

  describe('single replacer', ()=> { 

    let replacer: TokenReplacerItem

    beforeEach(()=>{
      replacer = new TokenReplacerItem({
        token:/[^\b "`'.#@:\n ]+/g,
        replacers:[
          new NumberTokenReplacer()
        ],
        replaceText:mockEditor.replaceText,
      })
    })

    test('default canActivate should be true', async ()=> { 
      const ctx = mockEditor.ctx("p-2$$")
      const canActive = await replacer.canActivate(ctx)
      expect(canActive).toBe(true)
    })

    test('add canActivate to override original canActive', async ()=> { 
      replacer = new TokenReplacerItem({
        token:/[^\b "`'.#@:\n ]+/g,
        replacers:[
          new NumberTokenReplacer()
        ],
        replaceText:mockEditor.replaceText,
        canActive(ctx) {
          return false
        },
      })
      const ctx = mockEditor.ctx("p-2$$")
      const canActive = await replacer.canActivate(ctx)
      expect(canActive).toBe(false)
    })

    test('up at the end', async ()=> { 
      const ctx = mockEditor.ctx("p-2$$")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("p-3")
    })

    test('up at the middle', async ()=> { 
      const ctx = mockEditor.ctx("p$$-2")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("p-3")
    })

    test('up at the begin', async ()=> { 
      const ctx = mockEditor.ctx("$$p-2")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("p-3")
    })

    test('up at the end in long text', async ()=> { 
      const ctx = mockEditor.ctx("a p-2$$ b")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("a p-3 b")
    })

    test('up at the middle in long text', async ()=> { 
      const ctx = mockEditor.ctx("a p$$-2 b")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("a p-3 b")
    })

    test('up at the begin in long text', async ()=> { 
      const ctx = mockEditor.ctx("a $$p-2 b")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("a p-3 b")
    })

    test('cache', async ()=> { 
      const ctx = mockEditor.ctx("a $$p-2 b")
      await replacer.up(ctx)
      expect((replacer as any).cache.size).toBe(1)
      const ctx2 = mockEditor.ctx("a $$p-2 b")
      await replacer.up(ctx2)      
    })

  })

  describe('multiple replacers', ()=> { 

    let replacer: TokenReplacerItem

    beforeEach(()=>{
      replacer = new TokenReplacerItem({
        token:/[^\b "`'.#@:\n ]+/g,
        replacers:[
          new FixListTokenReplacer([
            "text-xs",
            "text-sm",
            { abbr: "ts", value: "text-base" },
            "text-lg",
            "text-xl",
            "text-2xl",
            "text-3xl",
            "text-4xl",
          ]),
          new NumberTokenReplacer()
        ],
        replaceText:mockEditor.replaceText,
      })
    })

    test('up number', async ()=> { 
      const ctx = mockEditor.ctx("a p$$-2 fs")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("a p-3 fs")
    })

    test('up font size', async ()=> { 
      const ctx = mockEditor.ctx("a p-2 ts$$")
      await replacer.up(ctx)
      expect(mockEditor.line).toBe("a p-2 text-lg")
    })

    test('down number', async ()=> { 
      const ctx = mockEditor.ctx("a p$$-2 fs")
      await replacer.down(ctx)
      expect(mockEditor.line).toBe("a p-1 fs")
    })

    test('down font size', async ()=> { 
      const ctx = mockEditor.ctx("a p-2 ts$$")
      await replacer.down(ctx)
      expect(mockEditor.line).toBe("a p-2 text-sm")
    })
  })
  
})