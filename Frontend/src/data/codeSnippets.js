// Decorative "leaky code" fragments. Each snippet is a small, hand-tokenized
// block from the languages/stacks actually used across the resume/projects.
// Tokens map to the .tok-* classes defined in index.css.

const kw = (t) => ({ t, c: "tok-kw" });
const str = (t) => ({ t, c: "tok-str" });
const fn = (t) => ({ t, c: "tok-fn" });
const com = (t) => ({ t, c: "tok-com" });
const num = (t) => ({ t, c: "tok-num" });
const tag = (t) => ({ t, c: "tok-tag" });
const plain = (t) => ({ t, c: "" });

export const codeSnippets = [
  {
    lang: "javascript",
    lines: [
      [kw("const"), plain(" stack "), plain("= "), plain("["), str('"React"'), plain(", "), str('"Node"'), plain(", "), str('"Mongo"'), plain("];")],
      [kw("export"), plain(" "), kw("default"), plain(" "), fn("function"), plain(" "), fn("App"), plain("() {")],
      [plain("  "), kw("return"), plain(" "), fn("build"), plain("(stack);")],
      [plain("}")],
    ],
  },
  {
    lang: "python",
    lines: [
      [kw("def"), plain(" "), fn("deploy"), plain("(app):")],
      [plain("    "), com("# ship it")],
      [plain("    "), kw("return"), plain(" "), fn("fastapi"), plain(".run(app)")],
    ],
  },
  {
    lang: "java",
    lines: [
      [kw("public"), plain(" "), kw("class"), plain(" "), fn("Server"), plain(" {")],
      [plain("  "), kw("void"), plain(" "), fn("start"), plain("() {")],
      [plain("    "), fn("SpringApplication"), plain(".run();")],
      [plain("  }")],
      [plain("}")],
    ],
  },
  {
    lang: "typescript",
    lines: [
      [kw("interface"), plain(" "), fn("Project"), plain(" {")],
      [plain("  title: "), kw("string"), plain(";")],
      [plain("  stack: "), kw("string"), plain("[];")],
      [plain("}")],
    ],
  },
  {
    lang: "c++",
    lines: [
      [plain("#include "), tag("<iostream>")],
      [kw("int"), plain(" "), fn("main"), plain("() {")],
      [plain("  std::cout << "), str('"hello"'), plain(";")],
      [plain("}")],
    ],
  },
  {
    lang: "go",
    lines: [
      [kw("func"), plain(" "), fn("main"), plain("() {")],
      [plain("  "), fn("fmt"), plain(".Println("), str('"shipping"'), plain(")")],
      [plain("}")],
    ],
  },
  {
    lang: "bash",
    lines: [
      [plain("$ "), fn("docker"), plain(" build -t "), str("portfolio"), plain(" .")],
      [plain("$ "), fn("git"), plain(" push origin "), str("main")],
    ],
  },
  {
    lang: "html",
    lines: [
      [tag("<section"), plain(" "), plain('id='), str('"projects"'), tag(">")],
      [plain("  "), tag("<Card />")],
      [tag("</section>")],
    ],
  },
  {
    lang: "sql",
    lines: [
      [kw("SELECT"), plain(" * "), kw("FROM"), plain(" "), fn("skills")],
      [kw("WHERE"), plain(" proficiency > "), num("70"), plain(";")],
    ],
  },
  {
    lang: "json",
    lines: [
      [plain("{ "), tag('"role"'), plain(": "), str('"Full Stack Dev"'), plain(" }")],
    ],
  },
];

export function getRandomSnippets(count, seed = 0) {
  const list = [...codeSnippets];
  // simple deterministic shuffle so SSR/CSR (if ever added) stay in sync
  for (let i = list.length - 1; i > 0; i--) {
    const j = (i + seed * 7) % (i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, count);
}
