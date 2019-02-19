from routes.main import routes
from http.server import BaseHTTPRequestHandler
from pathlib import Path

# create Server class that is subclass of a BaseHTTPRequestHandler
# when a request arrives, BaseHTTPRequestHandler will automatically route
# the request to the appropriate request method (do_GET, do_Head, do_POST)
class Server(BaseHTTPRequestHandler):
    def do_Head(self):
        return

    def do_POST(self):
        return

    def do_GET(self):
        self.respond()

    # used to send basic http handlers and then return the content
    def handle_http(self, status, content_type):
        response_content = ""

        if self.path in routes:
            print(routes[self.path])

            self.send_response(status)
            self.send_header('Content-type', content_type)
            self.end_headers()

        route_content = routes[self.path]
        #return the content we want to send (.txt of headlines/json of relevant data)
        return bytes (route_content, "UTF-8")

    # used to send the actual response
    def respond(self):
        # for now passes a 200 success code and the content type
        content = self.handle_http(200, 'text/html')
        # send the finalized content as the response
        self.wfile.write(content)
