/// <reference types="monaco-editor" />

declare module "*.module.scss" {
	const classes: { [key: string]: string };
	export default classes;
}
