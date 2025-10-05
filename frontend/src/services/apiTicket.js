const DEFAULT_API = "http://localhost:5000/api";

const API = DEFAULT_API;

export async function attemptLogin({ email, password }) {
  const result = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await result.json();

  if (typeof window !== "undefined" && data.status === "success") {
    // Perform localStorage operations only in the browser environment
    window.localStorage.setItem("isLoggedIn", true);
    window.localStorage.setItem("token", data.token);
  }

  return data;
}

export async function attemptFetchMe() {
  if (typeof window === "undefined") return;
  const token = window.localStorage.getItem("token");
  if (!token) {
    console.log("No token found, cannot fetch user details without token");
    return;
  }
  const result = await fetch(`${API}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  return result.json();
}

export async function attemptLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
  }
}
