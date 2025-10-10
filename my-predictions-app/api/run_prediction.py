from your_original_code import *  # imports everything from your original code
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    # Expecting input file via form-data
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Call your existing code here
    result = run_prediction(file)  # you need to wrap your final print/output in a function
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run()
