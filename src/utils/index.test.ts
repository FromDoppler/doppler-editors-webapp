import { promisifyProps } from "./index";

describe(promisifyProps.name, () => {
  it("should add new property promisify-ing the old one", async () => {
    // Arrange
    const newPropName = "newProp";
    const oldPropName = "oldProp";
    const expectedResult = {};
    const originalFunction: (callback: (data: any) => void) => void = (
      callback: any
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
      callback: any
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
      callback: any
    ) => setTimeout(() => callback(expectedResultA), 0);
    const originalFunctionB: (callback: (data: any) => void) => void = (
      callback: any
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
