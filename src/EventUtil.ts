import { StreamType } from "./TransportStream";

import sty from "sty";

export type EventUtilReturn = (message: string) => void;

/**
 * Helper methods for colored output during input-events
 */
export class EventUtil {
	/**
	 * Generate a function for writing colored output to a socket
	 * @param {net.Socket} socket
	 * @return {function (string)}
	 */
	static genWrite(socket: StreamType | null): EventUtilReturn {
		return socket
			? (message: string) => socket.write(sty.parse(message))
			: () => {};
	}

	/**
	 * Generate a function for writing colored output to a socket with a newline
	 * @param {net.Socket} socket
	 * @return {function (string)}
	 */
	static genSay(socket: StreamType | null): EventUtilReturn {
		return socket
			? (message: string) => socket.write(sty.parse(message + "\r\n"))
			: () => {};
	}
}
