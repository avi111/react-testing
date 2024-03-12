import {factory, manyOf, oneOf, primaryKey} from '@mswjs/data'
import {faker} from '@faker-js/faker'
import {Category} from "../../src/entities.ts";

export const db = factory({
    product: {
        id: primaryKey(faker.number.int),
        name: faker.commerce.productName,
        price: () => faker.number.int({min: 1, max: 100}),
        categoryId: faker.number.int,
        category: oneOf("category")
    },
    category: {
        id: primaryKey(faker.number.int),
        name: faker.commerce.department,
        products: manyOf("product")
    }
})

export const getProductsByCategory = (category: Category) =>
    db.product.findMany({
        where: {
            categoryId: {
                equals: category.id
            }
        }
    })