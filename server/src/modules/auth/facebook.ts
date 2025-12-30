import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();

router.get('/facebook', (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET || !process.env.FACEBOOK_CALLBACK_URL) {
    return res.redirect('/?error=facebook_not_configured');
  }
  
  passport.authenticate('facebook', {
    scope: ['public_profile'],
  })(req, res, next);
});

router.get('/facebook/callback',
  (req: Request, res: Response, next: NextFunction) => {
    console.log('Facebook callback received:', req.query);
    
    passport.authenticate('facebook', (err: any, user: any, info: any) => {
      console.log('Passport authenticate result:', { err: err?.message, user: !!user, info });
      
      if (err) {
        console.error('Facebook auth error:', err);
        return res.redirect('/login?error=facebook_auth_error');
      }
      
      if (!user) {
        console.log('No user returned from Facebook');
        return res.redirect('/login?error=facebook_auth_failed');
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Session login error:', loginErr);
          return res.redirect('/login?error=session_error');
        }
        
        (req.session as any).userId = user.id;
        (req.session as any).userRole = user.role;
        
        console.log('Facebook login successful for user:', user.id);
        
        if (user.role === 'admin') {
          res.redirect('/admin');
        } else {
          res.redirect('/dashboard');
        }
      });
    })(req, res, next);
  }
);

export default router;
