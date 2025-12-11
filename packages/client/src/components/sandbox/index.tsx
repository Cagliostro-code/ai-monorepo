import { ConsoleMessageType } from "@/consts/sandbox";
import { useEffect } from "react";

const sandboxFrame = ({
	codeStr, // 用户输入的代码
	onMessage, // 接收来自 iframe 的消息回调
}: {
	codeStr: string;
	onMessage?: (type: string, message: string) => void;
}) => {
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const { type, message } = event.data;
			if (type) {
				onMessage?.(type, message);
			}
		};
		window.addEventListener("message", handleMessage);
	}, [onMessage]);

	const template = `<html>
      <body>
        <script>
          // 劫持 console
          const originalLog = console.log;
          console.log = function(...args) {
            window.parent.postMessage({ type: '${ConsoleMessageType.log}', message: args.join(' ') }, '*');
            originalLog.apply(console, args);
          };

          const originalWarn = console.warn;
          console.warn = function(...args) {
            window.parent.postMessage({ type: '${ConsoleMessageType.warn}', message: args.join(' ') }, '*');
            originalWarn.apply(console, args);
          };

          const originalError = console.error;
          console.error = function(...args) {
            window.parent.postMessage({ type: '${ConsoleMessageType.error}', message: args.join(' ') }, '*');
            originalError.apply(console, args);
          };

          const originalInfo = console.info;
          console.info = function(...args) {
            window.parent.postMessage({ type: '${ConsoleMessageType.info}', message: args.join(' ') }, '*');
            originalInfo.apply(console, args);
          };

          window.parent.postMessage({a:'123'},'*');

          // 执行用户代码
          try {
            ${codeStr}
          } catch (e) {
            window.parent.postMessage({ type: 'error', message: e.message }, '*');
          }
        </script>
      </body>
    </html>`;

	return <iframe title="monaco-js-display" srcDoc={template} />;
};

export default sandboxFrame;
