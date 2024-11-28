import {
  normaliseShape,
  normaliseShape3D,
  rotateShapeCCW,
  rotateShapeX,
  rotateShapeY,
  rotateShapeZ,
  flipShapeHorizontal,
  flipShapeX,
  flipShapeY,
  flipShapeZ,
  createBoard2D,
  createBoardPyramid,
} from "./utils";

describe("normaliseShape", () => {
  test("should normalize shape coordinates", () => {
    expect(
      normaliseShape([
        [1, 2],
        [3, 4],
      ])
    ).toEqual([
      [0, 0],
      [2, 2],
    ]);
  });

  test("should handle empty array", () => {
    expect(normaliseShape([])).toEqual([]);
  });
});

describe("normaliseShape3D", () => {
  test("should normalize 3D shape coordinates", () => {
    expect(
      normaliseShape3D([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [0, 0, 0],
      [3, 3, 3],
    ]);
  });

  test("should handle empty array", () => {
    expect(normaliseShape3D([])).toEqual([]);
  });
});

describe("rotateShapeCCW", () => {
  test("should rotate shape coordinates 90 degrees counter-clockwise", () => {
    expect(
      rotateShapeCCW([
        [1, 2],
        [3, 4],
      ])
    ).toEqual([
      [2, -1],
      [4, -3],
    ]);
  });

  test("should handle empty array", () => {
    expect(rotateShapeCCW([])).toEqual([]);
  });
});

describe("rotateShapeX", () => {
  test("should rotate 3D shape coordinates 60 degrees about the X axis", () => {
    expect(
      rotateShapeX([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [1, -3, 5],
      [4, -6, 11],
    ]);
  });

  test("should handle empty array", () => {
    expect(rotateShapeX([])).toEqual([]);
  });
});

describe("rotateShapeY", () => {
  test("should rotate 3D shape coordinates 90 degrees about the Y axis", () => {
    expect(
      rotateShapeY([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [3, 2, -1],
      [6, 5, -4],
    ]);
  });

  test("should handle empty array", () => {
    expect(rotateShapeY([])).toEqual([]);
  });
});

describe("rotateShapeZ", () => {
  test("should rotate 3D shape coordinates 60 degrees about the Z axis", () => {
    expect(
      rotateShapeZ([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [-2, 3, 3],
      [-5, 9, 6],
    ]);
  });

  test("should handle empty array", () => {
    expect(rotateShapeZ([])).toEqual([]);
  });
});

describe("flipShapeHorizontal", () => {
  test("should flip shape coordinates horizontally", () => {
    expect(
      flipShapeHorizontal([
        [1, 2],
        [3, 4],
      ])
    ).toEqual([
      [-1, 2],
      [-3, 4],
    ]);
  });

  test("should handle empty array", () => {
    expect(flipShapeHorizontal([])).toEqual([]);
  });
});

describe("flipShapeX", () => {
  test("should flip 3D shape coordinates along the X axis", () => {
    expect(
      flipShapeX([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [-1, 2, 3],
      [-4, 5, 6],
    ]);
  });

  test("should handle empty array", () => {
    expect(flipShapeX([])).toEqual([]);
  });
});

describe("flipShapeY", () => {
  test("should flip 3D shape coordinates along the Y axis", () => {
    expect(
      flipShapeY([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [1, -2, 3],
      [4, -5, 6],
    ]);
  });

  test("should handle empty array", () => {
    expect(flipShapeY([])).toEqual([]);
  });
});

describe("flipShapeZ", () => {
  test("should flip 3D shape coordinates along the Z axis", () => {
    expect(
      flipShapeZ([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [1, 2, -3],
      [4, 5, -6],
    ]);
  });

  test("should handle empty array", () => {
    expect(flipShapeZ([])).toEqual([]);
  });
});

describe("createBoard2D", () => {
  test("should create a 2D board with specified dimensions and value", () => {
    expect(createBoard2D(2, 3, 0)).toEqual([
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
  });

  test("should handle zero dimensions", () => {
    expect(createBoard2D(0, 0, 0)).toEqual([]);
  });
});

describe("createBoardPyramid", () => {
  test("should create a 3D pyramid board with specified size and value", () => {
    expect(createBoardPyramid(3, 0)).toEqual([
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      [
        [0, 0],
        [0, 0],
      ],
      [[0]],
    ]);
  });

  test("should handle zero size", () => {
    expect(createBoardPyramid(0, 0)).toEqual([]);
  });
});
