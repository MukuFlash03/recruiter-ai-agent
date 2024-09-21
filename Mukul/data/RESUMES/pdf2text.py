import subprocess


def extract_text_from_pdf(pdf_path: str, poppler_path: str) -> str:
    # Command to extract text from PDF using pdftotext
    command = [f"{poppler_path}/pdftotext", pdf_path, '-']  
    result = subprocess.run(command, stdout=subprocess.PIPE, \
stderr=subprocess.PIPE, text=True)
    # Check for errors
    if result.returncode != 0:
        raise Exception(f"Error extracting text: {result.stderr}")
    return result.stdout


# Example usage
# take pdf
pdf_path = './1.pdf'
poppler_path = '/opt/homebrew/bin'  # Specify the Poppler path
text = extract_text_from_pdf(pdf_path, poppler_path)

# Output the extracted text
# Write the extracted text to a file
with open('extracted_text.txt', 'w') as f:
    f.write(text)
