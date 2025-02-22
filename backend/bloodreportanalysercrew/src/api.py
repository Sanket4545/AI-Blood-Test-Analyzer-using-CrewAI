from flask import Flask, request, jsonify
import os
import PyPDF2
from datetime import datetime
from bloodreportanalysercrew.crew import Bloodreportanalysercrew
from dotenv import load_dotenv
import google.generativeai as genai

from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # Extract text from the PDF
    text = extract_text_from_pdf(file_path)
    os.remove(file_path)  # Remove file after extraction
    
    # Convert text to JSON format
    report_json = {"topic": text, "current_year": str(datetime.now().year)}
    
    # Run CrewAI
    report_output = run_crewai(report_json)
    
    return jsonify({"report": report_output})

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, "rb") as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def run_crewai(report_json):
    try:
        crew = Bloodreportanalysercrew().crew()
        crew.kickoff(inputs=report_json)
        output_path = "generated_report.txt"  # Assuming CrewAI writes output here
        
        if os.path.exists(output_path):
            with open(output_path, "r") as f:
                return f.read()
        else:
            return "Report generation failed."
    except Exception as e:
        return f"Error: {str(e)}"


load_dotenv()



# Retrieve API Key & Model from .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("MODEL_GEMINI")  # Default to 1.5 Flash if not set

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing in the .env file!")

# Configure Gemini AI
genai.configure(api_key=GEMINI_API_KEY)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        question = data.get("question", "").strip()
        report = data.get("report", "").strip()

        if not question or not report:
            return jsonify({"error": "Both 'question' and 'report' are required."}), 400

        prompt = f"Based on the following health report, answer the question:\n\n{report}\n\nQuestion: {question}"

        # Use the correct model
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(prompt)
        print("response.text: ", response.text)

        return jsonify({"answer": response.text})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
