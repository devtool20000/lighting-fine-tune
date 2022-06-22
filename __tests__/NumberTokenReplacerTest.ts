import { NumberTokenReplacer } from "../lib/models/NumberTokenReplacer";
describe('Number Token Replacer', ()=> { 
  let replacer:NumberTokenReplacer
  beforeEach(()=>{
    replacer = new NumberTokenReplacer()
  })
  test('number up', ()=> { 
    expect(replacer.canActive("12px")).toBe(true)
    expect(replacer.up("12px")).toBe("13px")
  })

  test('number down', ()=> { 
    expect(replacer.canActive("12px")).toBe(true)
    expect(replacer.down("12px")).toBe("11px")
  })

  test('number with other format', ()=> { 
    expect(replacer.canActive("p-[3px]")).toBe(true)
    expect(replacer.down("p-[3px]")).toBe("p-[2px]")
  })
})