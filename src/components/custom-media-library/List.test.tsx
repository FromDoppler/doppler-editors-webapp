import { render, screen } from "@testing-library/react";
import { List } from "./List";

describe(List.name, () => {
  it.each([
    {
      scenario: "an empty array",
      images: [],
    },
    {
      scenario: "an array with one item",
      images: [{ name: "name", url: "url" }],
    },
    {
      scenario: "an array with five items",
      images: [
        { name: "name1", url: "url1" },
        { name: "name2", url: "url2" },
        { name: "name3", url: "url3" },
        { name: "name4", url: "url4" },
        { name: "name5", url: "url5" },
      ],
    },
  ])(
    "should have an item by each image when images is {scenario}",
    ({ images }) => {
      // Act
      render(<List images={images} />);

      // Assert
      const list = screen.getByTestId("image-list");
      expect(list.childElementCount).toBe(images.length);
    }
  );
});
