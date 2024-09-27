import PyPDF2

def extract_text_from_pdf(file):
    """Extract text from the uploaded PDF file."""
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''
    for page_num in range(len(pdf_reader.pages)):
        text += pdf_reader.pages[page_num].extract_text()
    
    return text
