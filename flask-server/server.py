from flask import Flask

app = Flask(__name__)

# cats api
@app.route("/cats")
def members():
    return {"cats": ['pippin', 'artemis', 'shadow', 'loki',],}

if __name__ == "__main__":
      app.run(debug=True)
      
