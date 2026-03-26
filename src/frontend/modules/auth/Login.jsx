// src/frontend/modules/auth/Login.jsx
// Premium Split Layout Login UI.
// Auth logic uses useAuth hook fetching true roles from Firestore backend.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../backend/modules/auth/useAuth";
import loginImage from "../../../assets/login_1.jpg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../backend/config/firebase";

const TESTIMONIALS = [
  {
    text: "The robust security measures of SecureCare give us peace of mind. We trust the platform to safeguard our project data, ensuring confidentiality and compliance with data protection standards.",
    author: "Shadi Elson",
    role: "IT Project Lead"
  },
  {
    text: "Adopting this platform revolutionized our patient data flow. The ease of role-based access combined with top-tier security has made our daily operations significantly smoother.",
    author: "Sarah Jenkins",
    role: "Chief Nursing Officer"
  },
  {
    text: "SecureCare's intuitive interface means we spend less time on administration and more time focused on delivering exceptional patient care.",
    author: "Dr. Marcus Chen",
    role: "Head of Surgery"
  }
];

const Login = () => {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Password Reset State
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Auto-rotating slider for testimonials every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSeedUsers = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    const usersToSeed = [
      { email: "johnathanwick3422@gmail.com", role: "doctor", pwd: "abc@123" },
      { email: "sjartistic3422@gmail.com", role: "nurse", pwd: "abc@123" },
      { email: "testmailid3422@gmail.com", role: "admin", pwd: "abc@123" },
      { email: "thoufikumar.a2023cse@sece.ac.in", role: "receptionist", pwd: "abc@123" }
    ];
    let createdCount = 0;
    try {
      for (const u of usersToSeed) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, u.email, u.pwd);
          await setDoc(doc(db, "users", cred.user.uid), {
            email: u.email,
            role: u.role,
            createdAt: new Date().toISOString()
          });
          createdCount++;
        } catch (err) {
          if (err.code === "auth/email-already-in-use") {
            console.log(`${u.email} already exists in Firebase Auth.`);
          } else {
            throw err;
          }
        }
      }
      setSuccessMsg(`🚀 Seeding complete! Created ${createdCount} accounts. (If 0 created, they already exist—please manually delete them from your Firebase Console if you forgot the passwords)`);
    } catch (error) {
      setError("Error seeding users: " + error.message);
    }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setResetLoading(true);

    const res = await resetPassword(resetEmail);
    if (res.success) {
      setSuccessMsg("Password reset link sent to your email");
      setResetEmail("");
      setShowReset(false);
    } else {
      let displayErr = res.message;
      if (res.message.includes("auth/user-not-found")) {
        displayErr = "No user found with this email";
      } else if (res.message.includes("auth/invalid-email")) {
        displayErr = "Invalid email address";
      }
      setError(displayErr);
    }
    setResetLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const user = await login(email, password);
      setSuccessMsg("Login successful");

      setTimeout(() => {
        switch (user.role) {
          case "doctor":
            navigate("/doctor");
            break;
          case "nurse":
            navigate("/nurse");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "receptionist":
            navigate("/receptionist");
            break;
          default:
            navigate("/unauthorized");
        }
      }, 800);

    } catch (err) {
      setLoading(false);
      let displayErr = "Invalid email or password";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        displayErr = "Invalid email or password";
      } else if (err.message) {
        displayErr = err.message;
      }
      setError(displayErr);
    }
  };

  return (
    <div className="login-page" style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${loginImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
          zIndex: 0
        }}
      />
      <div className="login-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Left panel: form ───────────────────────────── */}
        <div className="login-form-panel">
          <div className="login-brand">
            <div className="brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#0D6EFD" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#0D6EFD" />
              </svg>
            </div>
            <span>SecureCare</span>
          </div>

          {successMsg && (
            <div className="login-success" role="alert" style={{ marginBottom: '16px' }}>
              ✅ {successMsg}
            </div>
          )}

          {error && (
            <div className="login-error" role="alert" style={{ marginBottom: '16px' }}>
              ❌ {error}
            </div>
          )}

          {showReset ? (
            <div className="reset-box">
              <h2 className="login-title" style={{ fontSize: '20px' }}>Reset Password</h2>
              <p className="login-subtitle">Enter your email and we'll send a reset link.</p>

              <form onSubmit={handleReset} className="login-form">
                <div className="login-field">
                  <label htmlFor="reset-email">Email</label>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  style={{ marginTop: '8px' }}
                  disabled={resetLoading || !resetEmail}
                >
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  className="reset-back-link"
                  onClick={() => {
                    setShowReset(false);
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  ← Back to login
                </button>
              </form>
            </div>
          ) : (
            <>
              <h1 className="login-title">Log in to your account</h1>
              <p className="login-subtitle">Welcome back! Please enter your details.</p>

              <form onSubmit={handleLogin} className="login-form">
                <div className="login-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="login-field">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper" style={{ position: 'relative' }}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="login-options-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={handleSeedUsers}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#10b981', fontWeight: '500', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Initialize required mock users into your database"
                  >
                    🚀 Developer: Seed Firebase Users
                  </button>
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => {
                      setShowReset(true);
                      setError("");
                      setSuccessMsg("");
                    }}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loading || !!successMsg}
                >
                  {loading || successMsg ? "Signing in..." : "Login"}
                </button>
              </form>
            </>
          )}

        </div>

        {/* ── Right panel: visual ─────────────────────────── */}
        <div className="login-image-panel">
          <div className="image-panel-content">
            <h2 className="image-panel-title">
              Turn Clicks<br />
              Into Customers<br />
              <span className="title-light">Effortlessly</span>
            </h2>

            <div className="testimonial-slider-wrapper">
              <div
                className="testimonial-slider-track"
                style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}
              >
                {TESTIMONIALS.map((t, idx) => (
                  <div className="testimonial-card" key={idx}>
                    <div className="testimonial-stars">★★★★★</div>
                    <p className="testimonial-text">"{t.text}"</p>
                    <div className="testimonial-author">
                      <p className="author-name">{t.author}</p>
                      <p className="author-role">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
