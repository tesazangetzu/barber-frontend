const API_URL = import.meta.env.PUBLIC_API_BASE;

function getAuthToken() {
  if (typeof window !== "undefined") {
    const admin = localStorage.getItem("admin");
    const barber = localStorage.getItem("barber");
    const data = admin ? JSON.parse(admin) : barber ? JSON.parse(barber) : null;
    return data?.access_token;
  }
  return null;
}

function getHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Barbers
export async function getBarbers() {
  try {
    const res = await fetch(`${API_URL}/barbers`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch barbers");
    return await res.json();
  } catch (error) {
    console.error("Error fetching barbers:", error);
    return [];
  }
}

export async function createBarber(data) {
  try {
    const res = await fetch(`${API_URL}/barbers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create barber");
    return await res.json();
  } catch (error) {
    console.error("Error creating barber:", error);
    throw error;
  }
}

export async function updateBarber(id, data) {
  try {
    const res = await fetch(`${API_URL}/barbers/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update barber");
    return await res.json();
  } catch (error) {
    console.error("Error updating barber:", error);
    throw error;
  }
}

export async function deleteBarber(id) {
  try {
    const res = await fetch(`${API_URL}/barbers/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete barber");
    return true;
  } catch (error) {
    console.error("Error deleting barber:", error);
    throw error;
  }
}

// Services
export async function getServices() {
  try {
    const res = await fetch(`${API_URL}/services`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch services");
    return await res.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function createService(data) {
  try {
    const res = await fetch(`${API_URL}/services`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create service");
    return await res.json();
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(id, data) {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update service");
    return await res.json();
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function deleteService(id) {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete service");
    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

// Schedules
export async function getSchedules() {
  try {
    const res = await fetch(`${API_URL}/schedules`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch schedules");
    return await res.json();
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
}

export async function createSchedule(data) {
  try {
    const res = await fetch(`${API_URL}/schedules`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create schedule");
    return await res.json();
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
}

export async function updateSchedule(id, data) {
  try {
    const res = await fetch(`${API_URL}/schedules/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update schedule");
    return await res.json();
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
}

export async function deleteSchedule(id) {
  try {
    const res = await fetch(`${API_URL}/schedules/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete schedule");
    return true;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
}

// Appointments
export async function getAppointments() {
  try {
    const res = await fetch(`${API_URL}/appointments`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch appointments");
    return await res.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}
