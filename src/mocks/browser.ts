import {setupWorker} from 'msw/browser'
import {handlers} from './artistHandlers'

export const worker = setupWorker(...handlers)
