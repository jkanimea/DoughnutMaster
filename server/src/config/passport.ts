import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import prisma from '../database/prisma';
import { userService } from '../modules/users/service';

export function configurePassport() {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  const callbackURL = process.env.FACEBOOK_CALLBACK_URL;

  if (facebookAppId && facebookAppSecret && callbackURL) {
    passport.use(new FacebookStrategy(
      {
        clientID: facebookAppId,
        clientSecret: facebookAppSecret,
        callbackURL,
        profileFields: ['id', 'emails', 'name', 'displayName'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userService.findByProvider('facebook', profile.id);

          if (!user) {
            const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
            const name = profile.displayName || 
              `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || 
              'Facebook User';

            user = await userService.createFromSocialLogin({
              email,
              name,
              provider: 'facebook',
              providerId: profile.id,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    ));
    console.log('Facebook OAuth strategy configured');
  } else {
    console.log('Facebook OAuth not configured - missing FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, or FACEBOOK_CALLBACK_URL');
  }
}

export default passport;
