import sys
import re
import os

LOG_FILE = r"C:\Users\91903\.gemini\antigravity\brain\39fc26f4-01b0-4299-93d0-95f6832ee3b5\.system_generated\logs\overview.txt"
OUTPUT_DIR = r"d:\Web_Projects\jyothi-boutique"

def recover_files():
    with open(LOG_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all file view occurrences
    pattern = r"File Path: `file:///d:/Web_Projects/jyothi-boutique/([^`]+)`.*?(?:The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>\. Please note that any changes targeting the original code should remove the line number, colon, and leading space\.|Showing lines \d+ to \d+\n)(.*?)(?:The above content shows the entire, complete file contents of the requested file\.|The above content does NOT show the entire file contents\.)"
    
    matches = re.finditer(pattern, content, re.DOTALL)
    
    recovered = {}
    
    for match in matches:
        filepath = match.group(1)
        file_content_raw = match.group(2)
        
        # Clean line numbers
        lines = []
        for line in file_content_raw.splitlines():
            # Match "123: content"
            m = re.match(r'^\d+:\s?(.*)$', line)
            if m:
                lines.append(m.group(1))
        
        clean_content = '\n'.join(lines)
        
        # If we have already seen this file, append or ignore?
        # Let's just take the first complete view.
        if filepath not in recovered or True: # Overwrite with latest view? Actually first view is best because it's the original! 
            if filepath not in recovered:
                recovered[filepath] = clean_content
            
    for rel_path, text in recovered.items():
        if not text.strip(): continue
        full_path = os.path.join(OUTPUT_DIR, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as out:
            out.write(text)
        print(f"Recovered: {rel_path}")

if __name__ == "__main__":
    recover_files()
