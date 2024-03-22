import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import CategoryList from "../../src/components/CategoryList.tsx";
import {Category} from "../../src/entities.ts";
import {afterAll, beforeAll} from "vitest";
import {db} from "../mocks/db.ts";
import ReduxProvider from "../../src/providers/ReduxProvider.tsx";
import {simulateDelay, simulateError} from "../utils.ts";

describe('CategoryList', () => {
    const categories: Category[] = [];

    beforeAll(() => {
        [1, 2].forEach(() => {
            const category = db.category.create();
            categories.push(category);
        });
    });

    afterAll(() => {
        db.category.deleteMany({
            where: {
                id: {
                    in: categories.map((category) => category.id),
                },
            },
        });
    });

    const renderComponent = () => {
        render(<ReduxProvider><CategoryList/></ReduxProvider>);

        const getCategoryList = () => screen.getByText("Category List");

        return {
            getCategoryList
        }
    };

    it('should render the Category List', async () => {
        renderComponent();

        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

        categories.forEach((category) => {
            expect(screen.getByText(category.name)).toBeInTheDocument();
        });
    });

    it('should render a loading message', () => {
        simulateDelay("/categories");

        renderComponent();

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render an error message', async () => {
        simulateError("/categories");

        renderComponent();

        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

        expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
});