import { setupWorker } from "msw/browser";
import { handlers } from "./artistHandlers";
import { mypageHandlers } from "./mypageHandler";
import { myreviewHandlers } from "./myreviewHandler";

export const worker = setupWorker(...handlers, ...mypageHandlers, ...myreviewHandlers);
