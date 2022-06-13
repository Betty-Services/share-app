(() => ({
  name: 'SocketRefetcher',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (
    <div>
      {(() => {
        const { env, GetMe } = B;
        const isEmpty = children.length === 0;
        const isDev = env === 'dev';
        const isPristine = isEmpty && isDev;
        const { authProfile } = options;

        const SOCKET_URL = 'wss://taskusws.com';
        const RETRY_TIMEOUT = 10000;
        const socketInteraction = () => {
          B.triggerEvent('onSocketInteraction');
        };

        const [userId, setUserId] = useState(null);

        const pageId = window.artifact
          ? Object.values(window.artifact.endpoints).find(
              obj => obj.url === window.location.pathname,
            ).id
          : null;

        const applicationId = window.artifact
          ? window.artifact.applicationId
          : null;

        const initializeSocket = async (timeOut = 0) => {
          await setTimeout(() => {
            const socketUrl = `${SOCKET_URL}?appid=${applicationId}&pageid=${pageId}${
              userId ? `&userid=${userId}` : ''
            }`;
            const socket = new WebSocket(socketUrl);

            // Connection opened
            socket.addEventListener('open', event => {
              console.log('connected to WS server');
            });
            // Listen for messages
            socket.addEventListener('message', event => {
              if (event.data === 'refetch') {
                socketInteraction();
              } else {
                console.log(event.data);
              }
            });
            // On connection closed
            socket.addEventListener('close', event => {
              // retry connection of websocket every 10 seconds
              initializeSocket(RETRY_TIMEOUT);
              console.log('The connection has been closed successfully.');
            });
          }, timeOut);
        };

        useEffect(() => {
          if (!isDev) {
            if ((authProfile && userId) || !authProfile) {
              initializeSocket();
            }
          }
        }, [userId, authProfile]);

        if (authProfile && !isDev) {
          return (
            <GetMe authenticationProfileId={authProfile}>
              {({ error, loading, data }) => {
                if (loading) {
                  B.triggerEvent('onUserLoad');
                }
                if (error) {
                  B.triggerEvent('onUserError', error);
                }
                if (data && data.id) {
                  setUserId(data.id);
                }
              }}
            </GetMe>
          );
        }

        return (
          <div
            className={[
              isEmpty ? classes.empty : '',
              isPristine ? classes.pristine : '',
              !isDev ? classes.frontEnd : '',
            ].join(' ')}
          >
            {isPristine ? 'SocketRefetcher' : null}
          </div>
        );
      })()}
    </div>
  ),
  styles: () => () => ({
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row-reverse',
      minHeight: '4rem',
      width: '100%',
    },
    searchWrapper: {
      display: 'flex',
      alignItems: 'center',
      padding: [0, '0.5rem'],
      borderBottom: [1, 'solid', '#000'],
    },
    searchIcon: {
      fontSize: '1.25rem',
      marginRight: '1rem',
    },
    search: {
      padding: ['0.25rem', 0],
      fontSize: '1rem',
      border: 'none',
      outline: 'none',
    },
    button: {
      background: 'transparent',
      border: 'none',
      display: 'inline-block',
      padding: 0,
      margin: 0,
      cursor: 'pointer',
      '&:active': {
        outline: 'none',
      },
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: ['0.75rem', 0],
    },
    placeholder: {
      opacity: '0.4',
    },
    pagination: {
      marginLeft: '1rem',
    },
    arrow: {
      padding: '1rem',
      fontSize: '1.625rem',
      color: '#000',
      textDecoration: 'none',
    },
    arrowDisabled: { color: '#ccc' },
    empty: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '4rem',
      height: '100%',
      width: '100%',
      fontSize: '0.75rem',
      color: '#262A3A',
      textTransform: 'uppercase',
      boxSizing: 'border-box',
    },
    pristine: {
      borderWidth: '0.0625rem',
      borderColor: '#AFB5C8',
      borderStyle: 'dashed',
      backgroundColor: '#F0F1F5',
    },
    frontEnd: {
      width: '100% !important',
      minHeight: '0px !important',
      padding: '0px !important',
    },
  }),
}))();
