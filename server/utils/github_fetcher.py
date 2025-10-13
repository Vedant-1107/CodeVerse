import requests

class GitHubFetcher:
    BASE_URL = 'https://api.github.com'
    
    def __init__(self, token=None):
        self.token = token
        self.headers = {}
        if token:
            self.headers['Authorization'] = f'token {token}'
    
    def get_repo_tree(self, owner, repo, branch='main'):
        """Fetch complete repository tree"""
        url = f'{self.BASE_URL}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1'
        response = requests.get(url, headers=self.headers)
        return response.json() if response.status_code == 200 else None
    
    def get_repo_info(self, owner, repo):
        """Get repository information"""
        url = f'{self.BASE_URL}/repos/{owner}/{repo}'
        response = requests.get(url, headers=self.headers)
        return response.json() if response.status_code == 200 else None