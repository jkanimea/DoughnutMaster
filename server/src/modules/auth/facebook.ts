import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();

router.get('/facebook', (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET || !process.env.FACEBOOK_CALLBACK_URL) {
    return res.redirect('/?error=facebook_not_configured');
  }
  
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
  })(req, res, next);
});

router.get('/facebook/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', {
      failureRedirect: '/login?error=facebook_auth_failed',
    })(req, res, next);
  },
  (req: Request, res: Response) => {
    const user = req.user as any;
    if (user) {
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;
      
      if (user.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/dashboard');
      }
    } else {
      res.redirect('/login?error=facebook_auth_failed');
    }
  }
);

export default router;
