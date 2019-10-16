window.System = {
  import: jest.fn().mockRejectedValue(new Error("Async error")),
  resolve: jest.fn(),
  register: jest.fn()
};
