// 编辑器允许的语言类型
export enum EditorType {
	Typescript = "typescript",
	CSS = "css",
	HTML = "html",
	JSON = "json",
}
// 不同语言的基础模版
export const editorDefaultTemplate = {
	[EditorType.Typescript]: `function x() {
  console.log("Hello world!");
}
`,
	[EditorType.CSS]: `.class {
  color: #fff;
}
`,
	[EditorType.HTML]: `<div>
  <button>按钮</button>
</div>
`,
	[EditorType.JSON]: `{
  "key": "value"
}
`,
};
