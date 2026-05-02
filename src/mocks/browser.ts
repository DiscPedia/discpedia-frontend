import { setupWorker } from "msw/browser";
import { handlers } from "./artistHandlers";
import { mypageHandlers } from "./mypageHandler";

export const worker = setupWorker(...handlers, ...mypageHandlers);
