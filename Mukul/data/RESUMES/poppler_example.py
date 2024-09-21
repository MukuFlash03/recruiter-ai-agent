from pdf2image import convert_from_path
from typing import List

def convert_pdf_to_images(pdf_path: str, poppler_path: str) -> List:
    # Convert each page of the PDF to an image
    images = convert_from_path(pdf_path, poppler_path=poppler_path)
    return images

# Example usage
pdf_path = './1.pdf'
poppler_path = '/opt/homebrew/bin'  # Specify the Poppler path if necessary
images = convert_pdf_to_images(pdf_path, poppler_path)

# Save images or further process them
for idx, img in enumerate(images):
    img.save(f'page_{idx}.png', 'PNG')
