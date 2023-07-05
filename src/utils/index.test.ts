import {
  promisifyProps,
  isDefined,
  spliceBy,
  nameComparison,
  takeOneValue,
} from "./index";

describe(promisifyProps.name, () => {
  it("should add new property promisify-ing the old one", async () => {
    // Arrange
    const newPropName = "newProp";
    const oldPropName = "oldProp";
    const expectedResult = {};
    const originalFunction: (callback: (data: any) => void) => void = (
      callback: any,
    ) => setTimeout(() => callback(expectedResult), 0);
    const obj: any = {
      [oldPropName]: originalFunction,
    };

    // Act
    const newObj = promisifyProps<any>(obj, {
      [newPropName]: oldPropName,
    });

    // Assert
    expect(newObj).toBe(obj);
    expect(newObj).toHaveProperty(newPropName);
    expect(newObj).toHaveProperty(oldPropName);
    const result = await newObj[newPropName]();
    expect(result).toBe(expectedResult);
  });

  it("should not modify object when original property does not exist", () => {
    // Arrange
    const obj = {};
    const newPropName = "newProp";
    const oldPropName = "oldProp";
    expect(obj).not.toHaveProperty(oldPropName);

    // Act
    const newObj = promisifyProps(obj, { [newPropName]: oldPropName });

    // Assert
    expect(newObj).toBe(obj);
    expect(newObj).not.toHaveProperty(newPropName);
  });

  it("should not modify new property when it already exist", async () => {
    // Arrange
    const existingValue = {};
    const newPropName = "newProp";
    const oldPropName = "oldProp";
    const originalFunction: (callback: (data: any) => void) => void = (
      callback: any,
    ) => setTimeout(() => callback({}), 0);
    const obj: any = {
      [oldPropName]: originalFunction,
      [newPropName]: existingValue,
    };

    // Act
    const newObj = promisifyProps<any>(obj, { [newPropName]: oldPropName });

    // Assert
    expect(newObj).toBe(obj);
    expect(newObj[newPropName]).toBe(existingValue);
  });

  it("should add new properties promisify-ing the old ones", async () => {
    // Arrange
    const newPropNameA1 = "newPropA1";
    const newPropNameA2 = "newPropA2";
    const newPropNameB = "newPropB";
    const oldPropNameA = "oldPropA";
    const oldPropNameB = "oldPropB";
    const expectedResultA = {};
    const expectedResultB = {};
    const originalFunctionA: (callback: (data: any) => void) => void = (
      callback: any,
    ) => setTimeout(() => callback(expectedResultA), 0);
    const originalFunctionB: (callback: (data: any) => void) => void = (
      callback: any,
    ) => setTimeout(() => callback(expectedResultB), 0);
    const obj: any = {
      [oldPropNameA]: originalFunctionA,
      [oldPropNameB]: originalFunctionB,
    };

    // Act
    const newObj = promisifyProps<any>(obj, {
      [newPropNameA1]: oldPropNameA,
      [newPropNameA2]: oldPropNameA,
      [newPropNameB]: oldPropNameB,
    });

    // Assert
    expect(newObj).toBe(obj);
    expect(newObj).toHaveProperty(newPropNameA1);
    expect(newObj).toHaveProperty(newPropNameA2);
    expect(newObj).toHaveProperty(oldPropNameA);
    expect(newObj).toHaveProperty(oldPropNameB);
    const resultA1 = await newObj[newPropNameA1]();
    expect(resultA1).toBe(expectedResultA);
    const resultA2 = await newObj[newPropNameA2]();
    expect(resultA2).toBe(expectedResultA);
    const resultB = await newObj[newPropNameB]();
    expect(resultB).toBe(expectedResultB);
  });
});

describe(isDefined.name, () => {
  it.each([
    {
      scenario: "an object",
      input: { example: true },
      expected: true,
    },
    {
      scenario: "empty object",
      input: {},
      expected: true,
    },
    {
      scenario: "an array",
      input: [1, 2, 3],
      expected: true,
    },
    {
      scenario: "empty array",
      input: [],
      expected: true,
    },
    {
      scenario: "a string",
      input: "Hello!",
      expected: true,
    },
    {
      scenario: "empty string",
      input: "",
      expected: true,
    },
    {
      scenario: "null",
      input: null,
      expected: true,
    },
    {
      scenario: "a number",
      input: 123,
      expected: true,
    },
    {
      scenario: "0",
      input: 0,
      expected: true,
    },
    {
      scenario: "NaN",
      input: NaN,
      expected: true,
    },
    {
      scenario: "undefined",
      input: undefined,
      expected: false,
    },
    {
      scenario: "really undefined",
      expected: false,
    },
  ])(
    "should return $expected when input is $scenario",
    ({ input, expected }) => {
      // Act
      const result = isDefined(input);

      // Assert
      expect(result).toBe(expected);
    },
  );
});

