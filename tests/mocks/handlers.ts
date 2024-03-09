import {db} from "./db.ts";

const handlers = [
    ...db.product.toHandlers('rest'),
    ...db.category.toHandlers('rest'),
]

export {handlers};