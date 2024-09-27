from flask import Flask

def create_app():
    # Initialize the app and specify the template folder
    app = Flask(__name__, template_folder='../templates')
    
    # Register routes
    from app.routes import bp as routes_bp
    app.register_blueprint(routes_bp)
    
    return app
