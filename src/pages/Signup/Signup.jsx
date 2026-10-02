import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { signupUser } from "../../services/api.js";
import "../../components/AuthForm.css";

const fieldLabels = {
  username: "Username",
  password: "Password",
};

function Signup() {
  const isSignup = true;
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => () => window.clearTimeout(submissionTimer.current), []);

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    setFormError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting || successMessage) return;

    const nextErrors = {};
    Object.keys(fieldLabels).forEach((field) => {
      if (!values[field].trim()) nextErrors[field] = `${fieldLabels[field]} is required.`;
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await signupUser(values.username, values.password);
      setSuccessMessage("Account created — please log in");
      submissionTimer.current = window.setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setFormError(error.status === 400
        ? "Username and password are required"
        : "Could not create account — try a different username");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label={isSignup ? "Sign up" : "Log in"}>
        <div className="auth-form-panel">
          <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-fields">
              {Object.entries(fieldLabels).map(([field, label]) => {
                const isPassword = field === "password";
                const inputId = `auth-${field}`;
                const errorId = `${inputId}-error`;

                return (
                  <div className="auth-field" key={field}>
                    <label htmlFor={inputId}>{label}</label>
                    <div className={`auth-input-wrap${isPassword ? " has-visibility-toggle" : ""}`}>
                      <input
                        autoComplete={isPassword ? (isSignup ? "new-password" : "current-password") : "username"}
                        id={inputId}
                        name={field}
                        type={isPassword && isPasswordVisible ? "text" : isPassword ? "password" : "text"}
                        value={values[field]}
                        onChange={updateValue}
                        aria-invalid={Boolean(errors[field])}
                        aria-describedby={errors[field] ? errorId : undefined}
                        aria-required="true"
                      />
                      {isPassword && (
                        <button
                          className="auth-visibility-toggle"
                          type="button"
                          onClick={() => setIsPasswordVisible((visible) => !visible)}
                          aria-label={`${isPasswordVisible ? "Hide" : "Show"} password`}
                          aria-pressed={isPasswordVisible}
                        >
                          {isPasswordVisible
                            ? <EyeOff size={17} aria-hidden="true" />
                            : <Eye size={17} aria-hidden="true" />}
                        </button>
                      )}
                    </div>
                    {errors[field] && <p className="auth-field-error" id={errorId} role="alert">{errors[field]}</p>}
                  </div>
                );
              })}
            </div>
            {formError && <p className="auth-field-error" role="alert">{formError}</p>}
            {successMessage && <p className="auth-switch-copy" role="status">{successMessage}</p>}
            <button className="auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting && <LoaderCircle className="auth-spinner" size={16} aria-hidden="true" />}
              {isSubmitting ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>
          <p className="auth-switch-copy">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link className="auth-switch-link" to={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Log In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signup;
