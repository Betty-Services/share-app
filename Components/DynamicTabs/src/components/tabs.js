(() => ({
	name: 'DynamicTabs',
	type: 'CONTENT_COMPONENT',
	allowedTypes: ['BODY_COMPONENT', 'CONTAINER_COMPONENT', 'CONTENT_COMPONENT'],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const { Tabs, Tab, Typography, Box } = window.MaterialUI.Core;
		const { Icons } = window.MaterialUI;
		const {
			env,
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
			variant,
			centered,
			scrollButtons,
			alignment,
			hideTabs,
			labelProperty,
			iconProperty,
			disableRipple,
			iconAlignment,
		} = options;

		const orientation =
			alignment === 'top' || alignment === 'bottom' ? 'horizontal' : 'vertical';
		const isDev = env === 'dev';
		const [value, setValue] = useState(0);

		const handleChange = (_, newValue) => {
			setValue(newValue);
		};

		const getFlexDirection = () => {
			switch (iconAlignment) {
				case 'top':
					return 'column';
				case 'right':
					return 'row-reverse';
				case 'bottom':
					return 'column-reverse';
				default:
					return 'row';
			}
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
					if (!displayError) {
						B.triggerEvent('onError', resp);
					}
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

		const Looper = (results) => {
			const tabs = results.map((item, index) => (
				<ModelProvider key={item.id} value={item} id={model}>
					<InteractionScope model={model}>
						{(context) => {
							return (
								<Typography
									component='div'
									role='tabpanel'
									hidden={value != index}
									aria-labelledby='tabs'
									classes={{ root: classes.tabRoot }}
								>
									{children.length === 0 ? <></> : children}
								</Typography>
							);
						}}
					</InteractionScope>
				</ModelProvider>
			));

			return tabs;
		};

		const TabsHeader = (results) => (
			<Tabs
				aria-label='tabs'
				onChange={handleChange}
				value={value}
				variant={variant}
				centered={centered}
				orientation={orientation}
				scrollButtons={scrollButtons}
				classes={{ root: classes.root, indicator: classes.indicator }}
			>
				{results.map((item) => {
					const label =
						labelProperty === '' || labelProperty.id === ''
							? undefined
							: getProperty(labelProperty).name;
					const icon =
						iconProperty === '' || iconProperty.id === ''
							? undefined
							: getProperty(iconProperty).name;
					const getFlexDirection = () => {
						switch (iconAlignment) {
							case 'top':
								return 'column';
							case 'right':
								return 'row-reverse';
							case 'bottom':
								return 'column-reverse';
							default:
								return 'row';
						}
					};
					return (
						<Tab
							label={
								<div
									className={classes.labelWrapper}
									style={{ flexDirection: getFlexDirection() }}
								>
									<div className={classes.iconWrapper}>
										{icon && icon !== undefined
											? React.createElement(Icons[icon])
											: undefined}
									</div>
									<div>{item[label]}</div>
								</div>
							}
							disableRipple={disableRipple}
						/>
					);
				})}
			</Tabs>
		);

		const TabGroup = () => {
			if (loading) return <div className={classes.skeleton} />;

			if (error) {
				return <span>{error.message}</span>;
			}

			const { results } = data || {};

			return (
				<div className={classes.tabs}>
					{!hideTabs && TabsHeader(results)}
					{Looper(results)}
				</div>
			);
		};

		const EmptyBox = () => {
			if (!isDev) return null;
			return (
				<Box className={classes.empty} p={3}>
					Tab
				</Box>
			);
		};

		const BuilderLayout = () => {
			return (
				<div className={classes.tabs}>
					<Tabs
						aria-label='tabs'
						onChange={handleChange}
						value={value}
						variant={variant}
						centered={centered}
						orientation={orientation}
						scrollButtons={scrollButtons}
						classes={{ root: classes.root, indicator: classes.indicator }}
					>
						<Tab
							label={
								<div
									className={classes.labelWrapper}
									style={{ flexDirection: getFlexDirection() }}
								>
									<div className={classes.iconWrapper}>
										{iconProperty === '' || iconProperty.id === ''
											? undefined
											: React.createElement(Icons['Star'])}
									</div>
									<div>Dynamic tab</div>
								</div>
							}
							disableRipple={disableRipple}
						/>
					</Tabs>

					<Typography
						component='div'
						role='tabpanel'
						aria-labelledby='tabs'
						classes={{ root: classes.tabRoot }}
					>
						{children.length === 0 ? <EmptyBox /> : children}
					</Typography>
				</div>
			);
		};

		return isDev ? (
			<div
				className={[
					classes.wrapper,
					children.length === 0 && classes.empty,
				].join(' ')}
			>
				{BuilderLayout()}
			</div>
		) : (
			TabGroup()
		);
	})(),
	styles: (B) => (t) => {
		const { env, Styling } = B;
		const style = new Styling(t);
		const isDev = env === 'dev';

		return {
			wrapper: {
				height: ({ options: { height } }) => height,
				width: ({ options: { width } }) => width,
				'& .MuiTabs-flexContainer > button': {
					pointerEvents: 'none',
				},
			},
			tabs: {
				display: 'flex',
				height: ({ options: { height } }) => (isDev ? '100%' : height),
				width: ({ options: { width } }) => (isDev ? '100%' : width),
				flexDirection: ({ options: { alignment } }) => {
					switch (alignment) {
						case 'top':
							return 'column';
						case 'right':
							return 'row-reverse';
						case 'bottom':
							return 'column-reverse';
						default:
							return 'row';
					}
				},
			},
			root: {
				backgroundColor: ({ options: { appBarColor } }) => [
					style.getColor(appBarColor),
					'!important',
				],
				color: ({ options: { textColor } }) => [
					style.getColor(textColor),
					'!important',
				],
				minWidth: '10rem',
			},
			tabRoot: {
				height: ({ options: { height } }) => (isDev ? '100%' : height),
				width: ({ options: { width } }) => (isDev ? '100%' : width),
			},
			indicator: {
				left: ({ options: { alignment } }) => alignment === 'right' && 0,
				top: ({ options: { alignment } }) => alignment === 'bottom' && 0,
				backgroundColor: ({ options: { indicatorColor } }) => [
					style.getColor(indicatorColor),
					'!important',
				],
			},
			labelWrapper: {
				display: 'flex',
				alignItems: 'center',
			},
			iconWrapper: {
				marginLeft: 5,
				marginRight: 5,
				display: 'flex',
				alignItems: 'center',
			},
			empty: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '4rem',
				fontSize: '0.75rem',
				color: '#262A3A',
				textTransform: 'uppercase',
				boxSizing: 'border-box',
				borderWidth: '0.0625rem',
				borderColor: '#AFB5C8',
				borderStyle: 'dashed',
				backgroundColor: '#F0F1F5',
			},
		};
	},
}))();
