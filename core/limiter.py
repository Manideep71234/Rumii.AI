from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request
import time
from collections import defaultdict

def get_real_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)

limiter = Limiter(key_func=get_real_client_ip)

class SearchRateLimiter:
    def __init__(self, max_requests=5, window_seconds=60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
        
    def check_limit(self, key: str) -> bool:
        now = time.time()
        self.requests[key] = [t for t in self.requests[key] if now - t < self.window_seconds]
        
        if len(self.requests[key]) >= self.max_requests:
            return False
            
        self.requests[key].append(now)
        return True

search_limiter = SearchRateLimiter(max_requests=10, window_seconds=60)
gemini_limiter = SearchRateLimiter(max_requests=15, window_seconds=60)
