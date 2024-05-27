import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.error && error.error.message) {
    return error.error.message;
  } else if (error.status === 0) {
    return 'An unknown network error occurred.';
  } else {
    return `An unknown error occurred. (Code: ${error.status})`;
  }
}

export function handleError(error: HttpErrorResponse, snackBar: MatSnackBar) {
  const errorMessage = getErrorMessage(error);
  snackBar.open(errorMessage, 'Close', {
    duration: 5000,
    panelClass: ['error-snackbar'],
  });
}
