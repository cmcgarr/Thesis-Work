# For writing timestamps of server going up/down
import time
# for HTTP server boilerplate
from http.server import HTTPServer
from httpServer import Server

# for creating a localhost server ---
# might be a good idea to alter these as arguments from cmd line to allow for non-local host
# ------------------------------------------------------------------------------------------
HOST_NAME = 'localhost'
PORT_NUMBER = 8000

if __name__ == '__main__':
    # Create a HTTP object
    httpd = HTTPServer((HOST_NAME, PORT_NUMBER), Server)
    print(time.asctime(), 'Server UP - %s:%s' % (HOST_NAME, PORT_NUMBER))
    # Run server until KeyboardInterrupt
    try:
        httpd.serve_forever()

    except KeyboardInterrupt:
        pass
        
    httpd.server_close()
    print(time.asctime(), 'Server DOWN - %s:%s' % (HOST_NAME, PORT_NUMBER))
