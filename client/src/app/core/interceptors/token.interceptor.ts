import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const session = localStorage.getItem('session') || null;
  if (session) {
    const { token } = JSON.parse(session);
    const tokenReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(tokenReq);
  }

  return next(req);
};
