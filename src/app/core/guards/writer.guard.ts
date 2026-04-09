import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const writerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const role = auth.currentUser()?.role;
  if (role === 'ROLE_WRITER' || role === 'ROLE_ADMIN') return true;
  inject(Router).navigate(['/dashboard']);
  return false;
};
