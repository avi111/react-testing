import {render, screen} from '@testing-library/react';
import {describe} from "vitest";
import AllProviders from "../AllProviders.tsx";
import {LanguageProvider} from "../../src/providers/language/LanguageProvider.tsx";
import Label from '../../src/components/Label.tsx';
import {Language} from "../../src/providers/language/type.ts";

describe('Label', () => {
    const renderComponent = (labelId: string, language: Language) => {
        render(<LanguageProvider language={language}>
            <Label labelId={labelId}/>
        </LanguageProvider>, {wrapper: AllProviders});
    }

    describe("given than the current language is English", () => {
        it.each([
            {
                labelId: "welcome",
                text: "Welcome"
            },
            {
                labelId: "new_product",
                text: "New Product"
            },
            {
                labelId: "edit_product",
                text: "Edit Product"
            }
        ])('should render $text for $labelId', ({labelId, text}) => {
            renderComponent(labelId, "en");
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    describe("given than the current language is Spanish", () => {
        it.each([
            {
                labelId: "welcome",
                text: "Bienvenidos"
            },
            {
                labelId: "new_product",
                text: "Nuevo Producto"
            },
            {
                labelId: "edit_product",
                text: "Editar Producto"
            }
        ])('should render $text for $labelId', ({labelId, text}) => {
            renderComponent(labelId, "es");
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it("should throw an error if the labelId is not found", () => {
        expect(() => renderComponent("!", "en")).toThrowError();
    });
});