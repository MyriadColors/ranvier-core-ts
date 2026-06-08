import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { CommandQueue, ICommandExecutable } from "../../src/CommandQueue";

describe("Command Queue", () => {
	let queue: CommandQueue;

	beforeEach(() => {
		queue = new CommandQueue();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("#enqueue", () => {
		it("should have a command in the queue", () => {
			const executable: ICommandExecutable = {
				execute: () => {},
				label: "test",
			};
			queue.enqueue(executable, 1);
			expect(queue.commands.length).toBe(1);
		});

		it("should execute the command", () => {
			let executed = false;
			const executable: ICommandExecutable = {
				execute: () => {
					executed = true;
				},
				label: "test",
			};
			queue.enqueue(executable, 1);
			queue.execute();
			expect(executed).toBe(true);
		});

		it("should have lag", () => {
			const lag = 2000;
			const executable: ICommandExecutable = {
				execute: () => {},
				label: "test",
			};
			queue.enqueue(executable, lag);
			queue.execute();
			expect(queue.lag).toBe(lag);
		});

		it("should obey lag", () => {
			const lag = 500;
			let executedB = false;
			const executableA: ICommandExecutable = {
				execute: () => {},
				label: "A",
			};
			const executableB: ICommandExecutable = {
				execute: () => {
					executedB = true;
				},
				label: "B",
			};
			queue.enqueue(executableA, lag);
			queue.enqueue(executableB, lag);

			const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1000);
			queue.execute();
			expect(queue.lag).toBe(lag);

			nowSpy.mockReturnValue(1200);
			expect(queue.execute()).toBe(false);

			nowSpy.mockReturnValue(1600);
			queue.execute();
			expect(executedB).toBe(true);
		});

		it("time to run is correct", () => {
			const lag = 500;
			const executableA: ICommandExecutable = {
				execute: () => {},
				label: "test",
			};
			queue.enqueue(executableA, lag);
			queue.enqueue(executableA, lag);
			queue.enqueue(executableA, lag);

			const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1000);
			expect(queue.msTilNextRun).toBe(0);
			expect(queue.getMsTilRun(0)).toBe(0);
			expect(queue.getMsTilRun(1)).toBe(lag);
			expect(queue.getMsTilRun(2)).toBe(lag * 2);

			queue.execute();
			expect(queue.msTilNextRun).toBe(lag);
			expect(queue.execute()).toBe(false);

			nowSpy.mockReturnValue(1500);
			expect(queue.msTilNextRun).toBe(0);
			expect(queue.execute()).toBe(true);

			expect(queue.msTilNextRun).toBe(lag);
			queue.addLag(200);
			expect(queue.msTilNextRun).toBe(lag + 200);

			queue.reset();
			expect(queue.msTilNextRun).toBe(0);
		});
	});
});
