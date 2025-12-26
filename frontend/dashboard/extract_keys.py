
import re

try:
    with open('../src/firebase.js', 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Look for firebaseConfig object
    match = re.search(r'const firebaseConfig = ({[\s\S]*?});', content)
    if match:
        print("Config found:")
        print(match.group(1))
    else:
        print("Config not found via regex.")
        # Fallback: print lines containing "apiKey" or "appId"
        print("Fallback search:")
        for line in content.splitlines():
            if "apiKey" in line or "appId" in line or "projectId" in line:
                print(line)

except Exception as e:
    print(f"Error: {e}")
