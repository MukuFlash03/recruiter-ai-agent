# For all files with .pdf convert them to .txt
for file in *.pdf; do
    echo "Processing $file"
    pdftotext "$file"
done