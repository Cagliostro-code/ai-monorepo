import Editor from "@/components/editor";
import SandboxFrame from "@/components/sandbox/index";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { EditorType } from "@/components/editor/consts";

export const Route = createFileRoute("/monaco-editor/")({
	component: Index,
});

function Index() {
	const [codeStr, setCodeStr] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		console.log(codeStr);
	}, [codeStr]);

	function handleMessage(type: string, message: string) {
		console.log(type, message);
		setMessage(message);
	}

	return (
		<div className={styles.monacoEditor}>
			<EditorContainer type={EditorType.HTML} />
			<EditorContainer type={EditorType.Typescript} />
			<EditorContainer type={EditorType.CSS} />
			<div>
				<SandboxFrame codeStr={codeStr} onMessage={handleMessage} />
				<div>{message}</div>
			</div>
		</div>
	);
}

function EditorContainer({ type }: { type: EditorType }) {
	const [codeStr, setCodeStr] = useState("");

	useEffect(() => {
		console.log(codeStr);
	}, [codeStr]);

	return (
		<div>
			<span>{type}</span>
			<Editor
				style={{ height: "400px", width: "600px" }}
				onChange={setCodeStr}
			/>
		</div>
	);
}
