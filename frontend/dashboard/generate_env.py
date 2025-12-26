
import re
import os

try:
    # Read source file
    src_path = '../src/firebase.js'
    if not os.path.exists(src_path):
        print(f"Source file not found: {src_path}")
        exit(1)
        
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract config object using regex
    # Matches: apiKey: "VALUE", or apiKey: 'VALUE', allow whitespace/newlines
    keys = {
        'VITE_FIREBASE_API_KEY': r'apiKey:\s*["\']([^"\']+)["\']',
        'VITE_FIREBASE_AUTH_DOMAIN': r'authDomain:\s*["\']([^"\']+)["\']',
        'VITE_FIREBASE_PROJECT_ID': r'projectId:\s*["\']([^"\']+)["\']',
        'VITE_FIREBASE_STORAGE_BUCKET': r'storageBucket:\s*["\']([^"\']+)["\']',
        'VITE_FIREBASE_MESSAGING_SENDER_ID': r'messagingSenderId:\s*["\']([^"\']+)["\']',
        'VITE_FIREBASE_APP_ID': r'appId:\s*["\']([^"\']+)["\']'
    }
    
    env_content = ""
    for env_var, pattern in keys.items():
        match = re.search(pattern, content)
        if match:
            value = match.group(1)
            env_content += f"{env_var}={value}\n"
            print(f"Found {env_var}")
        else:
            print(f"Missing {env_var}")

    if env_content:
        with open('.env', 'w', encoding='utf-8') as f:
            f.write(env_content)
        print("Successfully wrote .env file")
    else:
        print("No keys found to write.")

except Exception as e:
    print(f"Error: {e}")
