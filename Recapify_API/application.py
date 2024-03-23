from flask import Flask

application = Flask(__name__)

@application.route("/test")
def test():
    return {"members":["Item1","Item2","Item3"]}

if __name__ == "__main__":
    application.run(port=8000)