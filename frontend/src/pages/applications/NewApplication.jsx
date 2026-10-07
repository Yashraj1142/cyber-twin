import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, Box, CheckCircle2, FileArchive, LoaderCircle, Play, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

function NewApplication() {
    const [name, setName] = useState("");
    const [port, setPort] = useState("8000");
    const [archive, setArchive] = useState(null);
    const [application, setApplication] = useState(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const fileInput = useRef(null);

    useEffect(() => {
        if (!application || ["ready", "failed"].includes(application.build_status)) return undefined;
        const timer = window.setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE}/api/v1/applications/${application.id}`);
                if (!response.ok) throw new Error("Could not read build status");
                setApplication(await response.json());
            } catch (requestError) {
                setError(requestError.message);
            }
        }, 1500);
        return () => window.clearInterval(timer);
    }, [application]);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        if (!archive) {
            setError("Choose a ZIP archive to upload.");
            return;
        }

        const form = new FormData();
        form.append("name", name);
        form.append("app_port", port);
        form.append("archive", archive);
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE}/api/v1/applications`, { method: "POST", body: form });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || "Upload failed");
            setApplication(result);
        } catch (requestError) {
            setError(`${requestError.message}. Confirm the API is running at ${API_BASE}.`);
        } finally {
            setSubmitting(false);
        }
    }

    async function lifecycleAction(action) {
        setError("");
        try {
            const response = await fetch(`${API_BASE}/api/v1/applications/${application.id}/${action}`, { method: "POST" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || `Could not ${action} application`);
            setApplication(result);
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    async function deleteApplication() {
        setError("");
        try {
            const response = await fetch(`${API_BASE}/api/v1/applications/${application.id}`, { method: "DELETE" });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.detail || "Could not delete application");
            }
            setApplication(null);
            setArchive(null);
            setName("");
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    const ready = application?.build_status === "ready";
    const failed = application?.build_status === "failed";

    return (
        <div className="page-wrapper animate-fade">
            <Link to="/projects" className="back-page-link"><ArrowLeft size={13} /> ALL PROJECTS</Link>
            <div className="section-header" style={{ marginTop: 22 }}>
                <div>
                    <div className="section-eyebrow">APPLICATION ONBOARDING</div>
                    <h1>Add a Dockerized application</h1>
                    <p>Upload a ZIP with a Dockerfile at its root to build and start an isolated twin.</p>
                </div>
            </div>

            {!application ? (
                <form className="panel onboarding-form" onSubmit={handleSubmit}>
                    <div className="onboarding-field">
                        <label htmlFor="application-name">APPLICATION NAME</label>
                        <input id="application-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} placeholder="My sample app" />
                    </div>

                    <div className="onboarding-field">
                        <label htmlFor="application-port">CONTAINER PORT</label>
                        <input id="application-port" type="number" min="1" max="65535" value={port} onChange={(event) => setPort(event.target.value)} required />
                    </div>

                    <input ref={fileInput} type="file" accept=".zip,application/zip" hidden onChange={(event) => setArchive(event.target.files?.[0] || null)} />
                    <button type="button" className="secondary-button" onClick={() => fileInput.current?.click()}>
                        <FileArchive size={15} /> {archive ? archive.name : "Choose ZIP archive"}
                    </button>
                    <p className="onboarding-hint">ZIP limit: 50 MB. The archive must include a Dockerfile. <a href="/sample-app.zip" download>Download the sample app ZIP</a>.</p>

                    <div className="onboarding-warning">
                        <AlertTriangle size={16} />
                        <span>Docker builds execute the uploaded Dockerfile. Use only source you trust and keep this local development API off the network.</span>
                    </div>
                    {error && <div role="alert" className="onboarding-error">{error}</div>}
                    <button type="submit" className="primary-button" disabled={submitting}>
                        {submitting ? <LoaderCircle size={15} className="spin" /> : <UploadCloud size={15} />}
                        {submitting ? "Uploading…" : "Upload and build twin"}
                    </button>
                </form>
            ) : (
                <section className="panel onboarding-result" aria-live="polite">
                    <div className="section-eyebrow">{application.name}</div>
                    <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {ready ? <CheckCircle2 size={20} /> : failed ? <AlertTriangle size={20} /> : <LoaderCircle size={20} className="spin" />}
                        {failed ? "Build failed" : ready ? `Twin ${application.status}` : `Build ${application.build_status}`}
                    </h2>
                    <p>{failed ? application.build_error : ready ? "The application image was built and started in an isolated Docker network." : "The API is building the image and starting the twin. This may take a few minutes."}</p>
                    {ready && application.target_url && <p><Box size={15} /> <a href={application.target_url} target="_blank" rel="noreferrer">{application.target_url}</a></p>}
                    {error && <div role="alert" className="onboarding-error">{error}</div>}
                    {ready && application.status === "running" && <button className="secondary-button" onClick={() => lifecycleAction("stop")}>Stop twin</button>}
                    {ready && application.status !== "running" && <button className="primary-button" onClick={() => lifecycleAction("start")}><Play size={14} /> Start twin</button>}
                    {["ready", "failed"].includes(application.build_status) && <button className="secondary-button" onClick={deleteApplication}>Delete application and twin</button>}
                    {failed && <button className="secondary-button" onClick={() => { setApplication(null); setError(""); }}>Try another ZIP</button>}
                </section>
            )}
        </div>
    );
}

export default NewApplication;
