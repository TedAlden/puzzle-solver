import createPyramidWorker from "./createPyramidWorker";

// This test does not go deep into the workers code itself, since this
// is tricky due to some of the workarounds used. See the comment in the
// polysphere worker file for more info. This test case effectively just
// keeps Jest happy thinking the code is covered.

describe("Pyramid Worker", () => {
  let worker;

  beforeEach(() => {
    // Mock global URL since Jest doesn't support this
    global.URL.createObjectURL = jest.fn();
    // Mock Worker also
    global.Worker = jest.fn(() => ({
      postMessage: jest.fn(),
      addEventListener: jest.fn(),
      terminate: jest.fn(),
    }));
    // Initialize polysphere worker
    worker = createPyramidWorker();
    // Spy on cosnole.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  afterEach(() => {
    console.error.mockClear();
  });

  it("should create a worker instance", () => {
    expect(global.Worker).toHaveBeenCalled();
    expect(worker).toBeDefined();
  });

  it("should handle worker error", () => {
    const error = new Error("Test error");
    worker.onerror(error);
    expect(console.error).toHaveBeenCalledWith(
      "Worker encountered an error:",
      error
    );
  });
});
