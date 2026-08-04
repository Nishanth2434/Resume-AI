import io
import pymupdf # PyMuPDF
import docx

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extracts text from a PDF or DOCX file content.
    """
    if filename.lower().endswith('.pdf'):
        return _extract_text_from_pdf(file_content)
    elif filename.lower().endswith('.docx') or filename.lower().endswith('.doc'):
        return _extract_text_from_docx(file_content)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")

def _extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    # Open the PDF from the byte stream
    with pymupdf.open(stream=file_content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text() + "\n"
    return text

def _extract_text_from_docx(file_content: bytes) -> str:
    # Use io.BytesIO to read from memory
    doc = docx.Document(io.BytesIO(file_content))
    text = []
    for paragraph in doc.paragraphs:
        text.append(paragraph.text)
    return "\n".join(text)