describe(spliceBy, () => {
  it.each([
    {
      scenario: "item is in the middle of the array",
      array: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }],
      predicate: (x: any) => x.i === 2,
      expected: "take an item and remove it from the array",
      expectedResult: { i: 2 },
      expectedArray: [{ i: 0 }, { i: 1 }, { i: 3 }],
    },
    {
      scenario: "item is at the beginning of the array",
      array: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }],
      predicate: (x: any) => x.i === 0,
      expected: "take an item and remove it from the array",
      expectedResult: { i: 0 },
      expectedArray: [{ i: 1 }, { i: 2 }, { i: 3 }],
    },
    {
      scenario: "item is at the end of the array",
      array: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }],
      predicate: (x: any) => x.i === 3,
      expected: "take an item and remove it from the array",
      expectedResult: { i: 3 },
      expectedArray: [{ i: 0 }, { i: 1 }, { i: 2 }],
    },
    {
      scenario: "item is not in the array",
      array: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }],
      predicate: (x: any) => x.i === 4,
      expected: "return undefined and keep the array as it was",
      expectedResult: undefined,
      expectedArray: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }],
    },
  ])(
    "should $expected when $scenario",
    ({ array, predicate, expectedResult, expectedArray }) => {
      // Act
      const result = spliceBy(array, predicate);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(array).toEqual(expectedArray);
    },
  );
});

describe(nameComparison.name, () => {
  it.each([
    {
      scenario: "both names are equal",
      a: { name: "x" },
      b: { name: "x" },
      expected: 0,
    },
    {
      scenario: "b's name is greater than a's name",
      a: { name: "a" },
      b: { name: "b" },
      expected: -1,
    },
    {
      scenario: "a's name is greater than b's name",
      a: { name: "2" },
      b: { name: "1" },
      expected: 1,
    },
    {
      scenario: "a's name is greater than b's name and they are numbers",
      a: { name: 2 },
      b: { name: 1 },
      expected: 1,
    },
    {
      scenario: "a is null and b has a valid string",
      a: null,
      b: { name: 1 },
      expected: -1,
    },
    {
      scenario: "a's name is null and b has a valid string",
      a: { name: null },
      b: { name: 1 },
      expected: -1,
    },
    {
      scenario: "a's name is a valid name and b is null",
      a: { name: 1 },
      b: null,
      expected: 1,
    },
    {
      scenario: "both a and b are null",
      a: null,
      b: null,
      expected: 0,
    },
    {
      scenario: "a is null and b's name is null",
      a: null,
      b: { name: null },
      expected: 0,
    },
  ])(
    "should compare two objects based on name property when $scenario",
    ({ a, b, expected }) => {
      // Act
      const result = nameComparison(a as any, b as any);

      // Assert
      expect(result).toBe(expected);
    },
  );
});

describe(takeOneValue.name, () => {
  it.each<{
    collectionType: string;
    collection: { values: () => IterableIterator<any> };
  }>([
    {
      collectionType: Map.name,
      collection: new Map(),
    },
    {
      collectionType: Set.name,
      collection: new Set(),
    },
    {
      collectionType: Array.name,
      collection: [],
    },
  ])(
    "should return undefined when collection $collectionType is empty",
    ({ collection }) => {
      // Act
      const result = takeOneValue(collection);

      // Assert
      expect(result).toBeUndefined();
    },
  );

  it.each<{
    collectionType: string;
    collection: { values: () => IterableIterator<any> };
  }>([
    {
      collectionType: Map.name,
      collection: new Map([
        [5, 999],
        [1, 111],
      ]),
    },
    {
      collectionType: Set.name,
      collection: new Set([999, 111]),
    },
    {
      collectionType: Array.name,
      collection: [999, 111],
    },
  ])(
    "should return first value when collection $collectionType is not empty",
    ({ collection }) => {
      // Act
      const result = takeOneValue(collection);

      // Assert
      expect(result).toBe(999);
    },
  );
});
