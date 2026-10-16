from flask import Flask, request, jsonify

app = Flask(__name__)


TEST_USER = {
    "username": "cybertwin_test",
    "password": "cybertwin123",
}


@app.get("/")
def home():
    return jsonify({
        "service": "CyberTwin Demo Target",
        "status": "running",
    })


@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}

    username = data.get("username")
    password = data.get("password")

    if (
        username == TEST_USER["username"]
        and password == TEST_USER["password"]
    ):
        return jsonify({
            "authenticated": True
        }), 200

    return jsonify({
        "authenticated": False
    }), 401


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=3000,
        debug=False,
    )