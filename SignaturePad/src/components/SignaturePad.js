(() => ({
	name: 'SignaturePad',
	type: 'CONTENT_COMPONENT',
	allowedTypes: [],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const { env, getCustomModelAttribute, useText } = B;
		const SignaturePad = window.SignaturePad;
		const { Input, FormHelperText, InputLabel } = window.MaterialUI.Core;
		const {
			helperText,
			penColor,
			error,
			validationValueMissing,
			hideLabel,
			customModelAttribute: customModelAttributeObj,
			nameAttribute,
			height,
			width
		} = options;
		const isDev = env === 'dev';
		const { id: customModelAttributeId, label = [] } = customModelAttributeObj;
		const labelText = useText(label);
		const customModelAttribute = getCustomModelAttribute(
			customModelAttributeId
		);
		const { name: customModelAttributeName, validations: { required } = {} } =
			customModelAttribute || {};
		const nameAttributeValue = useText(nameAttribute);
		const requiredText = required ? '*' : '';
		const [errorState, setErrorState] = useState(error);
		const [value, setValue] = useState('');
		const signaturePadRef = useRef(null);
		const [helper, setHelper] = useState(useText(helperText));


		B.defineFunction('ClearSignature', () => {
			setValue('');
			signaturePadRef.current.clear();
		});

		const handleChange = () => {
      console.log("handle change!")
			if (!signaturePadRef.current.isEmpty()) {
				const image = signaturePadRef.current.toDataURL();
				const splittedImage = image.split(',');
				setValue(splittedImage[splittedImage.length - 1]);
			}
		};


		const handleValidation = (validation) => {
			setErrorState(!validation.valid);
			const message = useText(validationValueMissing) || useText(helperText);
			setHelper(message);
		};

		const invalidHandler = (event) => {
			event.preventDefault();
			const {
				target: { validity },
			} = event;
			handleValidation(validity);
		};

	
		const Control = () => (
			<>
				<InputLabel
					classes={{
						root: classes.label,
					}}
				>
					{hideLabel ? '' : `${labelText}${requiredText}`}
				</InputLabel>
				<div
					className={[
						classes.signaturePad,
					].join(' ')}
					onMouseUp={handleChange}
				>
					<SignaturePad
						ref={signaturePadRef}
						redrawOnResize={true}
						options={{ penColor: penColor, onEnd: handleChange }}
						canvasProps={{width: width, height: height - 16}}
					/>

					<Input
						classes={{ input: classes.input }}
						name={nameAttributeValue || customModelAttributeName}
						value={value}
						required={required}
						onInvalid={invalidHandler}
						onChange={invalidHandler}
						error={errorState}
					/>
				</div>
				{helper && (
					<FormHelperText
						className={errorState ? classes.error : classes.helper}
					>
						{helper}
					</FormHelperText>
				)}
			</>
		);

    

		return isDev ? <div className={classes.root}>{Control()}</div> : Control();
	})(),
	styles: (B) => (t) => {
		const { color: colorFunc, env, Styling } = B;
		const style = new Styling(t);

		const getOpacColor = (col, val) => colorFunc.alpha(col, val);

		return {
			root: {
				height: ({ options: { height } }) => height,
				width: ({ options: { width } }) => width,
				fontSize: '0.75rem',
				color: '#262A3A',
				boxSizing: 'border-box',
				borderWidth: '0.0625rem',
				borderColor: '#AFB5C8',
				borderStyle: 'dashed',
				backgroundColor: '#F0F1F5',
				
			},
			signaturePad: {
				height: ({ options: { height } }) => height -16,
				width: ({ options: { width } }) => width,
				display: 'inline-block',
				border: '1px solid',
				borderRadius: '4px',
				borderColor: ({ options: { borderColor } }) => [
					style.getColor(borderColor),
					'!important',
				],
			},

			label: {
				height: '16px',
				marginLeft: '0!important',
				pointerEvents: env === 'dev' && 'none',
				alignItems: 'start!important',
				color: ({ options: { labelColor } }) => [
					style.getColor(labelColor),
					'!important',
				],
				'&.Mui-error': {
					color: ({ options: { errorColor } }) => [
						style.getColor(errorColor),
						'!important',
					],
				},
			},
			helper: {
				color: ({ options: { helperColor } }) => [
					style.getColor(helperColor),
					'!important',
				],
			},
			error: {
				color: ({ options: { errorColor } }) => [
					style.getColor(errorColor),
					'!important',
				],
			},
			input: {
				display: 'none !important',
			},
			control: {
				display: 'inline-flex',
				alignItems: 'center',
			},
			span: {
				flex: 1,
				textAlign: 'start',
				marginBottom: '0.1875rem!important',
				marginRight: '1rem!important',
			},
			messageContainer: {
				flexWrap: 'wrap',
				paddingTop: '1.25rem',
				color: ({ options: { textColor } }) => [
					style.getColor(textColor),
					'!important',
				],
				'& .MuiIconButton-root': {
					color: ({ options: { textColor } }) => [
						getOpacColor(style.getColor(textColor), 0.54),
						'!important',
					],
				},
			},
			listView: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			},
			gridView: {
				display: 'flex',
			},
			gridItem: {
				display: 'flex',
				borderRadius: '0.3125rem',
				flexDirection: 'column',
				border: ' 0.0625rem solid #eee',
				marginRight: '1rem',
				marginBottom: '1rem',
			},
			gridItemDetails: {
				maxWidth: ({ options: { imagePreviewWidth, showImagePreview } }) =>
					showImagePreview ? imagePreviewWidth : 'auto',
				display: 'flex',
				margin: '1rem',
				justifyContent: 'space-between',
			},
			deleteIcon: {
				color: `${t.colors.light}!important`,
			},
			remove: {
				height: '1.875rem',
				padding: '0.25rem!important',
			},
		};
	},
}))();