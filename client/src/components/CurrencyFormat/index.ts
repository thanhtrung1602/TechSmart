const currencyFormat = ({
  paramFirst,
  paramSecond,
}: {
  paramFirst: number;
  paramSecond: number;
}) => {
  console.log("paramFirst", Number(paramFirst));
  const result =
    Math.round(Number(paramFirst) / (1 - paramSecond / 100) / 1000) * 1000;
  return result?.toLocaleString();
};

export default currencyFormat;
