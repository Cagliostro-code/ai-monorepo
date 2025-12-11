import { useRef, useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import { editorDefaultTemplate, EditorType } from "./consts";

const editor = ({
	style,
	onChange,
}: { style: React.CSSProperties; onChange?: (value: string) => void }) => {
	const monacoEl = useRef<HTMLDivElement>(null);
	const [monacoKey, setMonacoKey] = useState(0);
	const [monacoValue, setMonacoValue] = useState("");

	const editorButtons = [...Object.values(EditorType)];
	const [currentEditorType, setCurrentEditorType] = useState(
		EditorType.Typescript,
	);
	const [editor, setEditor] =
		useState<monaco.editor.IStandaloneCodeEditor | null>();

	useEffect(() => {
		const defaultType = EditorType.Typescript;

		setCurrentEditorType(defaultType);

		setEditor(() => {
			if (!monacoEl?.current) return null;
			const editor = monaco.editor.create(monacoEl.current, {
				value: editorDefaultTemplate[defaultType],
				language: defaultType,
				lineNumbers: "on",
			});
			setMonacoValue(editor.getValue());

			editor.onDidBlurEditorText(() => {
				editor?.getAction("editor.action.formatDocument")?.run();
				setMonacoValue(editor.getValue());
			});

			return editor;
		});

		return () => {
			const models = monaco.editor.getModels();
			for (const model of models) {
				model.dispose();
			}
			setMonacoKey(monacoKey + 1);
			setEditor(null);
		};
	}, [monacoKey]);

	useEffect(() => {
		if (onChange) {
			onChange(monacoValue);
		}
	}, [monacoValue, onChange]);

	function handleClick(key) {
		const currentModel = editor?.getModel();
		if (key !== currentEditorType && currentModel) {
			setCurrentEditorType(key);
			editor?.setValue(editorDefaultTemplate[key]);
			monaco.editor.setModelLanguage(currentModel, key);
		}
	}

	return (
		<div>
			{editorButtons.map((item) => (
				<button
					key={item}
					type="button"
					onClick={() => {
						handleClick(item);
					}}
				>
					{item}
				</button>
			))}
			<div key={monacoKey} ref={monacoEl} style={style} />
		</div>
	);
};

export default editor;
