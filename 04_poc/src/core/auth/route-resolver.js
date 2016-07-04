import { POST_SIGN_IN_PATH, SIGN_IN_PATH } from 'src/config';


export function authRouteResolver(getState) {
  // return a function which has the state -> to check if user is authenticated
  return (nextState, replace) => {
    const { auth } = getState();
    const { pathname } = nextState.location;

    // commented out because auth not yet implemented
    /* if (!auth.authenticated && pathname !== SIGN_IN_PATH) {
      replace({pathname: SIGN_IN_PATH});
    }
    if (pathname !== POST_SIGN_IN_PATH) {
      replace({pathname: POST_SIGN_IN_PATH});
    }*/
  };
}
