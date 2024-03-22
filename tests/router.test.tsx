import {screen} from '@testing-library/react';
import {navigateTo} from "./utils.tsx";

describe('Router', () => {
    const tests = {
        'Home': '/',
        'Products': '/products',
    }

    it.each(Object.entries(tests))('should render the %s page for %s', (name, path) => {
        navigateTo(path);
        expect(screen.getByRole("heading", {name: new RegExp(name, 'i')})).toBeInTheDocument();
    });
});