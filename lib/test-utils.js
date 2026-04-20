// Jest mock for @google/generative-ai
export const mockGemini = () => {
  return {
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => "Mocked AI Response"
        }
      })
    })
  };
};

/**
 * Helper to mock a successful Fetch response
 */
export const mockFetchSuccess = (data) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(data)
  });
};

/**
 * Helper to mock a failed Fetch response
 */
export const mockFetchError = (status = 500, message = 'Internal Server Error') => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: jest.fn().mockResolvedValue({ error: message })
  });
};
