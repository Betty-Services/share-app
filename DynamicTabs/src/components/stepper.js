(() => ({
	name: 'DynamicStepper',
	type: 'CONTAINER_COMPONENT',
	allowedTypes: ['BODY_COMPONENT', 'CONTAINER_COMPONENT', 'CONTENT_COMPONENT'],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const {
			Stepper,
			Step,
			StepLabel,
			StepButton,
			StepContent,
			MobileStepper,
			Button,
		} = window.MaterialUI.Core;
		const { Icons } = window.MaterialUI;
		const {
			env,
			useText,
			getProperty,
			useFilter,
			useAllQuery,
			ModelProvider,
			InteractionScope,
		} = B;
		const {
			model,
			filter,
			order,
			orderBy,
			labelProperty,
			iconProperty,
			variant,
			type,
			alternativeLabel,
			buttonNext,
			buttonPrev,
		} = options;

		const isDev = env === 'dev';
		const isEmpty = children.length === 0;
		const activeStepIndex = 0;
		const [activeStep, setActiveStep] = useState(activeStepIndex);
		const buttonNextText = useText(buttonNext);
		const buttonPrevText = useText(buttonPrev);
		const isLinear = variant === 'linear';
		const numRendersRef = useRef(1);
		let steps = [];

		const handleButtons = (step) => {
			if (step === 0) {
				B.triggerEvent('onFirstStep');
			} else if (step === steps.length - 1) {
				B.triggerEvent('onLastStep');
			} else {
				B.triggerEvent('onBetweenStep');
			}
		};

		const handleNext = () => {
			setActiveStep((prevActiveStep) => {
				const nextStep = prevActiveStep + 1;
				if (nextStep > steps.length - 1) {
					return prevActiveStep;
				}
				handleButtons(nextStep);
				return nextStep;
			});
		};

		const handleBack = () => {
			setActiveStep((prevActiveStep) => {
				const nextStep = prevActiveStep - 1;
				if (nextStep < 0) {
					return prevActiveStep;
				}
				handleButtons(nextStep);
				return nextStep;
			});
		};

		const handleStep = (step) => () => {
			if (step < steps.length && step > -1) {
				handleButtons(step);
				setActiveStep(step);
			}
		};

		const BuilderLayout = () => {
			const isActive = index === activeStep;
			const hasIcon = !(iconProperty === '' || iconProperty.id === '');
			const icon = hasIcon ? 'Star' : 'None';
			let stepProps = {};
			let labelProps = {};

			const IconCmp = () =>
				hasIcon &&
				React.createElement(Icons[icon], {
					className: [
						classes.stepIcon,
						isActive ? classes.stepIconActive : '',
					].join(' '),
				});

			if (hasIcon) {
				labelProps = {
					...labelProps,
					StepIconComponent: IconCmp,
				};
			}
			return (
				<>
					<Stepper
						nonLinear={!isLinear}
						alternativeLabel={alternativeLabel}
						activeStep={activeStep}
						orientation={type}
						classes={{ root: classes.root }}
					>
						{[...Array(2)].map((e, index) => (
							<Step key={`Step ${index + 1}`} {...stepProps}>
								{isLinear ? (
									<StepLabel
										classes={{ root: classes.stepLabel }}
										{...labelProps}
									>
										{labelText}
									</StepLabel>
								) : (
									<StepButton
										classes={{ root: classes.stepButton }}
										onClick={handleStep(index)}
									>
										<StepLabel
											classes={{ root: classes.stepLabel }}
											{...labelProps}
										>
											{`Step ${index + 1}`}
										</StepLabel>
									</StepButton>
								)}
								{type === 'vertical' && (
									<StepContent>
										<div
											className={[
												classes.wrapper,
												isEmpty ? classes.empty : '',
											].join(' ')}
										>
											{children.length > 0 ? children : 'Step'}
										</div>
									</StepContent>
								)}
							</Step>
						))}
					</Stepper>
					{(type === 'horizontal' || type === 'mobile') && (
						<div
							className={[classes.wrapper, isEmpty ? classes.empty : ''].join(
								' '
							)}
						>
							{children.length > 0 ? children : 'Step'}
						</div>
					)}
				</>
			);
		};

		const orderByPath = Array.isArray(orderBy.id) ? orderBy.id : null;
		const sort =
			!isDev && orderByPath
				? orderByPath.reduceRight((acc, property, index) => {
						const prop = getProperty(property);
						return index === orderByPath.length - 1
							? { [prop.name]: order.toUpperCase() }
							: { [prop.name]: acc };
				  }, {})
				: {};

		const where = useFilter(filter);

		const { loading, error, data, refetch } =
			model &&
			useAllQuery(model, {
				rawFilter: where,
				skip: 0,
				take: 200,
				variables: {
					...(orderByPath ? { sort: { relation: sort } } : {}),
				},
				onCompleted(res) {
					const hasResult = res && res.results && res.results.length > 0;
					if (hasResult) {
						B.triggerEvent('onSuccess', res.results);
					} else {
						B.triggerEvent('onNoResults');
					}
				},
				onError(resp) {
					B.triggerEvent('onError', resp);
				},
			});

		B.defineFunction('Refetch', () => refetch());

		const mounted = useRef(false);

		useEffect(() => {
			mounted.current = true;
			return () => {
				mounted.current = false;
			};
		}, []);

		useEffect(() => {
			if (mounted.current && loading) {
				B.triggerEvent('onLoad', loading);
			}
		}, [loading]);

		const StepperCmp = () => {
			if (loading) return <div className={classes.skeleton} />;

			if (error && displayError) {
				return <span>{error.message}</span>;
			}

			const { results } = data || {};
			steps = results;

			return (
				<>
					<Stepper
						nonLinear={!isLinear}
						alternativeLabel={alternativeLabel}
						activeStep={activeStep}
						orientation={type}
						classes={{ root: classes.root }}
					>
						{results.map((item, index) => {
							const labelText =
								labelProperty === '' || labelProperty.id === ''
									? undefined
									: getProperty(labelProperty).name;
							const icon =
								iconProperty === '' || iconProperty.id === ''
									? undefined
									: getProperty(iconProperty).name;
							const isActive = index === activeStep;
							const hasIcon = icon !== undefined;

							let stepProps = {};
							let labelProps = {};

							const IconCmp = () =>
								hasIcon &&
								React.createElement(Icons[icon], {
									className: [
										classes.stepIcon,
										isActive ? classes.stepIconActive : '',
									].join(' '),
								});

							if (hasIcon) {
								labelProps = {
									...labelProps,
									StepIconComponent: IconCmp,
								};
							}

							const StepComponent = (
								<Step key={item[labelText]} {...stepProps}>
									{isLinear ? (
										<StepLabel
											classes={{ root: classes.stepLabel }}
											{...labelProps}
										>
											{item[labelText]}
										</StepLabel>
									) : (
										<StepButton
											classes={{ root: classes.stepButton }}
											onClick={handleStep(index)}
										>
											<StepLabel
												classes={{ root: classes.stepLabel }}
												{...labelProps}
											>
												{item[labelText]}
											</StepLabel>
										</StepButton>
									)}
									{type === 'vertical' && (
										<StepContent>
											<ModelProvider key={item.id} value={item} id={model}>
												<InteractionScope model={model}>
													{(context) => {
														return (
															<>
																{children.length !== 0 && isActive ? (
																	children
																) : (
																	<></>
																)}
															</>
														);
													}}
												</InteractionScope>
											</ModelProvider>
										</StepContent>
									)}
								</Step>
							);

							return StepComponent;
						})}
					</Stepper>
					{type === 'horizontal' && (
						<>
							{results.map((item, index) => {
								const isActive = index === activeStep;
								return (
									<ModelProvider key={item.id} value={item} id={model}>
										<InteractionScope model={model}>
											{(context) => {
												return (
													<>
														{children.length !== 0 && isActive ? (
															children
														) : (
															<></>
														)}
													</>
												);
											}}
										</InteractionScope>
									</ModelProvider>
								);
							})}
						</>
					)}
				</>
			);
		};

		const { KeyboardArrowLeft, KeyboardArrowRight } = Icons;

		const MobileStepperCmp = () => {
			if (loading) return <div className={classes.skeleton} />;

			if (error && displayError) {
				return <span>{error.message}</span>;
			}
			const { results } = data || {};
			steps = results;
			const maxSteps = steps.length;
			return (
				<>
					{results.map((item, index) => {
						const isActive = index === activeStep;
						return (
							<ModelProvider key={item.id} value={item} id={model}>
								<InteractionScope model={model}>
									{(context) => {
										return (
											<>
												{children.length !== 0 && isActive ? children : <></>}
											</>
										);
									}}
								</InteractionScope>
							</ModelProvider>
						);
					})}
					<MobileStepper
						steps={maxSteps}
						position='static'
						variant='text'
						activeStep={activeStep}
						classes={{ root: classes.mobileRoot }}
						nextButton={
							<Button
								size='small'
								onClick={handleNext}
								disabled={activeStep === maxSteps - 1}
								classes={{ root: classes.stepButtonMobile }}
							>
								{buttonNextText}
								<KeyboardArrowRight />
							</Button>
						}
						backButton={
							<Button
								size='small'
								onClick={handleBack}
								disabled={activeStep === 0}
								classes={{ root: classes.stepButtonMobile }}
							>
								<KeyboardArrowLeft />
								{buttonPrevText}
							</Button>
						}
					/>
				</>
			);
		};

		const StepperComponent = !isDev
			? type === 'mobile'
				? MobileStepperCmp()
				: StepperCmp()
			: null;

		B.defineFunction('NextStep', () => handleNext());
		B.defineFunction('PreviousStep', () => handleBack());

		numRendersRef.current += 1;

		return isDev ? <div>{BuilderLayout()}</div> : StepperComponent;
	})(),
	styles: (B) => (t) => {
		const { env, Styling } = B;
		const style = new Styling(t);
		const isDev = env === 'dev';
		return {
			root: {
				backgroundColor: ({ options: { backgroundColor } }) => [
					style.getColor(backgroundColor),
					'!important',
				],
				'& .MuiStepConnector-line': {
					borderColor: ({ options: { connectorColor } }) =>
						style.getColor(connectorColor),
				},
				'& .MuiStepContent-root': {
					borderColor: ({ options: { connectorColor } }) =>
						style.getColor(connectorColor),
				},
			},
			stepLabel: {
				'& .MuiStepIcon-root': {
					color: ({ options: { inactiveColor } }) =>
						style.getColor(inactiveColor),
					'&.MuiStepIcon-active': {
						color: ({ options: { activeColor } }) =>
							style.getColor(activeColor),
					},
				},
				'& .MuiStepLabel-label': {
					color: ({ options: { inactiveLabelColor } }) =>
						style.getColor(inactiveLabelColor),
					'&.MuiStepLabel-active': {
						color: ({ options: { activeLabelColor } }) =>
							style.getColor(activeLabelColor),
					},
				},
			},
			stepButton: {
				pointerEvents: isDev && 'none',
			},
			mobileRoot: {
				backgroundColor: ({ options: { backgroundColor } }) => [
					style.getColor(backgroundColor),
					'!important',
				],
				color: ({ options: { stepProgressColor } }) => [
					style.getColor(stepProgressColor),
					'!important',
				],
			},
			stepButtonMobile: {
				pointerEvents: isDev && 'none',
				color: ({ options: { activeColor } }) => [
					style.getColor(activeColor),
					'!important',
				],
				'&:disabled': {
					color: ({ options: { inactiveColor } }) => [
						style.getColor(inactiveColor),
						'!important',
					],
				},
			},
			stepIcon: {
				fill: ({ options: { inactiveColor } }) => [
					style.getColor(inactiveColor),
					'!important',
				],
			},
			stepIconActive: {
				fill: ({ options: { activeColor } }) => [
					style.getColor(activeColor),
					'!important',
				],
			},
			empty: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '2.5rem',
				fontSize: '0.75rem',
				color: '#262A3A',
				textTransform: 'uppercase',
				borderWidth: '0.0625rem',
				borderColor: '#AFB5C8',
				borderStyle: 'dashed',
				backgroundColor: '#F0F1F5',
			},
		};
	},
}))();
