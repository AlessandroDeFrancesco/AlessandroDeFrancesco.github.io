from flask.json import JSONEncoder
from flask import Flask, request, jsonify
from flask_restful import Resource, Api

app = Flask(__name__, static_url_path='', static_folder='../',)
api = Api(app)

# Routing
class Hello(Resource):
    def get(self):
        return app.send_static_file('index.html')

class PrivacyPolicyAtlas(Resource):
    def get(self):
        return app.send_static_file('privacy_policy_atlas.html')


api.add_resource(Hello, '/')
api.add_resource(PrivacyPolicyAtlas, '/privacy_policy_atlas')

#Listen on publicIP:80
if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=3001)
