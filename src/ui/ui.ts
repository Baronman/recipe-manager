export const ui = {
  page: {
    maxWidth: 980,
    margin: "0 auto",
    padding: 24,
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
 card: {
  border: "1px solid #e6e6e6",
  borderRadius: 12,
  padding: 16,
  background: "var(--card-bg, #f9f9f9)",
  color: "var(--card-text, #111)",
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
};
