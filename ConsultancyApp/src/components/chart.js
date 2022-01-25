(() => ({
	name: 'Chart',
	type: 'CONTAINER_COMPONENT',
	allowedTypes: [],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const { env, useAllQuery, useFilter, useText, getProperty } = B;
		const isDev = env === 'dev';
		const {
			model,
			filter,
			labels,
			title,
			properties,
			xAxisProperty,
			serieColors,
			chartType,
			stacked,
			dataLabel,
			hideYAxis,
			xAxisTitle,
			yAxisTitle,
			showTooltip,
			showGrid,
			showLegend,
			legendPosition,
			color,
			backgroundColor,
			divHeight,
		} = options;
		const Chart = window.Charts;
		const { Skeleton } = window.MaterialUI.Lab;

		const chartTitle = useText(title);
		const props = properties.split('\n');
		const colors = serieColors ? serieColors.split('\n') : undefined;
		const xAxisProp =
			!isDev && xAxisProperty ? getProperty(xAxisProperty).name : [];
		const parsedYAxisTitle = useText(yAxisTitle);
		const parsedXAxisTitle = useText(xAxisTitle);
		const [newFilter, setNewFilter] = useState({});

		B.defineFunction('updateFilter', (updatedFilter) => {
			debugger;
			if (updatedFilter.filter != undefined) {
				setNewFilter((prevFilter) => ({
					...prevFilter,
					[updatedFilter.label]: updatedFilter.filter['_and'][0],
				}));
			} else {
				const filterCopy = { ...newFilter };
				delete filterCopy[updatedFilter.label];
				setNewFilter(filterCopy);
			}
		});

		let defaultSeries = [{ data: [450, 40] }];
		let defaultLabels = ['Panda', 'Unicorn'];

		const background = !isDev
			? artifact.theme.colors[backgroundColor.toLowerCase()]
			: 'white';
		const barColor = !isDev
			? artifact.theme.colors[color.toLowerCase()]
			: 'blue';

		const defaultOptions = {
			options: {
				chart: {
					type: chartType,
					stacked: stacked,
					toolbar: {
						show: true,
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
				yaxis: {
					show: !hideYAxis,
					min: 0,
					title: {
						text: parsedYAxisTitle,
					},
				},
				xaxis: {
					title: {
						text: parsedXAxisTitle,
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

		// const getDataUri = () => {
		// 	ApexCharts.exec(chartIdentifier, 'dataURI').then(({ imgURI }) => {
		// 		B.triggerEvent('sendChartImage', { name: inputName, value: imgURI });
		// 	});
		// };

		const chartOptions = !isDev && {
			options: {
				chart: {
					type: chartType,
					stacked: stacked,
					toolbar: {
						show: true,
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
					forceNiceScale: true,
					decimalsInFloat: 0,
					title: {
						text: '',
						rotate: -90,
					},
					labels: {
						formatter: function(val) {
							return val.toFixed(0);
						},
					},
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
					y: {
						formatter: function(value, opts) {
							const description =
								opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
									.description;

							return description;
						},
					},
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
			...(Object.values(newFilter).length > 0
				? {
						_and: Object.values(newFilter),
				  }
				: {}),
		};

		const FetchChart = () => {
			const { loading, error, data, refetch } =
				model &&
				useAllQuery(model, {
					rawFilter: where,
					skip: 0,
					take: 6,
				});

			B.defineFunction('Refetch', () => {
				refetch();
			});

			if (loading) {
				B.triggerEvent('onLoad', loading);
				return (
					<div>
						<Skeleton
							width='100%'
							height={150}
							variant='rect'
							animation='wave'
						/>
					</div>
				);
			}

			if (error) {
				B.triggerEvent('onError', error.message);
				return null;
			}

			if (data && data.id) {
				B.triggerEvent('onSuccess', data);
			} else {
				B.triggerEvent('onNoResults');
			}
			let series = [];
			let categories = [];

			if (data != undefined && data.results.length > 0) {
				const chartData = data.results.reverse();

				const parsedYAxisTitle =
					!hideYAxis && yAxisTitle !== undefined ? useText(yAxisTitle) : null;
				const parsedXAxisTitle =
					xAxisTitle !== undefined ? useText(xAxisTitle) : null;

				const labelsArray = labels.split('\n');
				labelsArray.forEach((serieLabel) =>
					series.push({ name: serieLabel, data: [] })
				);
				chartData.forEach((serie) => {
					categories.push(serie[xAxisProp]);
					props !== undefined
						? props.forEach((prop, propIndex) => {
								series[propIndex].data.push({
									x:
										propIndex == 0
											? 'Low'
											: propIndex === 1
											? 'Medium'
											: 'High',
									y: serie[prop],
									description:
										serie[
											propIndex == 0
												? 'companiesLow'
												: propIndex === 1
												? 'companiesMedium'
												: 'companiesHigh'
										],
								});
						  })
						: serieProps.forEach((serieProp, propIndex) =>
								series[propIndex].data.push(serie[serieProp])
						  );
				});

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
		};
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
