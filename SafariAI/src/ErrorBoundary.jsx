import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Safari AI runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", padding: "24px", background: "#f7f5ef", color: "#1f2937", fontFamily: "Georgia, serif" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", background: "#ffffff", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#166534", fontWeight: 700 }}>Safari AI Debug View</p>
            <h1 style={{ marginTop: "12px" }}>The app hit a runtime error.</h1>
            <p style={{ lineHeight: 1.7 }}>The page is now showing the actual error so we can fix it instead of leaving a blank screen.</p>
            <pre style={{ whiteSpace: "pre-wrap", background: "#111827", color: "#f9fafb", padding: "16px", borderRadius: "12px", overflow: "auto" }}>
{String(this.state.error?.stack || this.state.error?.message || this.state.error || "Unknown error")}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
