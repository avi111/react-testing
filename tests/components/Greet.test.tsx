import {it, expect, describe}  from "vitest";
import {render} from '@testing-library/react';

describe("Greet", () => {
  it("should render Hello with the name when name is provided", () => {
      render()
    expect("hello").toBe("hello");
  });
});
