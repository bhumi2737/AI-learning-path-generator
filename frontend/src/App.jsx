import { useState, useEffect } from "react";

function App() {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [difficulty, setDifficulty] = useState("intermediate");
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("roadmapHistory")) || [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("roadmapFavorites")) || [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState("");
  const [particles, setParticles] = useState([]);
  const [currentPage, setCurrentPage] = useState("home"); // "home" or "history"

  const popularTopics = [
    "Data Structures",
    "Web Development",
    "Machine Learning",
    "Python",
    "DevOps",
    "Cloud Computing",
  ];

  useEffect(() => {
    // Generate particles for background
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
    setParticles(newParticles);

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        document.querySelector("input[type='text']")?.focus();
      }
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem("roadmapHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("roadmapFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleGenerate = async () => {
    if (!goal) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: `${goal} (${difficulty} level)` }),
      });

      const data = await res.json();
      setResult(data.result);

      // Add to history
      const newHistoryItem = { goal, difficulty, result: data.result, timestamp: new Date().toLocaleString() };
      setHistory([newHistoryItem, ...history.slice(0, 9)]);
      showToast("✅ Roadmap generated successfully!");
    } catch (err) {
      setResult("Server not responding ❌");
      showToast("❌ Error generating roadmap");
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    showToast("📋 Copied to clipboard!");
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out my AI-generated learning roadmap for ${goal}! 🚀`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `roadmap-${goal.replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast("📥 Downloaded successfully!");
  };

  const toggleFavorite = () => {
    if (favorites.some((fav) => fav.goal === goal && fav.difficulty === difficulty)) {
      setFavorites(favorites.filter((fav) => !(fav.goal === goal && fav.difficulty === difficulty)));
      showToast("❤️ Removed from favorites");
    } else {
      setFavorites([...favorites, { goal, difficulty, result }]);
      showToast("❤️ Added to favorites!");
    }
  };

  const deleteHistoryItem = (index) => {
    setHistory(history.filter((_, idx) => idx !== index));
    showToast("🗑️ History item deleted");
  };

  const editHistoryItem = (item) => {
    setGoal(item.goal);
    setDifficulty(item.difficulty);
    setResult(item.result);
    setCurrentPage("home");
    showToast("✏️ Loaded history item for edit");
  };

  const isFavorited = favorites.some((fav) => fav.goal === goal && fav.difficulty === difficulty);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div style={{ ...styles.container, backgroundColor: theme.container.backgroundColor, backgroundImage: theme.container.backgroundImage }}>
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "fixed",
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            background: isDark ? "rgba(102, 126, 234, 0.3)" : "rgba(102, 126, 234, 0.2)",
            animation: `float ${particle.duration}s infinite`,
            animationDelay: `${particle.delay}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Toast Notification */}
      {toast && (
        <div style={{ ...styles.toast, ...theme.toast, animation: "slideIn 0.3s ease" }}>
          {toast}
        </div>
      )}

      <button
        onClick={() => setIsDark(!isDark)}
        style={{ ...styles.themeToggle, ...theme.themeToggle }}
        title="Toggle Dark/Light Mode (Ctrl+/)"
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.15)";
          e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }}
      >
        {isDark ? "🌙" : "☀️"}
      </button>

      <div style={{ ...styles.content, ...theme.content }}>
        {/* Navigation Tabs */}
        <div style={{ ...styles.navTabs, ...theme.navTabs }}>
          <button
            onClick={() => setCurrentPage("home")}
            style={{
              ...styles.navTab,
              ...theme.navTab,
              borderBottomColor: currentPage === "home" ? "rgba(102, 126, 234, 0.8)" : "transparent",
              borderBottomWidth: currentPage === "home" ? "3px" : "1px",
              opacity: currentPage === "home" ? 1 : 0.6,
            }}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setCurrentPage("history")}
            style={{
              ...styles.navTab,
              ...theme.navTab,
              borderBottomColor: currentPage === "history" ? "rgba(102, 126, 234, 0.8)" : "transparent",
              borderBottomWidth: currentPage === "history" ? "3px" : "1px",
              opacity: currentPage === "history" ? 1 : 0.6,
            }}
          >
            📖 History & Favorites
          </button>
        </div>

        {/* HOME PAGE */}
        {currentPage === "home" && (
          <>
            <div style={{ ...styles.header, ...theme.header }}>
              <div>
                <h1 style={{ ...styles.title, ...theme.title }}>AI Learning Path</h1>
                <p style={{ ...styles.subtitle, ...theme.subtitle }}>Create personalized learning roadmaps with AI</p>
              </div>
            </div>

            {/* Difficulty Level Selector */}
            <div style={{ ...styles.difficultySelector, ...theme.difficultySelector }}>
              {["beginner", "intermediate", "advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  style={{
                    ...styles.difficultyBtn,
                    ...theme.difficultyBtn,
                    opacity: difficulty === level ? 1 : 0.6,
                    borderColor: difficulty === level ? "rgba(102, 126, 234, 0.8)" : "rgba(102, 126, 234, 0.3)",
                    backgroundColor: difficulty === level ? "rgba(102, 126, 234, 0.2)" : "transparent",
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>

            {/* Popular Topics */}
            <div style={{ ...styles.topicsSection, ...theme.topicsSection }}>
              <p style={{ ...styles.topicsLabel, ...theme.topicsLabel }}>Popular Topics:</p>
              <div style={styles.topicsGrid}>
                {popularTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setGoal(topic)}
                    style={{ ...styles.topicBtn, ...theme.topicBtn }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...styles.card, ...theme.card }}>
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, ...theme.label }}>What would you like to learn?</label>
                <input
                  type="text"
                  placeholder="e.g., Data Structures, Web Development, Machine Learning (Press / to focus)"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                  style={{ ...styles.input, ...theme.input }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "rgba(102, 126, 234, 0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = theme.input.borderColor;
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(102, 126, 234, 0.9)";
                    e.target.style.boxShadow = "0 0 20px rgba(102, 126, 234, 0.3)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.input.borderColor;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !goal}
                style={{
                  ...styles.button,
                  ...theme.button,
                  opacity: loading || !goal ? 0.6 : 1,
                  cursor: loading || !goal ? "not-allowed" : "pointer",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (!loading && goal) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 16px 40px rgba(102, 126, 234, 0.5), 0 0 30px rgba(240, 147, 251, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = theme.button.boxShadow;
                }}
              >
                {loading ? "✨ Generating..." : "Generate Roadmap"}
              </button>

              {/* Loading Animation */}
              {loading && (
                <div style={styles.loadingContainer}>
                  <div style={{ ...styles.spinner, ...theme.spinner }} />
                  <p style={{ ...styles.loadingText, ...theme.loadingText }}>Creating your personalized roadmap...</p>
                </div>
              )}

              {result && (
                <div style={{ ...styles.resultBox, ...theme.resultBox }}>
                  <div style={{ ...styles.resultHeader, ...theme.resultHeader }}>
                    <h3 style={{ ...styles.resultTitle, ...theme.resultTitle }}>📚 Your Learning Roadmap</h3>
                    <div style={styles.resultActions}>
                      <button
                        onClick={copyToClipboard}
                        title="Copy to clipboard"
                        style={{ ...styles.actionBtn, ...theme.actionBtn }}
                      >
                        📋
                      </button>
                      <button
                        onClick={shareToTwitter}
                        title="Share on Twitter"
                        style={{ ...styles.actionBtn, ...theme.actionBtn }}
                      >
                        𝕏
                      </button>
                      <button
                        onClick={downloadAsText}
                        title="Download as text"
                        style={{ ...styles.actionBtn, ...theme.actionBtn }}
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={toggleFavorite}
                        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        style={{ ...styles.actionBtn, ...theme.actionBtn, color: isFavorited ? "#f093fb" : "inherit" }}
                      >
                        {isFavorited ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                  <pre style={{ ...styles.resultContent, ...theme.resultContent }}>{result}</pre>
                </div>
              )}
            </div>

            <div style={{ ...styles.footer, ...theme.footer }}>
              <p style={{ ...styles.footerText, ...theme.footerText }}>
                💡 Press <code>/</code> to search • <code>Ctrl+Enter</code> to generate
              </p>
              <p style={{ ...styles.footerText, ...theme.footerText }}>Powered by AI • Created with ❤️</p>
            </div>
          </>
        )}

        {/* HISTORY PAGE */}
        {currentPage === "history" && (
          <>
            <div style={{ ...styles.header, ...theme.header }}>
              <div>
                <h1 style={{ ...styles.title, ...theme.title }}>📖 History & Favorites</h1>
                <p style={{ ...styles.subtitle, ...theme.subtitle }}>Your learning journey saved</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              {/* History Section */}
              {history.length > 0 && (
                <div style={{ ...styles.historySection, ...theme.historySection }}>
                  <h3 style={{ ...styles.historyTitle, ...theme.historyTitle }}>📅 Recent Searches ({history.length})</h3>
                  <div style={styles.historyList}>
                    {history.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCurrentPage("home");
                          setGoal(item.goal);
                          setDifficulty(item.difficulty);
                          setResult(item.result);
                        }}
                        style={{
                          ...styles.historyItem,
                          ...theme.historyItem,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateX(5px)";
                          e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateX(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <div>
                          <strong style={{ ...theme.historyItemTitle }}>{item.goal}</strong>
                          <p style={styles.historyItemMeta}>
                            {item.difficulty} • {item.timestamp}
                          </p>
                        </div>
                        <div style={styles.historyItemActions}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editHistoryItem(item);
                            }}
                            style={{ ...styles.smallActionBtn, ...theme.smallActionBtn }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistoryItem(idx);
                            }}
                            style={{ ...styles.smallActionBtn, ...theme.smallActionBtn, color: "#f87171", borderColor: "rgba(248, 113, 113, 0.6)" }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorites Section */}
              {favorites.length > 0 && (
                <div style={{ ...styles.favoritesSection, ...theme.favoritesSection }}>
                  <h3 style={{ ...styles.favoritesTitle, ...theme.favoritesTitle }}>❤️ Favorite Roadmaps ({favorites.length})</h3>
                  <div style={styles.favoritesList}>
                    {favorites.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCurrentPage("home");
                          setGoal(item.goal);
                          setDifficulty(item.difficulty);
                          setResult(item.result);
                        }}
                        style={{
                          ...styles.favoriteItem,
                          ...theme.favoriteItem,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateX(5px)";
                          e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateX(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <div>
                          <strong style={{ ...theme.favoriteItemTitle }}>{item.goal}</strong>
                          <p style={styles.favoriteItemMeta}>{item.difficulty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {history.length === 0 && favorites.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ fontSize: "18px", opacity: 0.7 }}>No history or favorites yet. Generate a roadmap to get started! 🚀</p>
                <button
                  onClick={() => setCurrentPage("home")}
                  style={{
                    marginTop: "20px",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  ← Back to Home
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "40px",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    position: "relative",
    transition: "all 0.3s ease",
    overflow: "visible",
  },
  themeToggle: {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "2px solid",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  content: {
    width: "100%",
    maxWidth: "900px",
    padding: "80px 20px 60px",
    margin: "0 auto",
    animation: "slideIn 0.6s ease",
  },
  navTabs: {
    display: "flex",
    gap: "0",
    justifyContent: "center",
    marginBottom: "40px",
    borderBottom: "2px solid",
    padding: "0 0 0 0",
  },
  navTab: {
    padding: "16px 30px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "3px solid transparent",
  },
  header: {
    marginBottom: "50px",
    textAlign: "center",
    borderRadius: "24px",
    padding: "90px 40px 60px",
    position: "relative",
    backdropFilter: "blur(10px)",
    overflow: "visible",
  },
  title: {
    fontSize: "56px",
    lineHeight: "1.1",
    fontWeight: "900",
    margin: "0 0 15px 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
    width: "100%",
    wordWrap: "break-word",
    whiteSpace: "normal",
    overflow: "visible",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "18px",
    margin: "0",
    opacity: 0.85,
    fontWeight: "500",
    letterSpacing: "0.5px",
  },
  difficultySelector: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "30px",
    padding: "15px 20px",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },
  difficultyBtn: {
    flex: 1,
    padding: "10px 20px",
    borderRadius: "8px",
    border: "2px solid",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  topicsSection: {
    marginBottom: "30px",
    padding: "20px",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },
  topicsLabel: {
    margin: "0 0 15px 0",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  topicsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
  },
  topicBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "2px solid",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "capitalize",
    background: "transparent",
  },
  card: {
    borderRadius: "20px",
    padding: "50px",
    marginBottom: "40px",
    border: "2px solid",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    position: "relative",
    overflow: "hidden",
  },
  formGroup: {
    marginBottom: "30px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    opacity: 0.9,
  },
  input: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "2px solid",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  button: {
    width: "100%",
    padding: "16px 24px",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
    position: "relative",
    overflow: "hidden",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    marginTop: "30px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(102, 126, 234, 0.2)",
    borderTop: "4px solid rgba(102, 126, 234, 0.8)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "15px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
  },
  resultBox: {
    marginTop: "35px",
    borderRadius: "16px",
    border: "2px solid",
    padding: "25px",
    animation: "slideIn 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  resultHeader: {
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "2px solid",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultTitle: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  resultActions: {
    display: "flex",
    gap: "10px",
  },
  actionBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "2px solid",
    backgroundColor: "transparent",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  resultContent: {
    margin: "0",
    fontSize: "14px",
    lineHeight: "1.8",
    maxHeight: "400px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontWeight: "500",
  },
  historySection: {
    padding: "25px",
    borderRadius: "16px",
    border: "2px solid",
    backdropFilter: "blur(10px)",
  },
  historyTitle: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  historyItem: {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  historyItemMeta: {
    fontSize: "12px",
    margin: "4px 0 0 0",
    opacity: 0.7,
  },
  historyItemActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexWrap: "wrap",
  },
  smallActionBtn: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(102, 126, 234, 0.3)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  favoritesSection: {
    padding: "25px",
    borderRadius: "16px",
    border: "2px solid",
    backdropFilter: "blur(10px)",
  },
  favoritesTitle: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  favoritesList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  favoriteItem: {
    padding: "16px",
    borderRadius: "8px",
    border: "2px solid",
    transition: "all 0.3s ease",
  },
  favoriteItemMeta: {
    fontSize: "12px",
    margin: "4px 0 0 0",
    opacity: 0.7,
    textTransform: "capitalize",
  },
  toast: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "16px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: 2000,
    border: "2px solid",
  },
  footer: {
    textAlign: "center",
    paddingTop: "30px",
    borderTop: "2px solid",
    marginTop: "40px",
  },
  footerText: {
    margin: "8px 0",
    fontSize: "14px",
    opacity: 0.7,
    fontWeight: "500",
  },
};

const darkTheme = {
  container: {
    backgroundColor: "#0a0e27",
    backgroundImage: "linear-gradient(135deg, #0a0e27 0%, #16213e 25%, #1a1a2e 50%, #16213e 75%, #0a0e27 100%)",
  },
  themeToggle: {
    backgroundColor: "#1e293b",
    borderColor: "#667eea",
    color: "#fbbf24",
  },
  header: {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  title: {
    color: "#e0e7ff",
  },
  subtitle: {
    color: "#a5b4fc",
  },
  difficultySelector: {
    background: "rgba(30, 41, 59, 0.6)",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  difficultyBtn: {
    color: "#e2e8f0",
    borderColor: "rgba(102, 126, 234, 0.4)",
  },
  topicsSection: {
    background: "rgba(30, 41, 59, 0.5)",
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  topicsLabel: {
    color: "#cbd5e1",
  },
  topicBtn: {
    borderColor: "rgba(102, 126, 234, 0.3)",
    color: "#cbd5e1",
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderColor: "rgba(102, 126, 234, 0.4)",
    boxShadow: "0 30px 60px rgba(102, 126, 234, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
  },
  label: {
    color: "#cbd5e1",
  },
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderColor: "rgba(102, 126, 234, 0.4)",
    color: "#e2e8f0",
  },
  button: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    color: "#ffffff",
    boxShadow: "0 12px 30px rgba(102, 126, 234, 0.4), 0 0 20px rgba(240, 147, 251, 0.2)",
  },
  spinner: {
    borderColor: "rgba(102, 126, 234, 0.2)",
    borderTopColor: "rgba(102, 126, 234, 0.8)",
  },
  loadingText: {
    color: "#cbd5e1",
  },
  resultBox: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  resultHeader: {
    borderBottomColor: "rgba(102, 126, 234, 0.3)",
  },
  resultTitle: {
    color: "#e0e7ff",
  },
  actionBtn: {
    borderColor: "rgba(102, 126, 234, 0.4)",
    color: "#cbd5e1",
  },
  resultContent: {
    color: "#cbd5e1",
    backgroundColor: "rgba(10, 14, 39, 0.9)",
  },
  historySection: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  historyTitle: {
    color: "#e0e7ff",
  },
  historyItem: {
    borderColor: "rgba(102, 126, 234, 0.3)",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    color: "#cbd5e1",
  },
  historyItemTitle: {
    color: "#e0e7ff",
  },
  favoritesSection: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  favoritesTitle: {
    color: "#e0e7ff",
  },
  favoriteItem: {
    borderColor: "rgba(102, 126, 234, 0.3)",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    color: "#cbd5e1",
  },
  favoriteItemTitle: {
    color: "#e0e7ff",
  },
  toast: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderColor: "rgba(102, 126, 234, 0.5)",
    color: "#e2e8f0",
  },
  footer: {
    borderTopColor: "rgba(102, 126, 234, 0.2)",
  },
  footerText: {
    color: "#a5b4fc",
  },
  navTabs: {
    borderBottomColor: "rgba(102, 126, 234, 0.3)",
  },
  navTab: {
    color: "rgba(255, 255, 255, 0.8)",
    borderBottomColor: "transparent",
  },
};

const lightTheme = {
  container: {
    backgroundColor: "#f8fafc",
    backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)",
  },
  themeToggle: {
    backgroundColor: "#ffffff",
    borderColor: "#667eea",
    color: "#d97706",
  },
  header: {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)",
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  title: {
    color: "#1e293b",
  },
  subtitle: {
    color: "#403f8b",
  },
  difficultySelector: {
    background: "rgba(255, 255, 255, 0.5)",
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  difficultyBtn: {
    color: "#1e293b",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  topicsSection: {
    background: "rgba(255, 255, 255, 0.6)",
    borderColor: "rgba(102, 126, 234, 0.15)",
  },
  topicsLabel: {
    color: "#334155",
  },
  topicBtn: {
    borderColor: "rgba(102, 126, 234, 0.2)",
    color: "#1e293b",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderColor: "rgba(102, 126, 234, 0.3)",
    boxShadow: "0 30px 60px rgba(102, 126, 234, 0.1), inset 0 1px 1px rgba(102, 126, 234, 0.1)",
  },
  label: {
    color: "#334155",
  },
  input: {
    backgroundColor: "rgba(241, 245, 249, 0.9)",
    borderColor: "rgba(102, 126, 234, 0.3)",
    color: "#1e293b",
  },
  button: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    color: "#ffffff",
    boxShadow: "0 12px 30px rgba(102, 126, 234, 0.3), 0 0 20px rgba(240, 147, 251, 0.15)",
  },
  spinner: {
    borderColor: "rgba(102, 126, 234, 0.2)",
    borderTopColor: "rgba(102, 126, 234, 0.8)",
  },
  loadingText: {
    color: "#1e293b",
  },
  resultBox: {
    backgroundColor: "rgba(241, 245, 249, 0.7)",
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  resultHeader: {
    borderBottomColor: "rgba(102, 126, 234, 0.2)",
  },
  resultTitle: {
    color: "#1e293b",
  },
  actionBtn: {
    borderColor: "rgba(102, 126, 234, 0.3)",
    color: "#334155",
  },
  resultContent: {
    color: "#1e293b",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  historySection: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  historyTitle: {
    color: "#1e293b",
  },
  historyItem: {
    borderColor: "rgba(102, 126, 234, 0.2)",
    backgroundColor: "rgba(241, 245, 249, 0.6)",
    color: "#1e293b",
  },
  historyItemTitle: {
    color: "#1e293b",
  },
  favoritesSection: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  favoritesTitle: {
    color: "#1e293b",
  },
  favoriteItem: {
    borderColor: "rgba(102, 126, 234, 0.2)",
    backgroundColor: "rgba(241, 245, 249, 0.6)",
    color: "#1e293b",
  },
  favoriteItemTitle: {
    color: "#1e293b",
  },
  toast: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "rgba(102, 126, 234, 0.4)",
    color: "#1e293b",
  },
  footer: {
    borderTopColor: "rgba(102, 126, 234, 0.15)",
  },
  footerText: {
    color: "#403f8b",
  },
  navTabs: {
    borderBottomColor: "rgba(102, 126, 234, 0.2)",
  },
  navTab: {
    color: "#1e293b",
    borderBottomColor: "transparent",
  },
};

export default App;