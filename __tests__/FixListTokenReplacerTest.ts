import { FixListTokenReplacer } from "../lib/models/FixListTokenReplacer";

describe("FixListTokenReplacer", () => {
  let replacer: FixListTokenReplacer;

  beforeEach(() => {
    replacer = new FixListTokenReplacer([
      "a",
      "b",
      "c",
      { abbr: "d", value: "dest" },
    ]);
  });

  test("can activate", () => {
    expect(replacer.canActive("a")).toBe(true)
  });

  test("can activate abbr", () => {
    expect(replacer.canActive("d")).toBe(true)
  });

  test("can activate abbr value", () => {
    expect(replacer.canActive("dest")).toBe(true)
  });

  test("can't unknown value", () => {
    expect(replacer.canActive("x")).toBe(false)
  });


  test("increase", () => {
    expect(replacer.up("a")).toBe("b")
  });

  test("increase to upper bound", () => {
    expect(replacer.up("d")).toBe("dest")
  });

  test("increase to upper bound but still expand", () => {
    expect(replacer.up("d")).toBe("dest")
  });

  test("decrease", () => {
    expect(replacer.down("b")).toBe("a")
  });

  test("decrease to lower bound", () => {
    expect(replacer.down("a")).toBe("a")
  });
});

describe('simulate FixListTokenReplacer in real case', ()=> { 

  let replacer: FixListTokenReplacer;

  beforeEach(() => {
    replacer = new FixListTokenReplacer([
      "text-xs",
      "text-sm",
      { abbr: "ts", value: "text-base" },
      "text-lg",
      "text-xl",
      "text-2xl",
      "text-3xl",
      "text-4xl",
    ]);
  });

  test('expand ts up', ()=> { 
    expect(replacer.canActive("ts")).toBe(true)
    expect(replacer.up("ts")).toBe("text-lg")
  })

  test('expand ts down', ()=> { 
    expect(replacer.canActive("ts")).toBe(true)
    expect(replacer.down("ts")).toBe("text-sm")
  })

  test('expand ts up down cache hit', ()=> { 
    expect(replacer.canActive("ts")).toBe(true)
    expect(replacer.down(replacer.up("ts") as string)).toBe("text-base")
  })
})
