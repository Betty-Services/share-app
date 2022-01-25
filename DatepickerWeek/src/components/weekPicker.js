(() => ({
  name: 'WeekPicker',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const {
      disabled,
      error,
      placeholder,
      variant,
      inputvariant,
      dateFormat,
      size,
      fullWidth,
      margin,
      helperText,
      disableToolbar,
      hideLabel,
      customModelAttribute: customModelAttributeObj,
      nameAttribute,
      locale,
      clearable,
    } = options;
    const { env, getCustomModelAttribute, useText } = B;
    const { MuiPickersUtilsProvider, DatePicker } = window.MaterialUI.Pickers;
    const { IconButton } = window.MaterialUI.Core;
    const clsx = window.clsx;
    const moment = window.moment;
    const MomentUtils = window.MomentUtils;
    const {
      momentNlLocale,
      momentEnLocale,
    } = window.MaterialUI.MomentDateLocales;
    const isDev = env === 'dev';
    const [selectedDate, setSelectedDate] = useState(null);
    const helper = useText(helperText);
    const placeholderText = useText(placeholder);

    useEffect(() => {
      if (selectedDate) {
        B.triggerEvent('onChange', selectedDate);
      }
    }, [selectedDate]);

    const localeMap = {
      nl: momentNlLocale,
      en: momentEnLocale,
    };

    const {
      id: customModelAttributeId,
      label = [],
      value: defaultValue = [],
      required: defaultRequired = false,
    } = customModelAttributeObj;
    const strDefaultValue = useText(defaultValue, { rawValue: true });
    const labelText = useText(label);
    const customModelAttribute = getCustomModelAttribute(
      customModelAttributeId,
    );
    const {
      name: customModelAttributeName,
      validations: { required: attributeRequired } = {},
    } = customModelAttribute || {};
    const required = customModelAttribute ? attributeRequired : defaultRequired;
    const nameAttributeValue = useText(nameAttribute);
    const isValidDate = date => date && date.isValid() && !isNaN(date);

    const changeHandler = date => {
      if (date) {
        setSelectedDate(date.startOf('isoWeek'));
      } else {
        setSelectedDate(null);
      }
    };

    const setDefaultDate = () => {
      if (!selectedDate && strDefaultValue) {
        const propDefaultParse = moment(strDefaultValue);

        if (isValidDate(propDefaultParse)) {
          setSelectedDate(propDefaultParse);
        } else {
          setSelectedDate(moment('00:00:00').format('HH:mm:ss'));
        }
      }
    };

    B.defineFunction('Clear', () => setSelectedDate(null));

    !isDev && setDefaultDate();

    const resultString = isValidDate(selectedDate)
      ? moment(selectedDate).format('YYYY-MM-DD')
      : null;

    const formatWeekSelectLabel = date => {
      if (date) return moment(date).format(dateFormat);
      return '';
    };

    const wrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
      let selectedDateClone = selectedDate.clone();

      const start = selectedDateClone.startOf('week').toDate();
      const end = selectedDateClone.endOf('week').toDate();

      const dayIsBetween = date.isBetween(start, end, null, []);
      const isFirstDay = date.isSame(start, 'day');
      const isLastDay = date.isSame(end, 'day');

      const isFirstDayOfWeek = date.isoWeekday() === 1;
      const isWeekActive = date.isoWeek() === selectedDate.isoWeek();

      const wrapperClassName = clsx({
        [classes.default]:
          !dayIsBetween && !isFirstDay && !isLastDay && !isFirstDayOfWeek,
        [classes.highlight]: dayIsBetween,
        [classes.firstHighlight]: isFirstDay,
        [classes.endHighlight]: isLastDay,
        [classes.firstDayOfWeek]: isFirstDayOfWeek,
      });

      const dayClassName = clsx({
        [classes.day]: true,
        [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
        [classes.highLightNonCurrentMonthDay]:
          !dayInCurrentMonth && dayIsBetween,
      });

      const weekNumberClassName = clsx({
        [classes.weekNumber]: true,
        [classes.weekNumberHighlight]: isWeekActive,
      });

      return (
        <div className={classes.dayWrapper}>
          {isFirstDayOfWeek && (
            <div className={weekNumberClassName}>{date.isoWeek()}</div>
          )}
          <div className={wrapperClassName}>
            <IconButton className={dayClassName}>
              <span>{date.format('DD')}</span>
            </IconButton>
          </div>
        </div>
      );
    };

    const inputProps = {
      name: nameAttributeValue || customModelAttributeName,
      tabIndex: isDev && -1,
    };

    const popoverProps = {
      classes: {
        root: classes.popover,
      },
    };

    const DateCmp = (
      <DatePicker
        name={nameAttributeValue || customModelAttributeName}
        value={selectedDate}
        size={size}
        autoOk={true}
        classes={{ root: classes.formControl }}
        variant={variant}
        placeholder={placeholderText}
        fullWidth={fullWidth}
        onChange={changeHandler}
        inputVariant={inputvariant}
        InputProps={{
          inputProps: inputProps,
        }}
        required={required}
        disabled={disabled}
        label={!hideLabel && labelText}
        error={error}
        margin={margin}
        helperText={helper}
        disableToolbar={disableToolbar}
        format="dd-mm-yyyy"
        PopoverProps={popoverProps}
        DialogProps={{
          className: classes.dialog,
        }}
        clearable={clearable}
        renderDay={wrappedWeekDay}
        labelFunc={formatWeekSelectLabel}
      />
    );

    return isDev ? (
      <div className={classes.root}>
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          libInstance={moment}
          locale={localeMap[locale]}
        >
          {variant === 'static' ? (
            <div className={classes.static}>{DateCmp}</div>
          ) : (
            DateCmp
          )}
        </MuiPickersUtilsProvider>
      </div>
    ) : (
      <MuiPickersUtilsProvider utils={MomentUtils} locale={localeMap[locale]}>
        <input
          type="hidden"
          name={nameAttributeValue || customModelAttributeName}
          value={resultString}
        />
        {variant === 'static' ? (
          <div className={classes.static}>{DateCmp}</div>
        ) : (
          DateCmp
        )}
      </MuiPickersUtilsProvider>
    );
  })(),
  styles: B => t => {
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
      default: {
        color: 'inherit',
      },
      highlight: {
        backgroundColor: ({ options: { backgroundColorPopup } }) => [
          style.getColor(backgroundColorPopup),
          '!important',
        ],
        color: '#fff',
      },
      endHighlight: {
        extend: 'highlight',
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
      },
      firstHighlight: {
        extend: 'highlight',
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
      },
      dayWrapper: {
        position: 'relative',
      },
      day: {
        width: 36,
        height: 36,
        fontSize: '12px !important',
        margin: '0 2px !important',
        color: 'inherit !important',
      },
      customDayHighlight: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '2px',
        right: '2px',
      },
      weekNumber: {
        position: 'absolute',
        fontSize: '12px',
        color: '#000',
        opacity: 0.3,
        top: 7,
        left: -12,
        padding: 4,
        width: 15,
        height: 15,
        textAlign: 'center',
      },
      weekNumberHighlight: {
        backgroundColor: ({ options: { backgroundColorPopup } }) => [
          style.getColor(backgroundColorPopup),
          '!important',
        ],
        borderRadius: '50%',
        opacity: 1,
        color: '#fff',
      },
      nonCurrentMonthDay: {
        color: '#C6C6C6 !important',
      },
      highLightNonCurrentMonthDay: {
        color: '#676767 !important',
      },
    };
  },
}))();
