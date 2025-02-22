# AI Blood Test Analyzer using CrewAI

## Project Overview

This project is an **AI-powered health assistant** developed using the **CrewAI** framework. The system is designed to take a sample blood test report (in PDF format), analyze its contents, search the web for relevant health articles, and generate personalized health recommendations based on the results.
You can chat on the generated report by the crewai.

The **CrewAI** agents work together to process blood test reports and automate the process. The system uses **Cohere**'s language models to extract information from the PDF and generate a detailed summary of the report.

## Features

1. **Upload Blood Test Report**: The system accepts a blood test report in PDF format.
2. **Text Extraction**: The uploaded report is processed, and text is extracted from the PDF.
3. **Health Summary**: The CrewAI agents generate a summary of the blood test results.
5. **Health Recommendations**: It provides health recommendations based on the analyzed report.
6. **Query**: Yo can chat related to the summary generated from the blood report


---

## Technologies Used

- **Flask**: Web framework to build and serve the application.
- **CrewAI**: Framework used to manage and delegate tasks between agents.
- **Cohere**: Language model used for natural language processing (since OpenAI API wasn't available).
- **PDF Processing**: For extracting text from blood test reports in PDF format.
- **ReactJs**: For building the user interface and displaying results.

---

## How to Run the Project

### 1. Clone the Repository
```bash
git clone https://github.com/Sanket4545/AI-Blood-Test-Analyzer-using-CrewAI.git
```

or Download the zip shared on mail

### 2. Set Up the Virtual Environment
```bash
cd backend
python -m venv venv

# Activate the environment
./venv/Scripts/activate
cd bloodreportanalysercrew
cd src
```

### 3. Install the Required Dependencies
```bash
pip install -r requirements.txt
```



### 4. Set Environment Variables

You need to set up API keys for **Gemini**


Add the following environment variables in .env file in the bloodreportanalysercrew folder:
```bash
MODEL=gemini/gemini-1.5-flash
GEMINI_API_KEY=
MODEL_GEMINI=gemini-1.5-flash
```

Alternatively, you can add these keys to your terminal profile for permanent setup.

### 5. Run the Application

```bash
python api.py
```
Now your backend is running

### Run the frontend
 Open the another terminal 

``` bash
cd frontend
npm install
npm start
```

The application will be accessible at `http://127.0.0.1:5000/`.

---

## Usage

1. **Open the Web Interface**: Navigate to `http://127.0.0.1:5000/`.
2. **Upload a Blood Test Report**: Use the "Upload" button to upload a PDF of the blood test report.
3. **Processing**: The system will display a loader with the message: "Please wait while we analyze your report. Processing time may vary depending on the content in your file."
4. **Results**: After processing, the health summary, recommendations, and relevant articles will be shown.

---

## Project Flow

1. **Upload Blood Test Report**: The user uploads a PDF blood test report through the web interface.
2. **Text Extraction**: The system extracts text from the PDF.
3. **CrewAI Agents**:
   - **Planner Agent**: Analyzes the blood test and generates a summary.
4. **Health Recommendations**: Based on the blood test, recommendations and articles are provided.
5. **Displaying Results**: The results are shown in a clear, structured format on the webpage.

---


### Note:
- The **processing time** depends on the **size of the uploaded PDF** and the complexity of its contents.
- The system uses **Gemini** for language processing tasks.

---

## Troubleshooting

1. **Slow Processing or Empty Response**: 
   - Large or complex PDFs may take longer to process.
   - Ensure that the API keys for **Gemini**.
   
2. **Failed PDF Processing**: 
   - Ensure the uploaded file is a valid PDF containing text (not just images).
   
3. **500 Error**:
   - Check that all environment variables and dependencies are properly configured.

---

## Conclusion

This project demonstrates the power of CrewAI agents working in a multi-step process, from analyzing blood test reports to web research and health recommendations. The integration of Gemini for language processing ensures a smooth workflow, enabling personalized health insights.
