// Audio Upload Service
// Handles FormData creation and audio file processing for backend uploads

/**
 * Audio Upload Service for handling file uploads to backend
 */
export class AudioUploadService {
  /**
   * Create FormData object for audio upload
   * Handles both recorded audio blobs and uploaded files
   * @param audioData - Audio blob from recording or File from upload
   * @returns FormData object ready for backend upload
   */
  createFormData(audioData: Blob | File): FormData {
    const formData = new FormData();
    
    if (audioData instanceof File) {
      // Handle uploaded files - use original file
      formData.append('file', audioData);
    } else {
      // Handle recorded blobs - convert to File with proper metadata
      const fileName = this.generateFileName(audioData);
      const mimeType = this.determineMimeType(audioData);
      
      const audioFile = new File([audioData], fileName, {
        type: mimeType,
        lastModified: Date.now(),
      });
      
      formData.append('file', audioFile);
    }
    
    return formData;
  }

  /**
   * Generate appropriate filename for recorded audio
   * @param audioData - Audio blob
   * @returns Generated filename with extension
   */
  private generateFileName(audioData: Blob): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = this.getFileExtension(audioData.type);
    return `recording-${timestamp}.${extension}`;
  }

  /**
   * Determine MIME type for audio blob
   * @param audioData - Audio blob
   * @returns MIME type string
   */
  private determineMimeType(audioData: Blob): string {
    // Use blob's type if available, otherwise default to webm
    return audioData.type || 'audio/webm';
  }

  /**
   * Get file extension from MIME type
   * @param mimeType - MIME type string
   * @returns File extension
   */
  private getFileExtension(mimeType: string): string {
    const mimeToExtension: Record<string, string> = {
      'audio/webm': 'webm',
      'audio/mp3': 'mp3',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/wave': 'wav',
      'audio/x-wav': 'wav',
      'audio/ogg': 'ogg',
      'audio/mp4': 'mp4',
      'audio/aac': 'aac',
    };

    return mimeToExtension[mimeType] || 'webm';
  }

  /**
   * Validate audio file before upload
   * @param audioData - Audio blob or file to validate
   * @returns Validation result with success flag and error message
   */
  validateAudioFile(audioData: Blob | File): { isValid: boolean; error?: string } {
    console.log('🔍 Validating audio file:', {
      type: audioData.constructor.name,
      size: audioData.size,
      mimeType: audioData.type
    });
    
    // Check if file exists
    if (!audioData) {
      console.log('❌ Validation failed: No audio data provided');
      return { isValid: false, error: 'No audio data provided' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (audioData.size > maxSize) {
      console.log(`❌ Validation failed: File too large (${audioData.size} bytes > ${maxSize} bytes)`);
      return { isValid: false, error: 'Audio file is too large. Maximum size is 10MB.' };
    }

    // Check minimum file size (at least 1KB)
    const minSize = 1024; // 1KB in bytes
    if (audioData.size < minSize) {
      console.log(`❌ Validation failed: File too small (${audioData.size} bytes < ${minSize} bytes)`);
      return { isValid: false, error: 'Audio file appears to be empty or too small.' };
    }

    // Check MIME type for supported formats
    const supportedTypes = [
      'audio/webm',
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/ogg',
      'audio/mp4',
      'audio/aac',
    ];

    const mimeType = audioData.type || 'audio/webm';
    if (!supportedTypes.includes(mimeType)) {
      console.log(`❌ Validation failed: Unsupported MIME type (${mimeType})`);
      return { 
        isValid: false, 
        error: 'Unsupported audio format. Please use MP3, WAV, WebM, or OGG files.' 
      };
    }

    console.log('✅ Audio file validation passed');
    return { isValid: true };
  }

  /**
   * Get human-readable file size
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get audio duration estimate (approximate based on file size and format)
   * @param audioData - Audio blob or file
   * @returns Estimated duration in seconds (approximate)
   */
  estimateAudioDuration(audioData: Blob | File): number {
    // Rough estimation based on file size and common bitrates
    // This is approximate - actual duration would require audio decoding
    const avgBitrate = 128; // kbps - common for compressed audio
    const fileSizeKB = audioData.size / 1024;
    const estimatedSeconds = (fileSizeKB * 8) / avgBitrate;
    
    return Math.round(estimatedSeconds);
  }
}

// Export singleton instance
export const audioUploadService = new AudioUploadService();