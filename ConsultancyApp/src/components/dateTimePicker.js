(() => ({
	name: 'DateTimePicker',
	type: 'CONTENT_COMPONENT',
	allowedTypes: [],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const {
			useAsFilter,
			filterBy,
			filterType,
			disabled,
			error,
			placeholder,
			variant,
			inputvariant,
			type,
			dateFormat,
			timeFormat,
			dateTimeFormat,
			size,
			fullWidth,
			margin,
			helperText,
			disableToolbar,
			hideLabel,
			customModelAttribute: customModelAttributeObj,
			use24HourClockDateTime,
			use24HourClockTime,
			nameAttribute,
			locale,
		} = options;
		const { env, getCustomModelAttribute, useText, useFilter, getProperty } = B;
		const {
			MuiPickersUtilsProvider,
			KeyboardTimePicker,
			KeyboardDatePicker,
			KeyboardDateTimePicker,
		} = window.MaterialUI.Pickers;
		const { DateFnsUtils } = window.MaterialUI;
		const { nlLocale, enLocale } = window.MaterialUI.DateLocales;
		const { AccessTime, Event } = window.MaterialUI.Icons;
		const DateFns = new DateFnsUtils();
		const isDev = env === 'dev';
		const [selectedDate, setSelectedDate] = useState(null);
		const helper = useText(helperText);
		const placeholderText = useText(placeholder);
		const rawFilterBy = isDev ? null : useFilter(Object.values(filterBy)[0][0]);
		const filterProp = isDev
			? null
			: Object.keys(Object.values(filterBy)[0][0]);
		const filterPropType = isDev ? null : getProperty(filterProp[0]).kind;

		const localeMap = {
			nl: nlLocale,
			en: enLocale,
		};

		const {
			id: customModelAttributeId,
			label = [],
			value: defaultValue = [],
		} = customModelAttributeObj;
		const strDefaultValue = useText(defaultValue);
		const labelText = useText(label);
		const customModelAttribute = getCustomModelAttribute(
			customModelAttributeId
		);
		const { name: customModelAttributeName, validations: { required } = {} } =
			customModelAttribute || {};
		const nameAttributeValue = useText(nameAttribute);
		const isValidDate = (date) => date instanceof Date && !isNaN(date);

		const toJSONLocal = (date) => {
			var local = new Date(date);
			local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
			return local.toJSON().slice(0, 10);
		};

		const changeHandler = (date) => {
			setSelectedDate(date);
			if (useAsFilter) {
				if (date !== null && date.toString() !== 'Invalid Date') {
					const value = getDeepestObject(rawFilterBy);
					const parsedDate =
						filterPropType === 'date' ? toJSONLocal(date) : date.toISOString();
					setDeepestKey(rawFilterBy, value, parsedDate);
					B.triggerEvent('sendFilter', {
						filter: rawFilterBy,
						label: labelText,
					});
				} else {
					B.triggerEvent('sendFilter', { filter: undefined, label: labelText });
				}
			}
		};

		const getDeepestObject = (obj) => {
			if (typeof obj[Object.keys(obj)] === 'object') {
				return getDeepestObject(obj[Object.keys(obj)]);
			}
			return obj;
		};

		const setDeepestKey = (obj, value, newCurrentValue) => {
			if (Object.values(obj).includes(value)) {
				const key = Object.keys(obj);
				return (obj[key] = { [filterType]: newCurrentValue });
			}
			return setDeepestKey(obj[Object.keys(obj)], value, newCurrentValue);
		};

		const setDefaultDate = (defaultFormat, givenFormat) => {
			if (!selectedDate && strDefaultValue) {
				const propDefaultParse = defaultFormat
					? DateFns.parse(strDefaultValue, defaultFormat)
					: new Date(strDefaultValue);
				const formatDefaultParse = DateFns.parse(strDefaultValue, givenFormat);

				if (isValidDate(propDefaultParse)) {
					setSelectedDate(propDefaultParse);
				} else if (isValidDate(formatDefaultParse)) {
					setSelectedDate(formatDefaultParse);
				} else {
					setSelectedDate(DateFns.parse('00:00:00', 'HH:mm:ss'));
				}
			}
		};

		B.defineFunction('Clear', () => setSelectedDate(null));

		let DateTimeComponent;
		let format;
		let resultString;
		let use24HourClock = true;

		switch (type) {
			case 'date': {
				DateTimeComponent = KeyboardDatePicker;
				format = dateFormat || 'dd/MM/yyyy';

				setDefaultDate('yyyy-MM-dd', format);

				resultString = isValidDate(selectedDate)
					? DateFns.format(selectedDate, 'yyyy-MM-dd')
					: null;
				break;
			}
			case 'datetime': {
				DateTimeComponent = KeyboardDateTimePicker;
				format = dateTimeFormat || 'dd/MM/yyyy HH:mm:ss';
				use24HourClock = use24HourClockDateTime;

				setDefaultDate(null, format);

				resultString = isValidDate(selectedDate)
					? new Date(selectedDate).toISOString()
					: new Date().toISOString();
				break;
			}
			case 'time': {
				DateTimeComponent = KeyboardTimePicker;
				format = timeFormat || 'HH:mm:ss';
				use24HourClock = use24HourClockTime;

				setDefaultDate('HH:mm:ss', format);

				resultString = isValidDate(selectedDate)
					? DateFns.format(selectedDate, 'HH:mm:ss')
					: null;
				break;
			}
			default:
		}

		const DateTimeCmp = (
			<DateTimeComponent
				name={nameAttributeValue || customModelAttributeName}
				value={selectedDate}
				size={size}
				classes={{ root: classes.formControl }}
				variant={variant}
				placeholder={placeholderText}
				fullWidth={fullWidth}
				onChange={changeHandler}
				inputVariant={inputvariant}
				InputProps={{
					inputProps: {
						name: nameAttributeValue || customModelAttributeName,
						tabIndex: isDev && -1,
					},
				}}
				KeyboardButtonProps={{
					tabIndex: isDev && -1,
				}}
				required={required}
				disabled={disabled}
				label={!hideLabel && labelText}
				error={error}
				margin={margin}
				helperText={helper}
				disableToolbar={disableToolbar}
				format={format}
				PopoverProps={{
					classes: {
						root: classes.popover,
					},
				}}
				DialogProps={{
					className: classes.dialog,
				}}
				ampm={!use24HourClock}
				keyboardIcon={type === 'time' ? <AccessTime /> : <Event />}
			/>
		);

		return isDev ? (
			<div className={classes.root}>
				<MuiPickersUtilsProvider
					utils={DateFnsUtils}
					locale={localeMap[locale]}
				>
					{variant === 'static' ? (
						<div className={classes.static}>{DateTimeCmp}</div>
					) : (
						DateTimeCmp
					)}
				</MuiPickersUtilsProvider>
			</div>
		) : (
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[locale]}>
				<input
					type='hidden'
					name={nameAttributeValue || customModelAttributeName}
					value={resultString}
				/>
				{variant === 'static' ? (
					<div className={classes.static}>{DateTimeCmp}</div>
				) : (
					DateTimeCmp
				)}
			</MuiPickersUtilsProvider>
		);
	})(),
	styles: (B) => (t) => {
		const { Styling } = B;
		const style = new Styling(t);
		return {
			root: {
				display: ({ options: { fullWidth } }) =>
					fullWidth ? 'block' : 'inline-block',
				'& > *': {
					pointerEvents: 'none',
				},
			},
			dialog: {
				'& .MuiPickersToolbar-toolbar, & .MuiPickersDay-daySelected': {
					backgroundColor: ({ options: { backgroundColorPopup } }) => [
						style.getColor(backgroundColorPopup),
						'!important',
					],
				},
				'& .MuiButton-textPrimary': {
					color: ({ options: { backgroundColorPopup } }) => [
						style.getColor(backgroundColorPopup),
						'!important',
					],
				},
			},
			popover: {
				'& .MuiPickersToolbar-toolbar, & .MuiPickersDay-daySelected': {
					backgroundColor: ({ options: { backgroundColorPopup } }) => [
						style.getColor(backgroundColorPopup),
						'!important',
					],
				},
			},
			formControl: {
				'& > label': {
					color: ({ options: { labelColor } }) => [
						style.getColor(labelColor),
						'!important',
					],
					zIndex: ({ options: { inputvariant } }) =>
						inputvariant === 'standard' ? 1 : null,

					'&.Mui-focused': {
						color: ({ options: { borderFocusColor } }) => [
							style.getColor(borderFocusColor),
							'!important',
						],
					},
					'&.Mui-error': {
						color: ({ options: { errorColor } }) => [
							style.getColor(errorColor),
							'!important',
						],
					},
					'&.Mui-disabled': {
						pointerEvents: 'none',
						opacity: '0.7',
					},
				},
				'& > p': {
					color: ({ options: { helperColor } }) => [
						style.getColor(helperColor),
						'!important',
					],
					'&.Mui-error': {
						color: ({ options: { errorColor } }) => [
							style.getColor(errorColor),
							'!important',
						],
					},
				},
				'& .MuiInputBase-root': {
					color: ({ options: { textColor } }) => [
						style.getColor(textColor),
						'!important',
					],
					backgroundColor: ({ options: { backgroundColor } }) => [
						style.getColor(backgroundColor),
						'!important',
					],
					'&:hover': {
						'& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
							borderColor: ({ options: { borderHoverColor } }) => [
								style.getColor(borderHoverColor),
								'!important',
							],
						},
					},
					'&.Mui-focused, &.Mui-focused:hover': {
						'& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
							borderColor: ({ options: { borderFocusColor } }) => [
								style.getColor(borderFocusColor),
								'!important',
							],
						},
					},
					'& fieldset': {
						top: ({ options: { hideLabel } }) => (hideLabel ? 0 : null),
					},
					'& legend': {
						display: ({ options: { hideLabel } }) =>
							hideLabel ? ['none', '!important'] : null,
					},
					'& input': {
						'&::placeholder': {
							color: ({ options: { placeholderColor } }) => [
								style.getColor(placeholderColor),
								'!important',
							],
						},
					},
					'&.Mui-disabled': {
						pointerEvents: 'none',
						opacity: '0.7',
					},
				},
				'& .MuiIconButton-root': {
					color: ({ options: { textColor } }) => [
						style.getColor(textColor),
						'!important',
					],
				},
				'& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
					borderColor: ({ options: { borderColor } }) => [
						style.getColor(borderColor),
						'!important',
					],
				},
				'& .MuiInput-underline, & .MuiFilledInput-underline': {
					'&::before, &::after': {
						borderColor: ({ options: { borderColor } }) => [
							style.getColor(borderColor),
							'!important',
						],
					},
					'&:hover': {
						'&::before, &::after': {
							borderColor: ({ options: { borderHoverColor } }) => [
								style.getColor(borderHoverColor),
								'!important',
							],
						},
					},
					'&.Mui-focused::before, &.Mui-focused::after, &.Mui-focused:hover::before, &.Mui-focused:hover::after': {
						borderColor: ({ options: { borderFocusColor } }) => [
							style.getColor(borderFocusColor),
							'!important',
						],
					},
				},
				'& .MuiInputBase-root.Mui-error, & .MuiInputBase-root.Mui-error:hover, & .MuiInputBase-root.Mui-error.Mui-focused, & .MuiInputBase-root.Mui-error.Mui-focused:hover': {
					'& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
						borderColor: ({ options: { errorColor } }) => [
							style.getColor(errorColor),
							'!important',
						],
					},
					'&.MuiInput-underline, &.MuiFilledInput-underline': {
						'&::before, &::after': {
							borderColor: ({ options: { errorColor } }) => [
								style.getColor(errorColor),
								'!important',
							],
						},
						'&:hover': {
							'&::before, &::after': {
								borderColor: ({ options: { errorColor } }) => [
									style.getColor(errorColor),
									'!important',
								],
							},
						},
						'&.Mui-focused::before, &.Mui-focused::after, &.Mui-focused:hover::before, &.Mui-focused:hover::after': {
							borderColor: ({ options: { errorColor } }) => [
								style.getColor(errorColor),
								'!important',
							],
						},
					},
				},
			},
			static: {
				'& .MuiPickersStaticWrapper-staticWrapperRoot': {
					'& .MuiToolbar-root, & .MuiPickersDay-daySelected': {
						backgroundColor: ({ options: { backgroundColorPopup } }) => [
							style.getColor(backgroundColorPopup),
							'!important',
						],
					},
				},
			},
		};
	},
}))();