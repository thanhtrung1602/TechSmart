import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Orders from '~/models/Orders';

dayjs.extend(isBetween);

type PeriodType = 'week' | 'month' | 'year';

interface RevenueData {
    revenue: number;
    startDate: Dayjs;
    endDate: Dayjs;
}

export const calculateRevenueByPeriod = (orders: Orders[], period: PeriodType): RevenueData => {
    const currentPeriod = dayjs();
    let startDate: Dayjs;
    let endDate: Dayjs;

    if (period === 'week') {
        startDate = currentPeriod.startOf('week');
        endDate = currentPeriod.endOf('week');
    } else if (period === 'month') {
        startDate = currentPeriod.startOf('month');
        endDate = currentPeriod.endOf('month');
    } else { // period === 'year'
        startDate = currentPeriod.startOf('year');
        endDate = currentPeriod.endOf('year');
    }

    const revenue = orders.reduce((total, order) => {
        const orderDate = dayjs(order.createdAt);
        if (orderDate.isBetween(startDate, endDate, null, '[]')) {
            total += order.total;
        }
        return total;
    }, 0);

    return { revenue, startDate, endDate };
};

export const calculateComparison = (orders: Orders[], period: PeriodType): number => {
    const previousPeriod = dayjs().subtract(1, period);
    const startDate = previousPeriod.startOf(period);
    const endDate = previousPeriod.endOf(period);

    return orders.reduce((total, order) => {
        const orderDate = dayjs(order.createdAt);
        if (orderDate.isBetween(startDate, endDate, null, '[]')) {
            total += order.total;
        }
        return total;
    }, 0);
};
