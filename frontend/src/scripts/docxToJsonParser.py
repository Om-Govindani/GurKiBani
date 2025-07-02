from docx import Document
from indic_transliteration.sanscript import transliterate, DEVANAGARI, ITRANS
import re
import json

# === File paths ===
DOCX_PATH = "SGGS.docx"
OUTPUT_JSON = "SGGS.json"

# === Regex to detect (page-line) pattern like (1-12)
page_line_pattern = re.compile(r"\((\d{1,4}-\d{1,4})\)$")

# === Unicode matra ranges
DEVANAGARI_MATRAS = r"[\u093e-\u094c\u0900-\u0903]"
GURMUKHI_MATRAS = r"[\u0a3e-\u0a4c\u0a01-\u0a03]"

# === Function to extract first letters cleanly
def extract_first_letters(gurmukhi_line, devnagari_line):
    words_gurmukhi = gurmukhi_line.strip().split()
    words_dev = devnagari_line.strip().split()

    gur_letters = []
    dev_letters = []
    rom_letters = []

    for word in words_gurmukhi:
        first = word[0]
        if "\u0a00" <= first <= "\u0a7f":
            first = re.sub(GURMUKHI_MATRAS, "", first)
            gur_letters.append(first)

    for word in words_dev:
        first = word[0]
        if "\u0900" <= first <= "\u097F":
            first_clean = re.sub(DEVANAGARI_MATRAS, "", first)
            dev_letters.append(first_clean)
        try:
            rom = transliterate(word, DEVANAGARI, ITRANS).lower()
            if rom:
                rom_letters.append(rom[0])
        except:
            rom_letters.append("")

    return {
        "gurmukhi": ' '.join(gur_letters),
        "devnagari": ' '.join(dev_letters),
        "romanized": ' '.join(rom_letters)
    }

# === Main Function
def extract_sggs_docx(path):
    doc = Document(path)
    verses = {}
    pending_gurmukhi = None
    current_key = None

    for para in doc.paragraphs:
        line = para.text.strip()
        if not line:
            continue

        # Detect Gurmukhi line with (page-line)
        match = page_line_pattern.search(line)
        if match:
            page_line_key = match.group(1)
            gurmukhi_line = page_line_pattern.sub("", line).strip()
            pending_gurmukhi = gurmukhi_line
            current_key = page_line_key
        elif pending_gurmukhi:
            devnagari_line = line.strip()
            firsts = extract_first_letters(pending_gurmukhi, devnagari_line)

            verse_obj = [
                pending_gurmukhi,
                devnagari_line,
                firsts["gurmukhi"],
                firsts["devnagari"],
                firsts["romanized"]
            ]

            if current_key not in verses:
                verses[current_key] = []
            verses[current_key].append(verse_obj)

            pending_gurmukhi = None
            current_key = None

    return verses

# === Run & Save
print("📖 Extracting SGGS with all first-letter forms...")
data = extract_sggs_docx(DOCX_PATH)

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Done! Output saved to: {OUTPUT_JSON}")

