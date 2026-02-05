// Analysis Service with Error Recovery
// Orchestrates audio analysis with automatic retry and error recovery

import { audioAnalysisAPI, BackendAnalysisResponse } from './audioAnalysisAPI';
import { audioUploadService } from './audioUploadService';
import { errorHandler, ErrorInfo } from './errorHandler';

export interface AnalysisState {
  isLoading: boolean;
  data: BackendAnalysisResponse | null;
  error: ErrorInfo | null;
  retryCount: number;
}

export interface AnalysisOptions {
  maxRetries?: number;
  enableAutoRetry?: boolean;
  onProgress?: (stage: string) => void;
  onRetry?: (attempt: number, error: ErrorInfo) => void;
}

/**
 * Analysis Service with comprehensive error handling and recovery
 */
export class AnalysisService {
  private readonly maxRetries: number = 3;

  /**
   * Analyze audio with error recovery and retry logic
   * @param audioData - Audio blob or file to analyze
   * @param options - Analysis options
   * @returns Promise resolving to analysis results
   */
  async analyzeAudio(
    audioData: Blob | File,
    options: AnalysisOptions = {}
  ): Promise<BackendAnalysisResponse> {
    const {
      maxRetries = this.maxRetries,
      enableAutoRetry = true,
      onProgress,
      onRetry,
    } = options;

    // Validate audio file first
    const validation = audioUploadService.validateAudioFile(audioData);
    if (!validation.isValid) {
      const errorInfo = errorHandler.handleValidationError(validation.error!);
      errorHandler.logError(errorInfo, 'Audio validation failed');
      throw new Error(errorInfo.userMessage);
    }

    onProgress?.('Preparing audio for analysis...');

    let lastError: ErrorInfo | null = null;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        attempt++;
        
        if (attempt > 1) {
          onProgress?.(`Retrying analysis (attempt ${attempt})...`);
          onRetry?.(attempt, lastError!);
          
          // Wait before retry with exponential backoff
          const delay = errorHandler.getRetryDelay(attempt - 1);
          await this.sleep(delay);
        }

        onProgress?.('Uploading audio to analysis service...');
        
        // Attempt analysis
        const backendResponse = await audioAnalysisAPI.uploadAudio(audioData);
        
        onProgress?.('Processing analysis results...');
        
        // Use backend response directly (no transformation needed)
        const analysisResults = backendResponse;
        
        onProgress?.('Analysis complete');
        
        return analysisResults;

      } catch (error) {
        lastError = this.categorizeError(error);
        errorHandler.logError(lastError, `Analysis attempt ${attempt}`);

        // Don't retry if it's not a retryable error
        if (!enableAutoRetry || !errorHandler.shouldAutoRetry(lastError)) {
          break;
        }

        // Don't retry if we've reached max attempts
        if (attempt >= maxRetries) {
          break;
        }
      }
    }

    // All attempts failed
    const finalError = lastError || errorHandler.handleUnknownError(new Error('Analysis failed'));
    throw new Error(errorHandler.formatUserError(finalError));
  }

  /**
   * Categorize error based on type and content
   * @param error - Error to categorize
   * @returns Structured error information
   */
  private categorizeError(error: unknown): ErrorInfo {
    if (error instanceof Error) {
      // Network connectivity errors (backend not running)
      if (error.message.includes('Cannot connect to analysis service')) {
        return {
          type: 'network',
          message: error.message,
          userMessage: 'Backend server is not running. Please start the backend server and try again.',
          canRetry: true,
          shouldLog: true,
        };
      }
      
      // Network errors
      if (error.name === 'AbortError' || error.message.includes('fetch') || error.message.includes('network')) {
        return errorHandler.handleNetworkError(error);
      }

      // API errors (HTTP status codes)
      const httpMatch = error.message.match(/API Error: (\d+) (.+)/);
      if (httpMatch) {
        const status = parseInt(httpMatch[1]);
        const statusText = httpMatch[2];
        return errorHandler.handleAPIError(status, statusText);
      }

      // Response validation errors
      if (error.message.includes('Invalid response') || error.message.includes('missing field')) {
        return errorHandler.handleResponseError(error);
      }

      // Validation errors
      if (error.message.includes('file') || error.message.includes('format') || error.message.includes('size')) {
        return errorHandler.handleValidationError(error.message);
      }

      return errorHandler.handleUnknownError(error);
    }

    return errorHandler.handleUnknownError(error);
  }

  /**
   * Sleep for specified duration
   * @param ms - Duration in milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create analysis state manager
   * @returns Analysis state manager object
   */
  createStateManager(): {
    state: AnalysisState;
    analyze: (audioData: Blob | File, options?: AnalysisOptions) => Promise<void>;
    retry: () => Promise<void>;
    reset: () => void;
  } {
    let state: AnalysisState = {
      isLoading: false,
      data: null,
      error: null,
      retryCount: 0,
    };

    let lastAudioData: Blob | File | null = null;
    let lastOptions: AnalysisOptions | undefined;

    const analyze = async (audioData: Blob | File, options?: AnalysisOptions) => {
      lastAudioData = audioData;
      lastOptions = options;
      
      state = {
        isLoading: true,
        data: null,
        error: null,
        retryCount: 0,
      };

      try {
        const results = await this.analyzeAudio(audioData, {
          ...options,
          onRetry: (attempt, error) => {
            state.retryCount = attempt - 1;
            options?.onRetry?.(attempt, error);
          },
        });

        state = {
          isLoading: false,
          data: results,
          error: null,
          retryCount: state.retryCount,
        };
      } catch (error) {
        const errorInfo = this.categorizeError(error);
        
        state = {
          isLoading: false,
          data: null,
          error: errorInfo,
          retryCount: state.retryCount,
        };
      }
    };

    const retry = async () => {
      if (lastAudioData) {
        await analyze(lastAudioData, lastOptions);
      }
    };

    const reset = () => {
      state = {
        isLoading: false,
        data: null,
        error: null,
        retryCount: 0,
      };
      lastAudioData = null;
      lastOptions = undefined;
    };

    return { state, analyze, retry, reset };
  }
}

// Export singleton instance
export const analysisService = new AnalysisService();