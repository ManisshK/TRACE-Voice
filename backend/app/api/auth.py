from fastapi import Header, HTTPException, status
from app.config import get_api_key

def verify_api_key(
    x_api_key: str = Header(..., alias="x-api-key")
):
    # Server-side configured API key
    expected_key = get_api_key()

    if not expected_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server API key not configured"
        )

    if x_api_key != expected_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )

    return True
