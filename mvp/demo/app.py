from collections import deque
from datetime import datetime, timezone

from flask import Flask, jsonify, request, render_template_string

app = Flask(__name__)
recent_attempts = deque(maxlen=40)

TEST_USER = {
    "username": "cybertwin_test",
    "password": "cybertwin123",
}

LOGIN_PAGE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CyberTwin Demo Target · Sign in</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; color: #e8eef8;
      background: radial-gradient(ellipse at 20% 5%, #18354a 0, transparent 40%), #080d17; }
    .shell { width: min(430px, calc(100% - 32px)); }
    .badge { display: inline-flex; gap: 8px; align-items: center; color: #7ce4e8; font: 11px monospace; letter-spacing: .13em; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: #58e2a7; box-shadow: 0 0 12px #58e2a7; }
    .card { margin-top: 18px; padding: 34px; border: 1px solid #28384d; border-radius: 16px; background: rgba(15, 24, 39, .94); box-shadow: 0 24px 80px #0008; }
    .eyebrow { color: #8192aa; font: 10px monospace; letter-spacing: .14em; }
    h1 { margin: 10px 0 8px; font-size: 25px; letter-spacing: -.04em; }
    .copy { color: #9baac0; font-size: 13px; line-height: 1.6; }
    label { display: block; margin: 19px 0 7px; color: #b8c4d7; font-size: 11px; }
    input { width: 100%; height: 43px; padding: 0 12px; border: 1px solid #34455e; border-radius: 7px; color: #edf4ff; background: #0b1220; }
    button { width: 100%; margin-top: 22px; height: 44px; border: 0; border-radius: 7px; color: #081018; background: #68e6e8; font-weight: 700; cursor: pointer; }
    .notice { margin-top: 17px; padding: 12px; border: 1px solid #315744; border-radius: 7px; color: #9ef1bd; background: #10251d; font-size: 12px; }
    .notice.error { border-color: #704350; color: #ffb3bd; background: #2a151d; }
    .demo { margin: 18px 0 0; color: #8192aa; font: 10px monospace; line-height: 1.7; }
    .demo strong { color: #b7c5d8; }
    .activity { margin-top: 20px; padding-top: 17px; border-top: 1px solid #28384d; }
    .activity-head { display: flex; justify-content: space-between; color: #8192aa; font: 10px monospace; letter-spacing: .1em; }
    .activity-state { color: #58e2a7; }
    .activity-list { display: grid; gap: 7px; max-height: 170px; overflow: auto; margin-top: 12px; }
    .attempt { display: flex; justify-content: space-between; gap: 8px; padding: 9px 10px; border: 1px solid #29384b; border-radius: 6px; background: #0b1220; font: 10px monospace; }
    .attempt span:first-child { color: #b7c5d8; overflow-wrap: anywhere; }
    .attempt.rejected span:last-child { color: #ff8393; }
    .attempt.accepted span:last-child { color: #58e2a7; }
    .activity-empty { color: #63728a; font: 10px monospace; }
    footer { margin-top: 16px; color: #63728a; font: 9px monospace; letter-spacing: .08em; }
  </style>
</head>
<body>
  <main class="shell">
    <div class="badge"><span class="dot"></span> ISOLATED DEMO APPLICATION</div>
    <section class="card">
      <p class="eyebrow">CYBER-TWIN / TEST TARGET</p>
      <h1>Sign in to your account</h1>
      <p class="copy">This intentionally vulnerable demo login is isolated for the Red Agent exercise.</p>
      {% if message %}<div class="notice {{ 'error' if failed else '' }}" role="status">{{ message }}</div>{% endif %}
      <form method="post" action="login">
        <label for="username">Username</label>
        <input id="username" name="username" autocomplete="username" required>
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>
        <button type="submit">Sign in</button>
      </form>
      <p class="demo">DEMO ACCOUNT<br><strong>cybertwin_test / cybertwin123</strong></p>
      <section class="activity" aria-live="polite">
        <div class="activity-head"><span>LIVE LOGIN ACTIVITY</span><span class="activity-state" id="activity-state">MONITORING</span></div>
        <div class="activity-list" id="activity-list"><p class="activity-empty">Waiting for login attempts…</p></div>
      </section>
    </section>
    <footer>DEMO ONLY · DO NOT REUSE THESE CREDENTIALS</footer>
  </main>
  <script>
    const activityList = document.getElementById('activity-list');
    async function refreshActivity() {
      try {
        const response = await fetch('api/activity', { cache: 'no-store' });
        if (!response.ok) throw new Error('activity unavailable');
        const { attempts } = await response.json();
        if (!attempts.length) {
          activityList.innerHTML = '<p class="activity-empty">Waiting for login attempts…</p>';
          return;
        }
        activityList.replaceChildren(...attempts.map((attempt) => {
          const row = document.createElement('div');
          row.className = `attempt ${attempt.authenticated ? 'accepted' : 'rejected'}`;
          const label = document.createElement('span');
          label.textContent = `${attempt.source} · ${attempt.username} · ${attempt.time}`;
          const result = document.createElement('span');
          result.textContent = attempt.authenticated ? 'ACCEPTED' : 'REJECTED';
          row.append(label, result);
          return row;
        }));
        activityList.scrollTop = activityList.scrollHeight;
      } catch (_) {
        document.getElementById('activity-state').textContent = 'RECONNECTING';
      }
    }
    refreshActivity();
    window.setInterval(refreshActivity, 400);
  </script>
</body>
</html>"""


@app.get("/")
def home():
    return render_template_string(LOGIN_PAGE)


@app.get("/health")
def health():
    return jsonify({"status": "running", "service": "CyberTwin Demo Target"})


def record_attempt(username, authenticated):
    recent_attempts.appendleft({
        "username": username or "(empty)",
        "authenticated": authenticated,
        "source": "RED AGENT" if request.headers.get("X-Cybertwin-Agent") == "red-agent" else "BROWSER",
        "time": datetime.now(timezone.utc).strftime("%H:%M:%S UTC"),
    })


@app.get("/api/activity")
def activity():
    return jsonify({"attempts": list(reversed(recent_attempts))})


@app.post("/login")
def login_page():
    username = request.form.get("username", "")
    password = request.form.get("password", "")
    authenticated = username == TEST_USER["username"] and password == TEST_USER["password"]
    record_attempt(username, authenticated)
    message = "Demo login succeeded." if authenticated else "Invalid username or password."
    return render_template_string(LOGIN_PAGE, message=message, failed=not authenticated), 200 if authenticated else 401


@app.post("/api/login")
def login_api():
    data = request.get_json(silent=True) or {}
    authenticated = (
        data.get("username") == TEST_USER["username"]
        and data.get("password") == TEST_USER["password"]
    )
    record_attempt(data.get("username", ""), authenticated)
    return jsonify({"authenticated": authenticated}), 200 if authenticated else 401


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=False)
