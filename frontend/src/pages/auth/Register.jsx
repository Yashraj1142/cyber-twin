import { useState } from "react";

import {
    ArrowLeft,
    ArrowUpRight,
    Check,
    ShieldCheck,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        organization: "",
        password: "",
        confirmPassword: "",
    });

    const update = (key, value) => {
        setForm({
            ...form,
            [key]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate("/dashboard");
    };

    const passwordLength =
        form.password.length >= 8;

    return (
        <main className="auth-page register-page">

            <div className="auth-grid" />

            <header className="auth-header">

                <Link
                    to="/login"
                    className="auth-brand"
                >

                    <div className="auth-brand-icon">
                        <ShieldCheck size={21} />
                    </div>

                    <div>
                        <strong>
                            CYBER<span>-</span>TWIN
                        </strong>

                        <small>
                            AUTONOMOUS SECURITY PLATFORM
                        </small>
                    </div>

                </Link>

                <Link
                    to="/login"
                    className="back-link"
                >
                    <ArrowLeft size={14} />
                    BACK TO LOGIN
                </Link>

            </header>

            <section className="register-layout">

                <div className="register-copy">

                    <div className="auth-eyebrow">
                        ACCOUNT INITIALIZATION / 02
                    </div>

                    <h1>
                        Build your
                        <br />
                        <span>security</span>
                        <br />
                        command center.
                    </h1>

                    <p>
                        Create a CYBER-TWIN workspace and
                        start evaluating your application's
                        security posture in an isolated environment.
                    </p>

                    <div className="registration-points">

                        <div>
                            <Check size={15} />
                            Isolated Digital Twin environments
                        </div>

                        <div>
                            <Check size={15} />
                            Red / Blue / Purple simulations
                        </div>

                        <div>
                            <Check size={15} />
                            Security posture analytics
                        </div>

                    </div>

                </div>

                <div className="auth-card register-card">

                    <div className="auth-card-header">
                        <span>02 / CREATE ACCOUNT</span>
                        <ShieldCheck size={16} />
                    </div>

                    <h2>Create account.</h2>

                    <p className="auth-description">
                        Set up your analyst identity.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-field">

                                <label>FULL NAME</label>

                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={form.name}
                                    onChange={(e) =>
                                        update("name", e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="form-field">

                                <label>ORGANIZATION</label>

                                <input
                                    type="text"
                                    placeholder="Organization"
                                    value={form.organization}
                                    onChange={(e) =>
                                        update(
                                            "organization",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>EMAIL ADDRESS</label>

                            <input
                                type="email"
                                placeholder="analyst@organization.com"
                                value={form.email}
                                onChange={(e) =>
                                    update("email", e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="form-field">

                            <label>PASSWORD</label>

                            <input
                                type="password"
                                placeholder="Create a strong password"
                                value={form.password}
                                onChange={(e) =>
                                    update(
                                        "password",
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="password-strength">

                            <div
                                className={
                                    passwordLength
                                        ? "strength active"
                                        : "strength"
                                }
                            />

                            <span>
                                {passwordLength
                                    ? "Password meets minimum requirements"
                                    : "Minimum 8 characters"}
                            </span>

                        </div>

                        <div className="form-field">

                            <label>CONFIRM PASSWORD</label>

                            <input
                                type="password"
                                placeholder="Repeat your password"
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    update(
                                        "confirmPassword",
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <label className="terms-label">

                            <input
                                type="checkbox"
                                required
                            />

                            <span>
                                I agree to the platform's
                                security and acceptable-use policies.
                            </span>

                        </label>

                        <button
                            type="submit"
                            className="primary-auth-button"
                        >
                            <span>CREATE SECURITY ACCOUNT</span>
                            <ArrowUpRight size={17} />
                        </button>

                    </form>

                    <div className="auth-register">

                        <span>Already have an account?</span>

                        <Link to="/login">
                            Sign in
                            <ArrowUpRight size={12} />
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Register;