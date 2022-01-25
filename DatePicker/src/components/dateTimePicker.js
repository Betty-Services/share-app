(() => ({
	name: 'CustomDateTimePicker',
	type: 'CONTENT_COMPONENT',
	allowedTypes: [],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const {
			enableDates,
			setDates,
			model,
			filter,
			enabledDateProperty,
			disabled,
			minDate,
			maxDate,
			initialFocusDate,
			error,
			placeholder,
			disableManual,
			variant,
			clearable,
			autoOk,
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
		const {
			env,
			getCustomModelAttribute,
			useText,
			getProperty,
			useAllQuery,
			useFilter,
		} = B;
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
		const enabledDatesProp = getProperty(enabledDateProperty) || {};
		const [enabledDates, setEnabledDates] = useState([]);
		const [open, setOpen] = useState(false);

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
		const parsedInitialFocusDate =
			defaultValue.length > 0
				? new Date(strDefaultValue)
				: useText(initialFocusDate) !== ''
				? new Date(useText(initialFocusDate))
				: new Date();
		const parsedMinDate = useText(minDate);
		const parsedMaxDate = useText(maxDate);
		const [currentDate, setCurrentDate] = useState(parsedInitialFocusDate);

		const monthChanged = (date) => {
			setCurrentDate(date);
		};

		const getFirstDayOfTheMonth = () => {
			const firstDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				1
			);
			if (enabledDatesProp.kind === 'date') {
				firstDay.setMinutes(
					currentDate.getMinutes() - currentDate.getTimezoneOffset()
				);
				return firstDay.toJSON().slice(0, 10);
			}
			return firstDay.toISOString();
		};
		const getLastDayOfTheMonth = () => {
			const lastDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() + 1,
				0
			);
			if (enabledDatesProp.kind === 'date') {
				lastDay.setMinutes(
					currentDate.getMinutes() - currentDate.getTimezoneOffset()
				);
				return lastDay.toJSON().slice(0, 10);
			}
			return lastDay.toISOString();
		};

		if (!isDev && enableDates) {
			const mergedFilter = {
				...filter,
				...{
					[enabledDatesProp.id]: {
						gteq: getFirstDayOfTheMonth(),
						lteq: getLastDayOfTheMonth(),
					},
				},
			};

			const { loading, error: err, data: { results } = {}, refetch } =
				model &&
				useAllQuery(model, {
					filter: mergedFilter,
					skip: 0,
					take: 200,
					onCompleted(res) {
						const hasResult = res && res.results && res.results.length > 0;

						if (hasResult) {
							setEnabledDates(
								res.results.map((item) => item[enabledDatesProp.name])
							);
							B.triggerEvent('onSuccess', res.results);
						} else {
							B.triggerEvent('onNoResults');
						}
					},
					onError(resp) {
						B.triggerEvent('onError', resp);
					},
				});
		}

		const changeHandler = (date) => {
			setSelectedDate(date);
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

		const disableDates = (date) => {
			const compareDate = new Date(
				date.getTime() - date.getTimezoneOffset() * 60000
			)
				.toJSON()
				.slice(0, 10);
			const matchingDate = enabledDates.find(
				(dateItem) => dateItem === compareDate
			);
			if (matchingDate != undefined) {
				return setDates === 'enable' ? false : true;
			}
			return setDates === 'enable' ? true : false;
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
					: null;
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
				open={open}
				initialFocusedDate={parsedInitialFocusDate}
				minDate={parsedMinDate || undefined}
				maxDate={parsedMaxDate || undefined}
				name={nameAttributeValue || customModelAttributeName}
				value={selectedDate}
				size={size}
				classes={{ root: classes.formControl }}
				variant={variant}
				clearable={clearable}
				autoOk={autoOk}
				placeholder={placeholderText}
				fullWidth={fullWidth}
				onChange={changeHandler}
				onMonthChange={monthChanged}
				onClick={() => (disableManual ? setOpen(true) : null)}
				onKeyDown={ (e) => {
					if(disableManual == true){
					e.preventDefault();
					}
			}}
				
				onClose={() => setOpen(false)}
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
				shouldDisableDate={disableDates}
				keyboardIcon={
					type === 'time' ? (
						<AccessTime onClick={() => setOpen(true)} />
					) : (
						<Event onClick={() => setOpen(true)} />
					)
				}
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
