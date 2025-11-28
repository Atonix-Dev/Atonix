import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Global Error Handler
 *
 * Catches all unhandled errors in the application
 * Provides centralized error logging and user notification
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    let errorMessage = '';
    let stackTrace = '';

    if (error instanceof HttpErrorResponse) {
      // Server error
      errorMessage = this.getServerErrorMessage(error);
      stackTrace = error.message;
    } else {
      // Client Error
      errorMessage = this.getClientErrorMessage(error);
      stackTrace = error.stack || '';
    }

    // Log to console (in production, send to logging service)
    console.error('Global Error Handler:', {
      message: errorMessage,
      stack: stackTrace,
      error: error
    });

    // In production, you would send this to a logging service
    // this.logErrorToService(errorMessage, stackTrace);

    // Show user-friendly error message
    this.notifyUser(errorMessage);
  }

  /**
   * Extract error message from HTTP error
   */
  private getServerErrorMessage(error: HttpErrorResponse): string {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network.';
    }

    if (error.status === 0) {
      return 'Unable to connect to server. Please try again later.';
    }

    if (error.status >= 500) {
      return `Server error (${error.status}). Please try again later.`;
    }

    if (error.status === 404) {
      return 'Requested resource not found.';
    }

    if (error.status === 401 || error.status === 403) {
      return 'You are not authorized to perform this action.';
    }

    return error.message || 'An unexpected server error occurred.';
  }

  /**
   * Extract error message from client error
   */
  private getClientErrorMessage(error: Error): string {
    return error.message || 'An unexpected error occurred in the application.';
  }

  /**
   * Notify user of error
   * In a real app, this would show a toast/snackbar notification
   */
  private notifyUser(message: string): void {
    // For now, just log to console
    // In production, use a notification service
    console.warn('User notification:', message);

    // Example: inject NotificationService and show message
    // const notificationService = this.injector.get(NotificationService);
    // notificationService.error(message);
  }

  /**
   * Log error to external service
   * Placeholder for production logging service (e.g., Sentry, LogRocket)
   */
  private logErrorToService(message: string, stack: string): void {
    // Example implementation:
    // const loggingService = this.injector.get(LoggingService);
    // loggingService.logError(message, stack);
  }
}
