import {render, screen} from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery.tsx";

describe("ProductImageGallery", () => {
    it("should render no images when the imageUrls array is empty", () => {
        const {container} = render(<ProductImageGallery imageUrls={[]}/>);

        expect(container).toBeEmptyDOMElement();
    });

    it("should render a list of images when the imageUrls array is non empty", () => {
        const imageUrls = [
            "http://example.com/image1.jpg",
            "http://example.com/image2.jpg"
        ];

        render(<ProductImageGallery imageUrls={imageUrls}/>);

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(imageUrls.length);

        imageUrls.forEach((url, i) => {
            expect(images[i]).toHaveAttribute('src', url);
        })
    });
});