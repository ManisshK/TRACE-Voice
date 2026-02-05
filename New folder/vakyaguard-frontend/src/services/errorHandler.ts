// Error Handler Service
// Manages error states, user-friendly messages, and error recovery

export interface ErrorInfo {
  type: 'network' | 'api' | 'validation' | 'processing' | 'response' | 'unknown';
  message: string;
  userMessage: string;
  canRetry: boolean;
  shouldLog: boolean;
}

/**
 * Error Handler Service for managing analysis errors
 */
export class ErrorHandler {
  /**
   * Handle network-related errors
   * @param error - Network error object
   * @returns Structured error information
   */
  handleNetworkError(error: Error): ErrorInfo {
    let userMessage = 'Unable to connect to analysis service. Please check your connection and try again.';
    let canRetry = true;

    if (error.name === 'AbortError') {
      userMessage = 'Analysis is taking longer than expected. Please try with a shorter audio clip.';
    } else if (error.message.includes('fetch')) {
      userMessage = 'Analysis service is currently unavailable. Please try again later.';
    } else if (error.message.includes('network')) {
      userMessage = 'Cannot reach analysis service. Please check your network connection.';
    }

    return {
      type: 'network',
      message: error.message,
      userMessage,
      canRetry,
      shouldLog: true,
    };
  }

  /**
   * Handle API response errors
   * @param status - HTTP status code
   * @param statusText - HTTP status text
   * @param responseBody - Response body if available
   * @returns Structured error information
   */
  handleAPIError(status: number, statusText: string, responseBody?: string): ErrorInfo {
    let userMessage = 'Analysis failed due to a server error. Please try again.';
    let canRetry = true;
    let type: ErrorInfo['type'] = 'api';

    switch (status) {
      case 400:
        userMessage = 'Invalid audio file format. Please use MP3 or WAV files.';
        type = 'validation';
        canRetry = false;
        break;
      case 401:
        userMessage = 'Authentication failed. Please verify your credentials.';
        canRetry = false;
        break;
      case 403:
        userMessage = 'Access denied. Please contact support.';
        canRetry = false;
        break;
      case 404:
        userMessage = 'Analysis service not found. Please contact support.';
        canRetry = false;
        break;
      case 413:
        userMessage = 'Audio file is too large. Maximum size is 10MB.';
        type = 'validation';
        canRetry = false;
        break;
      case 415:
        userMessage = 'Unsupported audio format. Please use MP3 or WAV files.';
        type = 'validation';
        canRetry = false;
        break;
      case 429:
        userMessage = 'Too many requests. Please wait a moment and try again.';
        canRetry = true;
        break;
      case 500:
        userMessage = 'Analysis failed due to a processing error. Please try again.';
        type = 'processing';
        canRetry = true;
        break;
      case 502:
      case 503:
      case 504:
        userMessage = 'Analysis service is temporarily unavailable. Please try again later.';
        canRetry = true;
        break;
      default:
        userMessage = `Analysis failed with error ${status}. Please try again.`;
        canRetry = true;
    }

    return {
      type,
      message: `HTTP ${status}: ${statusText}${responseBody ? ` - ${responseBody}` : ''}`,
      userMessage,
      canRetry,
      shouldLog: true,
    };
  }

  /**
   * Handle validation errors
   * @param validationError - Validation error message
   * @returns Structured error information
   */
  handleValidationError(validationError: string): ErrorInfo {
    return {
      type: 'validation',
      message: validationError,
      userMessage: validationError, // Validation errors are already user-friendly
      canRetry: false,
      shouldLog: false,
    };
  }

  /**
   * Handle response parsing errors
   * @param error - Parsing error
   * @returns Structured error information
   */
  handleResponseError(error: Error): ErrorInfo {
    let userMessage = 'Received invalid response from analysis service. Please try again.';

    if (error.message.includes('JSON')) {
      userMessage = 'Analysis service returned invalid data. Please try again.';
    } else if (error.message.includes('missing field')) {
      userMessage = 'Analysis response is incomplete. Please retry the analysis.';
    } else if (error.message.includes('format')) {
      userMessage = 'Analysis service returned unexpected data format.';
    }

    return {
      type: 'response',
      message: error.message,
      userMessage,
      canRetry: true,
      shouldLog: true,
    };
  }

  /**
   * Handle unknown errors
   * @param error - Unknown error
   * @returns Structured error information
   */
  handleUnknownError(error: unknown): ErrorInfo {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      type: 'unknown',
      message,
      userMessage: 'An unexpected error occurred during analysis. Please try again.',
      canRetry: true,
      shouldLog: true,
    };
  }

  /**
   * Log error to console with context
   * @param error - Error to log
   * @param context - Additional context information
   */
  logError(error: Error | ErrorInfo, context: string): void {
    const timestamp = new Date().toISOString();
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error;

    console.error(`[${timestamp}] Audio Analysis Error - ${context}:`, errorData);
  }

  /**
   * Determine if error should trigger automatic retry
   * @param errorInfo - Error information
   * @returns Whether automatic retry should be attempted
   */
  shouldAutoRetry(errorInfo: ErrorInfo): boolean {
    return errorInfo.canRetry && (
      errorInfo.type === 'network' ||
      (errorInfo.type === 'api' && errorInfo.message.includes('5'))
    );
  }

  /**
   * Get retry delay based on attempt number
   * @param attemptNumber - Current retry attempt (1-based)
   * @returns Delay in milliseconds
   */
  getRetryDelay(attemptNumber: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    return Math.min(1000 * Math.pow(2, attemptNumber - 1), 10000);
  }

  /**
   * Create user-friendly error message with retry option
   * @param errorInfo - Error information
   * @returns Formatted error message
   */
  formatUserError(errorInfo: ErrorInfo): string {
    let message = errorInfo.userMessage;
    
    if (errorInfo.canRetry) {
      message += ' You can try again or contact support if the problem persists.';
    } else {
      message += ' Please check your input and try again.';
    }

    return message;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();