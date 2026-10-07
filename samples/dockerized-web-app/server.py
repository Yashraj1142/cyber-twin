from http.server import BaseHTTPRequestHandler, HTTPServer
import json


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            body = {"status": "ok", "service": "cyber-twin-sample"}
            self.send_response(200)
        elif self.path == "/":
            body = {
                "message": "Sample application running inside a Cyber Twin",
                "health": "/health",
            }
            self.send_response(200)
        else:
            body = {"error": "not found"}
            self.send_response(404)

        encoded = json.dumps(body).encode("utf-8")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, format_string, *args):
        print("sample-app: " + format_string % args)


HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
