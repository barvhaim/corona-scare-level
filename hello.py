from flask import Flask, render_template, request, jsonify
import atexit
import os

app = Flask(__name__, static_url_path='', static_folder='front-end/build')


# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))


@app.route('/')
def root():
    return app.send_static_file('index.html')


@atexit.register
def shutdown():
    pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
