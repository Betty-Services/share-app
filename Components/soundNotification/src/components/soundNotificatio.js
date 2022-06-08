(() => ({
  name: 'soundNotification',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {


    const audio_url = options.url
    const { env } = B;
    const isDev = env === 'dev';


    useEffect(() => {
        B.triggerEvent('onComponentRendered');
      }, []);
    
    B.defineFunction('PlaySound', e => playSound(), );

    function playSound() {
      const audio = new Audio(audio_url);
      audio.play();
    }

    function devCanvas() {
      return (
        <div className={classes.root}>
          <p>Sound notification</p>
        </div>
        )
    }

    function prodCanvas() {
      return (
        <div className={classes.root}>
        </div>
        )
    }

    return isDev ? devCanvas() : prodCanvas()

  })(),
  styles: B => theme => {
    const style = new B.Styling(theme);
    return {
      root: {}
    };
  },
}))();