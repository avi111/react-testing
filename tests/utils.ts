import {server} from "./mocks/server.ts";
import {delay, http, HttpResponse} from "msw";

export const simulateDelay = (endpoint: string) => {
    server.use(http.get(endpoint, async () => {
        await delay();
        return HttpResponse.json([]);
    }));
}

export const simulateError = (endpoint: string) => {
    server.use(http.get(endpoint, () => HttpResponse.error()));
}