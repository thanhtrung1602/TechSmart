import { useState, useEffect } from 'react';

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

const Countdown = ({ targetDate }: { targetDate: string }) => {
    const calculateTimeLeft = (): TimeLeft => {
        //TargetDate chuỗi thời gian

        /*
            -> differrence sự chênh lệch thời điểm của target vs thời điểm hiện tại
            -> +newDate chuyển đổi đối tượng thành con số diện cho số milliseconds
            -> +newDate(targetDate) để chuyển chuỗi thời gian thành 1 dãi số diện cho số milliseconds
         */
        const difference = +new Date(targetDate) - +new Date();

        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                /* 
                    - Lấy số difference chia với số milliseconds trong 1 ngày để lấy days
                    - Lấy số difference chia với số milliseconds trong 1 giờ để lấy hours
                    - Lấy số difference chia với số milliseconds trong 1 phút để lấy minutes
                    - Lấy số difference chia với số milliseconds trong 1 giây để lấy seconds
                 */
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {

            //Gọi lại calculateTimeLeft() mỗi giây

            setTimeLeft(calculateTimeLeft());
        }, 1000);

        //Clean up function tránh render component cập nhật khi đã hủy
        return () => clearTimeout(timer);
    });

    const formatTimeUnit = (unit: number) => {
        return unit < 10 ? `0${unit}` : unit;
    };

    return (
        <div className="flex items-center gap-5">
            <div className="flex flex-col items-center bg-gray-200 p-3 rounded-md">
                <span className="text-3xl font-bold">{formatTimeUnit(timeLeft.days)}</span>
                <p className="text-sm text-gray-500">Days</p>
            </div>
            <div className="flex flex-col items-center bg-gray-200 p-3 rounded-md">
                <span className="text-3xl font-bold">{formatTimeUnit(timeLeft.hours)}</span>
                <p className="text-sm text-gray-500">Hours</p>
            </div>
            <div className="flex flex-col items-center bg-gray-200 p-3 rounded-md">
                <span className="text-3xl font-bold">{formatTimeUnit(timeLeft.minutes)}</span>
                <p className="text-sm text-gray-500">Minutes</p>
            </div>
            <div className="flex flex-col items-center bg-gray-200 p-3 rounded-md">
                <span className="text-3xl font-bold">{formatTimeUnit(timeLeft.seconds)}</span>
                <p className="text-sm text-gray-500">Seconds</p>
            </div>
        </div>
    );
};

export default Countdown;
