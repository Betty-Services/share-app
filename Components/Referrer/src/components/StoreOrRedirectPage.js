(() => ({
  name: 'StoreOrRedirectPage',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const LOCAL_STORAGE_KEY = 'referer';
    const { defaultRedirectPage, operation, storage } = options;
    const isDev = B.env === 'dev';
    const storagelocation =
      storage === 'sessionStorage'
        ? window.sessionStorage
        : window.localStorage;

    const doLoadReferer = () => {
      const referer = storagelocation.getItem(LOCAL_STORAGE_KEY);
      if (referer) {
        storagelocation.removeItem(LOCAL_STORAGE_KEY);
      }
      return referer;
    };

    const doStoreReferer = () => {
      storagelocation.setItem(LOCAL_STORAGE_KEY, window.location.pathname);
    };

    const history = isDev ? null : useHistory();

    useEffect(() => {
      if (operation === 'redirect') {
        const referer = doLoadReferer();
        if (referer) {
          history && history.push(referer);
        } else {
          const { id } = defaultRedirectPage;
          if (id) {
            const endpointParams = {
              id,
            };

            const redirectTo = B.useEndpoint(endpointParams);
            if (redirectTo === location.pathname) {
              history && history.go(0);
            } else {
              history && history.push(redirectTo);
            }
          }
        }
      } else {
        doStoreReferer();
      }
    }, [operation]);

    useEffect(() => {
      B.defineFunction('RedirectToStoredPage', args => {
        let redirectTo;
        if (defaultRedirectPage) {
          const { id, params } = defaultRedirectPage;
          const newParams = Object.entries(params).reduce((acc, cv) => {
            const key = cv[0];
            const value = cv[1];
            acc[key] = [args.actionb5[value]];
            return acc;
          }, {});
          const endpointParams = {
            id,
            params: newParams,
          };
          redirectTo = B.useEndpoint(endpointParams);
        }

        if (redirectTo === location.pathname) {
          history && history.go(0);
        } else {
          history && history.push(redirectTo);
        }
      });
    }, []);
    if (isDev) {
      return <div className={classes.root}>STORE/REDIRECT PAGE</div>;
    }

    return <div />;
  })(),
  styles: () => () => ({
    root: {},
  }),
}))();
