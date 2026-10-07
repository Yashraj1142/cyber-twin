import { useState } from "react";

import {
    ArrowUpRight,
    Eye,
    EyeOff,
    Fingerprint,
    LockKeyhole,
    ShieldCheck,
    Activity,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Mock authentication.
        // Backend will be connected later.

        navigate("/dashboard");
    };

    return (
        <main className="auth-page">

            <div className="auth-grid" />

            <div className="auth-glow auth-glow-one" />
            <div className="auth-glow auth-glow-two" />

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

                <div className="system-status">
                    <span className="status-dot online" />
                    SYSTEM ONLINE
                </div>

            </header>

            <section className="auth-layout">

                <div className="auth-intro">

                    <div className="auth-eyebrow">
                        SECURE ACCESS / 01
                    </div>

                    <h1>
                        Simulate.
                        <br />
                        <span>Detect.</span>
                        <br />
                        Improve.
                    </h1>

                    <p>
                        An autonomous cyber range where Red,
                        Blue and Purple agents continuously test,
                        defend and improve your security posture.
                    </p>

                    <div className="agent-strip">

                        <div className="agent-mini red">
                            <Activity size={15} />
                            <div>
                                <strong>RED</strong>
                                <span>ATTACK</span>
                            </div>
                        </div>

                        <div className="agent-connector" />

                        <div className="agent-mini blue">
                            <ShieldCheck size={15} />
                            <div>
                                <strong>BLUE</strong>
                                <span>DEFEND</span>
                            </div>
                        </div>

                        <div className="agent-connector" />

                        <div className="agent-mini purple">
                            <Fingerprint size={15} />
                            <div>
                                <strong>PURPLE</strong>
                                <span>EVALUATE</span>
                            </div>
                        </div>

                    </div>

                    <div className="security-loop">

                        <span>
                            CONTINUOUS SECURITY LOOP
                        </span>

                        <div>
                            ATTACK
                            <b>→</b>
                            DETECT
                            <b>→</b>
                            ANALYZE
                            <b>→</b>
                            IMPROVE
                        </div>

                    </div>

                </div>

                <div className="auth-card">

                    <div className="auth-card-header">

                        <span>
                            01 / AUTHENTICATION
                        </span>

                        <LockKeyhole size={16} />

                    </div>

                    <h2>Welcome back.</h2>

                    <p className="auth-description">
                        Enter your credentials to access the
                        CYBER-TWIN command center.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="form-field">

                            <label>EMAIL ADDRESS</label>

                            <input
                                type="email"
                                placeholder="analyst@organization.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />

                        </div>

                        <div className="form-field">

                            <div className="form-label-row">

                                <label>PASSWORD</label>

                                <button
                                    type="button"
                                    className="text-button"
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <div className="password-input">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>

                            </div>

                        </div>

                        <div className="form-options">

                            <label className="check-label">
                                <input type="checkbox" />
                                <span />
                                Keep me signed in
                            </label>

                            <span className="encrypted">
                                <LockKeyhole size={11} />
                                ENCRYPTED
                            </span>

                        </div>

                        <button
                            className="primary-auth-button"
                            type="submit"
                        >

                            <span>
                                ACCESS COMMAND CENTER
                            </span>

                            <ArrowUpRight size={17} />

                        </button>

                    </form>

                    <div className="auth-register">

                        <span>
                            New to CYBER-TWIN?
                        </span>

                        <Link to="/register">
                            Create an account
                            <ArrowUpRight size={12} />
                        </Link>

                    </div>

                    <div className="auth-card-footer">
                        <span>SECURE SESSION</span>
                        <span>v0.1.0</span>
                    </div>

                </div>

            </section>

        </main>
    );
}

export default Login;