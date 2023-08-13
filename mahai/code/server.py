import json
from flask import Flask, request
from flask_restful import Api
from video_demo import process_video
from waitress import serve
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)



@app.route('/api/surdo_video', methods=['POST'])
def upload():
    file = request.files['video']
    video_path = "output.mp4"
    config_path = "config.json"
    file.save(video_path)

    result = process_video(video_path, config_path, stride=15)

    return json.dumps(result)


if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=6767)
    serve(app, host='0.0.0.0', port=6767)
