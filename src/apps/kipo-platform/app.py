import os
from flask import Flask
from shared.config import config_mapping
from shared.cors import init_cors


def create_app():
    app = Flask(__name__)

    env_name = os.environ.get("FLASK_ENV", "development")
    config_class = config_mapping[env_name]()

    app.config.from_object(config_class)

    init_cors(app)

    from api import register_blueprints

    register_blueprints(app)

    return app
