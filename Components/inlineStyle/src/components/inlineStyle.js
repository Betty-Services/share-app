(() => ({
  name: 'inlineStyle',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { css, dataComponentAttribute } = options;
    const { env, useText } = B;
    const isDev = env === 'dev';
    const parsedCss = useText(css).replace(/(&nbsp;|\s|\r\n|\n|\r)/gm, '');

    return !isDev ? (
      <style
        type="text/css"
        data-component={useText(dataComponentAttribute) || 'inlineStyle'}
        dangerouslySetInnerHTML={{ __html: parsedCss }}
      />
    ) : (
      <div
        className={[classes.content, classes.empty, classes.pristine].join(' ')}
      >
        <span>Inline Stylesheet</span>
      </div>
    );
  })(),
  styles: (B) => (t) => {
    return {
      content: {
        display: 'block',
        padding: 0,
        whiteSpace: 'pre-wrap',
      },
      empty: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50px',
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
    };
  },
}))();
