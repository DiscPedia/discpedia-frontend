import { setupWorker } from "msw/browser";
import { concertHandlers } from "./concert/handlers";

export const worker = setupWorker(...concertHandlers);
