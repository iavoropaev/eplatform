import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";

export const ExamStatistics = ({ statsData }) => {
  if (!statsData) {
    return <h3>Загрузка...</h3>;
  }
  const scoreDistribution = statsData?.score_distribution;
  const percentDistribution = statsData?.percent_distribution;

  const preparedScoreDistribution = Object.keys(scoreDistribution)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      score: key,
      value: scoreDistribution[key],
    }));

  const preparedPercentDistribution = Object.keys(percentDistribution)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      score: key,
      value: percentDistribution[key],
    }));

  return (
    <div>
      <h2>Графики</h2>
      <div className="charts">
        <h3>Распределение баллов</h3>
        {preparedScoreDistribution && (
          <BarChart
            width={1400}
            height={400}
            data={preparedScoreDistribution}
            margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" interval={0}>
              <Label value="Баллы" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis allowDecimals={false}>
              <Label
                value="Количество учеников"
                angle={-90}
                dx={10}
                dy={50}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip
              labelFormatter={(label) => `${label} баллов`}
              formatter={(value) => [`${value} человек`]}
            />

            <Bar dataKey="value" name="Количество человек" fill="#8884d8" />
          </BarChart>
        )}
      </div>

      <div className="charts">
        <h3>Процент решения задач</h3>
        {preparedPercentDistribution && (
          <BarChart
            width={1400}
            height={400}
            data={preparedPercentDistribution}
            margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="score"
              interval={0}
              tick={{ angle: -45, dx: 0, dy: 20, fontSize: 12 }}
            >
              <Label value="Задачи" offset={-50} position="insideBottom" />
            </XAxis>
            <YAxis domain={[0, 100]}>
              <Label
                value="Процент решения"
                angle={-90}
                dx={-5}
                dy={50}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip formatter={(value) => [`${value} %`]} />

            <Bar dataKey="value" name="Количество человек" fill="#8884d8" />
          </BarChart>
        )}
      </div>
    </div>
  );
};
