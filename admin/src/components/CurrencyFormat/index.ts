<<<<<<< HEAD
const currencyFormat = ({ paramFirst, paramSecond }: { paramFirst: number, paramSecond: number }) => {
    const result = Math.round((paramFirst / (1 - paramSecond / 100)) / 1000) * 1000;
    return result?.toLocaleString();
}
=======
const currencyFormat = ({
  paramFirst,
  paramSecond,
}: {
  paramFirst: number;
  paramSecond: number;
}) => {
  const result = Math.round(paramFirst / (1 - paramSecond / 100) / 1000) * 1000;
  return result?.toLocaleString();
};
>>>>>>> trung

export default currencyFormat;
