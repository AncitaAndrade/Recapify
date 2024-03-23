from flask import Flask

app = Flask(__name__)

@app.route("/test")
def test():
    return {"members":["Item1","Item2","Item3"]}

if __name__ == "__main__":
    app.run(debug=True)