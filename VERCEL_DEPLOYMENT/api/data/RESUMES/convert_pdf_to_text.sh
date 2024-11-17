# For all files with .pdf convert them to .txt

# pip install pdftotext
for file in *.pdf; do
    echo "Processing $file"
    pdftotext "$file"
done