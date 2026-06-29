export const isTransientServerActionError = (error: unknown) =>
  error instanceof Error && error.message.includes("unexpected response was received")

export const withServerActionRetry = async <T>(
  action: () => Promise<T>,
  retries = 2,
): Promise<T> => {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await action()
    } catch (error) {
      lastError = error
      if (!isTransientServerActionError(error) || attempt === retries) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
    }
  }

  throw lastError
}
