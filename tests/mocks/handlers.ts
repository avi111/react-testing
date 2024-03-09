import {db} from "./db.ts";

const handlers = [
    ...db.product.toHandlers('rest'),
]

export {handlers};