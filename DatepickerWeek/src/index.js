import * as Core from '@material-ui/core';
import * as Lab from '@material-ui/lab';
import * as Pickers from '@material-ui/pickers';
import * as Styles from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import enLocale from 'date-fns/locale/en-US';
import nlLocale from 'date-fns/locale/nl';
import momentEnLocale from 'moment/locale/en-gb';
import momentNlLocale from 'moment/locale/nl';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import clsx from 'clsx';

import Icons from './icons';

window.MomentUtils = MomentUtils;
window.moment = moment;
window.clsx = clsx;

export default {
	Core,
	Icons,
	Lab,
	Pickers,
	Styles,
	DateFnsUtils,
	DateLocales: { enLocale, nlLocale },
	MomentDateLocales: { momentEnLocale, momentNlLocale },
};
