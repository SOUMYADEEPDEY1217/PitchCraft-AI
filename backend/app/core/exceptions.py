"""
Centralized exception classes and FastAPI exception handlers.
"""

from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.logging import logger


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class NotFoundError(AppException):
    def __init__(self, resource: str, identifier: Any):
        super().__init__(
            message=f"{resource} with identifier '{identifier}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource, "identifier": identifier},
        )


class ConflictError(AppException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            details=details,
        )


class ValidationError(AppException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )


class ExternalServiceError(AppException):
    def __init__(self, service_name: str, message: str, status_code: int = status.HTTP_502_BAD_GATEWAY, details: Optional[Dict[str, Any]] = None):
        merged_details = {"service": service_name}
        if details:
            merged_details.update(details)
        super().__init__(
            message=f"External service '{service_name}' failure: {message}",
            status_code=status_code,
            details=merged_details,
        )


class OllamaConnectionError(AppException):
    def __init__(self, base_url: str, message: str = "Ollama inference server is unreachable."):
        super().__init__(
            message=(
                f"Cannot connect to Ollama at {base_url}. "
                "Please verify that the Ollama service is running locally (`ollama serve`)."
            ),
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details={
                "service": "ollama",
                "base_url": base_url,
                "troubleshooting": "Run `ollama serve` in a terminal or check your OLLAMA_BASE_URL setting.",
                "original_error": message,
            },
        )


class OllamaModelNotFoundError(AppException):
    def __init__(self, model_name: str, available_models: Optional[list] = None):
        avail = available_models or []
        super().__init__(
            message=(
                f"Required model '{model_name}' is not downloaded in Ollama. "
                f"Please run `ollama pull {model_name}` to install it."
            ),
            status_code=status.HTTP_404_NOT_FOUND,
            details={
                "service": "ollama",
                "missing_model": model_name,
                "available_models": avail,
                "troubleshooting": f"Run `ollama pull {model_name}` in your local terminal.",
            },
        )


class OllamaTimeoutError(AppException):
    def __init__(self, timeout_seconds: float, model_name: str):
        super().__init__(
            message=(
                f"Ollama generation timed out after {timeout_seconds} seconds using model '{model_name}'. "
                "Inference may require more compute or a smaller context window."
            ),
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            details={
                "service": "ollama",
                "timeout_seconds": timeout_seconds,
                "model": model_name,
                "troubleshooting": "Increase OLLAMA_TIMEOUT or check local CPU/GPU load.",
            },
        )


class AIGenerationValidationError(AppException):
    def __init__(self, model_name: str, reason: str, raw_response: Optional[str] = None):
        super().__init__(
            message=f"AI output validation failed from model '{model_name}': {reason}",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details={
                "model": model_name,
                "reason": reason,
                "raw_response_snippet": (raw_response[:200] if raw_response else None),
            },
        )


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning(
        f"Handled AppException [{exc.status_code}] on {request.method} {request.url.path}: {exc.message}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.message,
                "status_code": exc.status_code,
                "details": exc.details,
            },
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning(f"Request validation failure on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "message": "Validation error for incoming payload.",
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
                "details": exc.errors(),
            },
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(
        f"Unhandled exception on {request.method} {request.url.path}: {str(exc)}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "message": "An unexpected internal server error occurred.",
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
        },
    )
