const getAuthHeaders = (includeContentType = true): HeadersInit => {
  const stored = localStorage.getItem("auth");
  const token = stored ? JSON.parse(stored).token : null;
  return {
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const http = {
  get: (url: string) => fetch(url, { headers: getAuthHeaders(false) }),

  post: (url: string, body: unknown) =>
    fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }),

  put: (url: string, body: unknown) =>
    fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }),

  delete: (url: string) =>
    fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(false), // No enviar Content-Type en DELETE
    }),

  postForm: (url: string, body: FormData) => {
    const stored = localStorage.getItem("auth");
    const token = stored ? JSON.parse(stored).token : null;
    return fetch(url, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // no agregar Content-Type
      },
      body,
    });
  },
  putForm: (url: string, body: FormData) => {
    const stored = localStorage.getItem("auth");
    const token = stored ? JSON.parse(stored).token : null;
    return fetch(url, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // sin Content-Type, igual que postForm
      },
      body,
    });
  },
};
