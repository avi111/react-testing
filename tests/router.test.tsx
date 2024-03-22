import {screen} from '@testing-library/react';
import {navigateTo} from "./utils.tsx";
import {Product} from "../src/entities.ts";
import {db} from "./mocks/db.ts";
import {afterAll, beforeAll} from "vitest";

describe('Router', () => {
    let product: Product;
    beforeAll(() => {
        product = db.product.create({id: 1, name: 'Product 1', price: 100});
    })

    afterAll(() => {
        db.product.delete({where: {id: {equals: product.id}}});
    });

    const tests = {
        'Home': '/',
        'Products': '/products',
    }

    it.each(Object.entries(tests))('should render the %s page for %s', (name, path) => {
        navigateTo(path);
        expect(screen.getByRole("heading", {name: new RegExp(name, 'i')})).toBeInTheDocument();
    });

    it('should render the product detail page for /products/:id', async () => {
        navigateTo('/products/1');
        expect(await screen.findByRole("heading", {name: product.name})).toBeInTheDocument();
    });

    it("should render ErrorPage when invalid path", () => {
        navigateTo('/invalid-path');
        expect(screen.getByRole("heading", {name: /oops/i})).toBeInTheDocument();
    })

    it('should render the admin homepage for /admin', () => {
        navigateTo('/admin');
        expect(screen.getByRole("heading", {name: /admin/i})).toBeInTheDocument();
    });
});