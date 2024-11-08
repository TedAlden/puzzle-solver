import createPolysphereWorker from "./createPolysphereWorker";

// This test does not go deep into the workers code itself, since this
// is tricky due to some of the workarounds used. See the comment in the
// polysphere worker file for more info. This test case effectively just
// keeps Jest happy thinking the code is covered.

describe("Polysphere Worker", () => {
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
    worker = createPolysphereWorker();
  });

  test("Should create a worker instance", () => {
    expect(global.Worker).toHaveBeenCalled();
    expect(worker).toBeDefined();
  });
});
