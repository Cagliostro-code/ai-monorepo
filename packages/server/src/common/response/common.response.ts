import { HttpException, HttpStatus } from "@nestjs/common";

export const CommonExceptionEnum = {
	parameterInvalid: "00001",
	invalidUrl: "00002",
	requestFailed: "00003",
	externalRequestUnauthorized: "00004",
	externalRequestForbidden: "00005",
	externalRequestRateLimited: "00006",
	externalRequestUnavailable: "00007",
};

export class CommonException extends HttpException {
	code: string;

	constructor(message: string, code: string, status = HttpStatus.BAD_REQUEST) {
		super(
			{
				code,
				message,
				data: null,
			},
			status,
		);
		this.code = code;
	}

	static parameterInvalid(parameterName: string): CommonException {
		return new CommonException(
			`Parameter "${parameterName}" is invalid`,
			CommonExceptionEnum.parameterInvalid,
		);
	}

	static invalidUrl(url?: string) {
		return new CommonException(
			`Invalid URL: ${url || "unknown URL"}`,
			CommonExceptionEnum.invalidUrl,
		);
	}

	static requestFailed(message?: string) {
		return new CommonException(
			`Request failed: ${message || "unknown error"}`,
			CommonExceptionEnum.requestFailed,
		);
	}

	static externalRequestError(status?: number, message?: string) {
		if (status === HttpStatus.UNAUTHORIZED) {
			return new CommonException(
				message || "External service authentication failed",
				CommonExceptionEnum.externalRequestUnauthorized,
				HttpStatus.UNAUTHORIZED,
			);
		}

		if (status === HttpStatus.FORBIDDEN) {
			return new CommonException(
				message || "External service access denied",
				CommonExceptionEnum.externalRequestForbidden,
				HttpStatus.FORBIDDEN,
			);
		}

		if (status === HttpStatus.TOO_MANY_REQUESTS) {
			return new CommonException(
				message || "External service rate limit exceeded",
				CommonExceptionEnum.externalRequestRateLimited,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		return new CommonException(
			message || "External service request failed",
			CommonExceptionEnum.externalRequestUnavailable,
			status && status >= 400 && status < 600 ? status : HttpStatus.BAD_GATEWAY,
		);
	}
}

export class CommonSuccess {
	readonly success = true;
	readonly code = "00000";

	constructor(
		public message: string,
		public data?: unknown,
	) {}
}
