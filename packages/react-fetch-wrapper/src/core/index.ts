import { ApiClient } from "./apiClient.js";

export const createApi = (baseUrl: string) => new ApiClient(baseUrl);
export { ApiClient };
