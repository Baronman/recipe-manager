export const ui = {
  page: {
    maxWidth: 980,
    margin: "0 auto",
    padding: 24,
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    color: "#111",
  },
  card: {
    border: "1px solid #e6e6e6",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    transition: "transform 0.1s, box-shadow 0.1s",
  },
  cardHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  row: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #d8d8d8",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #d8d8d8",
    outline: "none",
    resize: "vertical" as const,
  },
  button: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #d8d8d8",
    background: "#111",
    color: "white",
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #d8d8d8",
    background: "white",
    color: "#111",
    cursor: "pointer",
  },
  label: {
    display: "grid",
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
  },
  help: {
    fontSize: 12,
    color: "#666",
    fontWeight: 500,
  },
    cardStyle: {
    border: "1px solid #e6e6e6",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    color: "#111",
    marginTop: 16,
  }
};
