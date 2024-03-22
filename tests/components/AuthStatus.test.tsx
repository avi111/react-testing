import { render, screen } from '@testing-library/react';

import AuthStatus from '../../src/components/AuthStatus';
import {mockAuthState} from "../utils.tsx";

describe('AuthStatus', () => {
    it('should render the loading message while fetching the auth status', () => {
        mockAuthState({isLoading: true, isAuthenticated: false, user: undefined});
        render(<AuthStatus />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render the user name and logout button when authenticated', () => {
        mockAuthState({isLoading: false, isAuthenticated: true, user: {name: "Test User"}});
        render(<AuthStatus />);
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /Log out/i})).toBeInTheDocument();
        expect(screen.queryByRole("button", {name: /Log in/i})).not.toBeInTheDocument();
    });

    it('should render the login button when not authenticated', () => {
        mockAuthState({isLoading: false, isAuthenticated: false, user: undefined});
        render(<AuthStatus />);
        expect(screen.getByRole("button", {name: /Log in/i})).toBeInTheDocument();
        expect(screen.queryByRole("button", {name: /Log out/i})).not.toBeInTheDocument();
    });

});