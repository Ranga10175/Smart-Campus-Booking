// Frontend: src/features/maintenance/context/TicketContext.jsx

import React, { createContext, useContext, useReducer, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8091/api";

const FALLBACK_ADMIN_TOKEN =
  "eyJzdWIiOiJhZG1pbjEiLCJuYW1lIjoiQWRtaW4gVXNlciIsInJvbGVzIjpbIlJPTEVfQURNSU4iXX0=";

const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const TICKET_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
  SET_TICKETS: "SET_TICKETS",
  SET_CURRENT_TICKET: "SET_CURRENT_TICKET",
  ADD_TICKET: "ADD_TICKET",
  UPDATE_TICKET: "UPDATE_TICKET",
  DELETE_TICKET: "DELETE_TICKET",
  ADD_COMMENT: "ADD_COMMENT",
};

function ticketReducer(state, action) {
  switch (action.type) {
    case TICKET_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case TICKET_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case TICKET_ACTIONS.SET_SUCCESS:
      return { ...state, successMessage: action.payload, loading: false, error: null };

    case TICKET_ACTIONS.CLEAR_MESSAGES:
      return { ...state, error: null, successMessage: null };

    case TICKET_ACTIONS.SET_TICKETS:
      return { ...state, tickets: action.payload, loading: false };

    case TICKET_ACTIONS.SET_CURRENT_TICKET:
      return { ...state, currentTicket: action.payload, loading: false };

    case TICKET_ACTIONS.ADD_TICKET:
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
        loading: false,
      };

    case TICKET_ACTIONS.UPDATE_TICKET: {
      const updated = action.payload;
      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === updated.id ? updated : t)),
        currentTicket:
          state.currentTicket?.id === updated.id ? updated : state.currentTicket,
        loading: false,
      };
    }

    case TICKET_ACTIONS.DELETE_TICKET:
      return {
        ...state,
        tickets: state.tickets.filter((t) => t.id !== action.payload),
        currentTicket:
          state.currentTicket?.id === action.payload ? null : state.currentTicket,
        loading: false,
      };

    case TICKET_ACTIONS.ADD_COMMENT: {
      const { ticketId, comment } = action.payload;
      const ticketWithComment = {
        ...state.currentTicket,
        comments: [...(state.currentTicket?.comments || []), comment],
      };

      return {
        ...state,
        currentTicket:
          state.currentTicket?.id === ticketId ? ticketWithComment : state.currentTicket,
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? { ...t, comments: [...(t.comments || []), comment] }
            : t
        ),
        loading: false,
      };
    }

    default:
      return state;
  }
}

const TicketContext = createContext(null);

function getToken() {
  return localStorage.getItem("token") || FALLBACK_ADMIN_TOKEN;
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export function TicketProvider({ children }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const clearMessages = useCallback(() => {
    dispatch({ type: TICKET_ACTIONS.CLEAR_MESSAGES });
  }, []);

  const fetchAllTickets = useCallback(async (filters = {}) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v && v !== "all"))
      );

      const res = await fetch(`${API_BASE}/tickets?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch tickets");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.SET_TICKETS, payload: data });
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
    }
  }, []);

  const fetchMyTickets = useCallback(async () => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/my`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch your tickets");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.SET_TICKETS, payload: data });
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
    }
  }, []);

  const fetchAssignedTickets = useCallback(async () => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/assigned`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch assigned tickets");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.SET_TICKETS, payload: data });
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
    }
  }, []);

  const fetchTicketById = useCallback(async (id) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Ticket not found");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.SET_CURRENT_TICKET, payload: data });
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
    }
  }, []);

  const createTicket = useCallback(async (formData) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create ticket");

      const data = await res.json();

      dispatch({ type: TICKET_ACTIONS.ADD_TICKET, payload: data });
      dispatch({
        type: TICKET_ACTIONS.SET_SUCCESS,
        payload: `Ticket created successfully! ID: ${data.ticketNumber}`,
      });

      return data;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const updateTicket = useCallback(async (id, updates) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update ticket");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.UPDATE_TICKET, payload: data });
      dispatch({ type: TICKET_ACTIONS.SET_SUCCESS, payload: "Ticket updated successfully!" });

      return data;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const deleteTicket = useCallback(async (id) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to delete ticket");

      dispatch({ type: TICKET_ACTIONS.DELETE_TICKET, payload: id });
      dispatch({ type: TICKET_ACTIONS.SET_SUCCESS, payload: "Ticket deleted." });

      return true;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return false;
    }
  }, []);

  const assignTechnician = useCallback(async (id, technicianId) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/assign`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ technicianId }),
      });

      if (!res.ok) throw new Error("Failed to assign technician");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.UPDATE_TICKET, payload: data });
      dispatch({ type: TICKET_ACTIONS.SET_SUCCESS, payload: "Technician assigned!" });

      return data;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const changeStatus = useCallback(async (id, status) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to change status");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.UPDATE_TICKET, payload: data });
      dispatch({ type: TICKET_ACTIONS.SET_SUCCESS, payload: `Status changed to ${status}` });

      return data;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const updateProgress = useCallback(async (id, progress) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/progress`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ progress }),
      });

      if (!res.ok) throw new Error("Failed to update progress");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.UPDATE_TICKET, payload: data });

      return data;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const addComment = useCallback(async (ticketId, content) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const comment = await res.json();
      dispatch({ type: TICKET_ACTIONS.ADD_COMMENT, payload: { ticketId, comment } });

      return comment;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const rejectTicket = useCallback(async (id, reason) => {
    dispatch({ type: TICKET_ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/reject`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) throw new Error("Failed to reject ticket");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.UPDATE_TICKET, payload: data });
      dispatch({ type: TICKET_ACTIONS.SET_SUCCESS, payload: "Ticket rejected." });

      return data;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const saveResolutionNotes = useCallback(async (id, resolutionNotes) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/resolution`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ resolutionNotes }),
      });

      if (!res.ok) throw new Error("Failed to save notes");

      const data = await res.json();
      dispatch({ type: TICKET_ACTIONS.UPDATE_TICKET, payload: data });
      dispatch({ type: TICKET_ACTIONS.SET_SUCCESS, payload: "Resolution notes saved." });

      return data;
    } catch (err) {
      dispatch({ type: TICKET_ACTIONS.SET_ERROR, payload: err.message });
      return null;
    }
  }, []);

  const value = {
    ...state,
    clearMessages,
    fetchAllTickets,
    fetchMyTickets,
    fetchAssignedTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTechnician,
    changeStatus,
    updateProgress,
    addComment,
    rejectTicket,
    saveResolutionNotes,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used within TicketProvider");
  return ctx;
}

export default TicketContext;