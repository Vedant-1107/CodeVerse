from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

def extract_repo_info(github_url):
    """Extract owner and repo name from GitHub URL"""
    try:
        path = urlparse(github_url).path
        parts = [p for p in path.split('/') if p]
        if len(parts) >= 2:
            return parts[0], parts[1].replace('.git', '')
        return None, None
    except:
        return None, None

def fetch_repo_structure(owner, repo, path=''):
    """Recursively fetch repository structure from GitHub API"""
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{path}'
    
    try:
        response = requests.get(url)
        
        if response.status_code != 200:
            return None
        
        items = response.json()
        structure = []
        
        for item in items:
            structure.append({
                'path': item['path'],
                'type': item['type']
            })
            
            # Recursively fetch subdirectories (limit depth to avoid rate limits)
            if item['type'] == 'dir' and path.count('/') < 3:
                sub_structure = fetch_repo_structure(owner, repo, item['path'])
                if sub_structure:
                    structure.extend(sub_structure)
        
        return structure
    except Exception as e:
        print(f"Error fetching structure: {e}")
        return None

@app.route('/api/repo', methods=['GET'])
def get_repo():
    """Get repository structure"""
    repo_url = request.args.get('url')

    if not repo_url:
        return jsonify({'error': 'Repository URL is required'}), 400

    owner, repo = extract_repo_info(repo_url)

    if not owner or not repo:
        return jsonify({'error': 'Invalid GitHub repository URL'}), 400

    # Fetch repo info (to detect default branch)
    info_url = f'https://api.github.com/repos/{owner}/{repo}'
    info_response = requests.get(info_url)

    if info_response.status_code == 404:
        return jsonify({'error': 'Repository not found'}), 404
    elif info_response.status_code == 403:
        return jsonify({'error': 'Access denied or rate limit exceeded'}), 403
    elif info_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch repository information'}), 500

    repo_info = info_response.json()
    default_branch = repo_info.get("default_branch", "main")

    # Try to fetch the repo tree
    tree_url = f'https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1'
    tree_response = requests.get(tree_url)

    if tree_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch repository structure'}), 500

    tree_data = tree_response.json()

    structure = [
        {'path': item['path'], 'type': 'dir' if item['type'] == 'tree' else 'file'}
        for item in tree_data.get('tree', [])
    ]

    # Include repo_url and default_branch
    return jsonify({
        'repo_name': repo,
        'owner': owner,
        'repo_url': f'https://github.com/{owner}/{repo}',
        'default_branch': default_branch,
        'structure': structure
    })


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)