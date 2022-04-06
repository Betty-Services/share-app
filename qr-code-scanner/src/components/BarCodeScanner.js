(() => ({
  name: 'BarCodeScanner',
  type: 'CONTENT_COMPONENT',
  allowedTypes: ['CONTENT_COMPONENT'],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env } = B;
    const BarcodeScannerComponent = window.BarcodeScannerComponent;
    const isDev = env === 'dev';
    const {
      imagePreviewWidth,
      imagePreviewHeight,
      facingMode,
      torch,
      stopStream,
      delay
    } = options;

    const [data, setData] = useState('No result');
    const [stopStreamState, setStopStream] = useState(stopStream);
    const [scannerLighting, setScannerLighting] = useState(torch)
    const [facingModeState, setFacingModeState] = useState(facingMode)

    B.defineFunction('toggleLighting', () => setScannerLighting((s) => !s));
    B.defineFunction('toggleStopStream', () => setStopStream((s) => !s));
    B.defineFunction('toggleCamera', () => setFacingModeState(facingModeState === "environment" ? "user" : "environment"));


    console.log(facingModeState)
    if (isDev) return <div><img src="https://assets.bettyblocks.com/25b3c337837b4838b382c50c0e5f3fc2_assets/files/barcode.gif" /></div>

    return (
      <div>
        <BarcodeScannerComponent
          width={imagePreviewWidth}
          height={imagePreviewHeight}
          facingMode={facingModeState}
          torch={scannerLighting}
          delay={delay}
          onUpdate={(err, result) => {
            if (result) {
              setData(result.text);
              B.triggerEvent('OnCodeScanned', result.text);
            }
            else setData("Not Found");
          }}
          stopStream={stopStreamState}
        />
      </div>
    );
  })(),
  styles: B => t => {
    const { color: colorFunc, Styling } = B;
    const style = new Styling(t);
    return {
      root: {
        display: 'block',
      },
    };
  },
}))();
