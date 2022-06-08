(() => ({
	name: 'SelfbuilderLevelChart',
	type: 'CONTAINER_COMPONENT',
	allowedTypes: [],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const {
			env,
			Query,
			useAllQuery,
			useFilter,
			useText,
			getProperty,
			getModel,
		} = B;
		const { gql } = window;
		const isDev = env === 'dev';
		const {
			model,
			filter,
			labels,
			title,
			properties,
			xAxisProperty,
			serieLabels,
			serieProperties,
			serieColors,
			chartType,
			stacked,
			dataLabel,
			hideYAxis,
			yAxisTitle,
			xAxisTitle,
			showTooltip,
			showGrid,
			showLegend,
			legendPosition,
			color,
			backgroundColor,
			divHeight,
		} = options;
		const Chart = window.Charts;
		// const ApexCharts = window.ApexCharts;
		const { Skeleton } = window.MaterialUI.Lab;
		const [newFilter, setNewFilter] = useState({});
		const chartTitle = useText(title);
		const props = properties !== '' ? properties.split('\n') : undefined;
		const serieProps = serieProperties.split('\n');
		const labelsProp = labels;
		const colors = serieColors ? serieColors.split('\n') : undefined;
		const xAxisProp =
			!isDev && xAxisProperty ? getProperty(xAxisProperty).name : [];
		const parsedYAxisTitle = useText(yAxisTitle);
		const parsedXAxisTitle = useText(xAxisTitle);

		let defaultSeries = [{ data: [450, 40] }];
		let defaultLabels = ['Panda', 'Unicorn'];

		const background = !isDev
			? artifact.theme.colors[backgroundColor.toLowerCase()]
			: 'white';
		const barColor = !isDev
			? artifact.theme.colors[color.toLowerCase()]
			: 'blue';

		B.defineFunction('updateFilter', (updatedFilter) => {
			if (updatedFilter.filter != undefined) {
				setNewFilter(updatedFilter.filter);
			} else {
				setNewFilter({});
			}
		});

		const defaultOptions = {
			options: {
				chart: {
					type: chartType,
					stacked: stacked,
					toolbar: {
						show: false,
						tools: {
							download: false,
						},
					},
					background: background,
				},
				dataLabels: {
					enabled: dataLabel,
					position: 'center',
				},
				legend: {
					show: showLegend,
					position: legendPosition,
				},
				labels: defaultLabels,
				grid: {
					show: showGrid,
				},
				xaxis: {
					title: {
						text: parsedXAxisTitle,
					},
				},
				yaxis: {
					show: !hideYAxis,
					min: 0,
					title: {
						show: parsedYAxisTitle != undefined,
						text: parsedYAxisTitle,
					},
				},
				title: {
					text: chartTitle,
					align: 'center',
				},
			},
			series: defaultSeries,
		};
		const devChart = isDev && (
			<div className={[classes.root, isDev ? classes.pristine : ''].join(' ')}>
				<Chart
					options={defaultOptions.options}
					series={defaultOptions.series}
					type={chartType}
					height={divHeight}
				/>
			</div>
		);

		const chartOptions = !isDev && {
			options: {
				chart: {
					type: chartType,
					stacked: stacked,
					toolbar: {
						show: false,
						tools: {
							download: false,
						},
					},
					background: background,
				},
				labels: labels.split('\n'),
				grid: {
					show: showGrid,
				},
				dataLabels: {
					enabled: dataLabel,
					position: 'center',
				},
				legend: {
					show: showLegend,
					position: legendPosition,
				},
				colors: colors,
				yaxis: {
					show: !hideYAxis,
					tickAmount: 1,
					min: 0,
					max: 10,
					forceNiceScale: true,
					decimalsInFloat: 0,
					title: {},
				},
				xaxis: {
					labels: {
						hideOverlappingLabels: false,
						rotate: 0,
					},
					title: {},
				},
				tooltip: {
					enabled: showTooltip,
				},
				title: {
					text: chartTitle,
					align: 'center',
				},
			},
			series: [],
		};

		const where = {
			...useFilter(filter),
			...(Object.values(newFilter).length > 0 ? newFilter : {}),
		};

		const FetchChart = () => {
			const queryKey = `all${getModel(model).name}`;
			const q =
				'query ($skip: Int, $take: Int) {\
        ' +
				queryKey +
				'(skip: $skip, take: $take, where: $where) {\
            results {\
              fullName\
              selfbuilderLevels {\
                level\
              }\
            }\
            totalCount\
        }\
      }';

			const g = gql(q);
			return (
				<Query query={g} variables={{ where, skip: 0, take: 200 }}>
					{({ loading, error, data, refetch }) => {
						if (data && !loading && !error) {
							const { results: chartData, totalCount } = data[queryKey];
							let series = [];
							if (chartData != undefined && chartData.length > 0) {
								const parsedYAxisTitle =
									!hideYAxis && yAxisTitle !== undefined
										? useText(yAxisTitle)
										: null;
								const parsedXAxisTitle =
									xAxisTitle !== undefined ? useText(xAxisTitle) : null;

								let amounts = [];

								chartData.forEach((selfbuilder, index) => {
									let count = 0;
									series.push({ name: selfbuilder.fullName, data: [] });
									selfbuilder.selfbuilderLevels.forEach((selfbuilderLevel) => {
										count++;
										series[index].data.push(selfbuilderLevel.level);
									});
									amounts.push(count);
								});
								const highestAmount = Math.max(...amounts);
								const categories = Array.from(
									new Array(highestAmount),
									(x, i) => i + 1
								);
								chartOptions.options.xaxis.categories = categories;
								chartOptions.options.yaxis.title.text = parsedYAxisTitle
									? parsedYAxisTitle
									: '';
								chartOptions.options.xaxis.title.text = parsedXAxisTitle
									? parsedXAxisTitle
									: '';
							}

							return (
								data && (
									<div className={classes.root}>
										<Chart
											options={chartOptions.options}
											series={series}
											type={chartType}
											height={divHeight}
										/>
									</div>
								)
							);
						}

						return <></>;
					}}
				</Query>
			);
		};

		// const FetchChart = () => {
		// 	const { loading, error, data, refetch } =
		// 		model &&
		// 		useAllQuery(model, {
		// 			rawFilter: where,
		// 			skip: 0,
		// 			take: 200,
		// 		});

		// 	B.defineFunction('Refetch', () => {
		// 		refetch();
		// 	});

		// 	if (loading) {
		// 		B.triggerEvent('onLoad', loading);
		// 		return (
		// 			<div>
		// 				<Skeleton
		// 					width='100%'
		// 					height={150}
		// 					variant='rect'
		// 					animation='wave'
		// 				/>
		// 			</div>
		// 		);
		// 	}

		// 	if (error) {
		// 		B.triggerEvent('onError', error.message);
		// 		return null;
		// 	}

		// 	if (data && data.id) {
		// 		B.triggerEvent('onSuccess', data);
		// 	} else {
		// 		B.triggerEvent('onNoResults');
		// 	}

		return isDev ? <div>{devChart}</div> : FetchChart();
	})(),

	styles: (B) => (t) => {
		const style = new B.Styling(t);
		return {
			root: {
				height: '100%',
				width: '100%',
			},
			hidden: {
				visibility: 'hidden',
				zIndex: '-999',
				position: 'absolute',
				width: '800px',
				height: '300px',
			},
			empty: {
				display: 'flex',
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
			dataSets: {
				color: '#eb4034',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
			},
		};
	},
}))();
