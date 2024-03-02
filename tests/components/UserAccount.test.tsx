import {render, screen} from '@testing-library/react';
import UserAccount from "../../src/components/UserAccount.tsx";
import { User } from '../../src/entities.ts';

describe("UserAccount", () => {
    it("should render a user name", () => {
        const user:User = {
            id: 1,
            name: "Mosh",
            isAdmin: true
        }
        render(<UserAccount user={user}/>)

        expect(screen.getByText(user.name)).toBeInTheDocument();
    });

    it("should render an edit button when user in admin", () => {
        const user:User = {
            id: 1,
            name: "Mosh",
            isAdmin: true
        }
        render(<UserAccount user={user}/>)

        const button = screen.queryByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/edit/i);
    });

    it("should render no edit button when user in not admin", () => {
        const user:User = {
            id: 2,
            name: "Mosh",
            isAdmin: false
        }
        render(<UserAccount user={user}/>)

        const button = screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    });
});
