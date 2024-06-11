export default function getGoogleOauthUrl() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    // redirect_uri: import.meta.env.OAUTH_REDIRECT_URL as string,
    redirect_uri: 'http://localhost:5555/api/google-auth' as string,
    // client_id: import.meta.env.CLIENT_ID as string,
    client_id:
      '245995267926-gkv6p45lt6eemuqbl1p9m73jmldljtuk.apps.googleusercontent.com' as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}
