from flask import Blueprint, request, jsonify, render_template
from app.pdf_processing import extract_text_from_pdf
from app.crewai_agent import crew

bp = Blueprint('routes', __name__)

@bp.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'GET':
        return render_template('index.html')

    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(file)
            result = crew.kickoff(inputs={"report": text})

            # Pass the raw result string directly to the template
            return render_template('results.html', raw_result=result)
