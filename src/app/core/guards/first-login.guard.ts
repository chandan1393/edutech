import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const firstLoginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isFirstLogin()) { inject(Router).navigate(['/change-password']); return false; }
  return true;
};
