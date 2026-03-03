/**
 * Line chart: how average time-per-move has changed over dates.
 * Each series is a (move_number, color) combination.
 * When move_number === 0 the legend shows "all moves".
 */
import { memo } from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

const CHART_WIDTH = Dimensions.get('window').width - 32

const SERIES_COLORS = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
  '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
]

const chartConfig = {
  backgroundColor: '#16213e',
  backgroundGradientFrom: '#16213e',
  backgroundGradientTo: '#1a1a2e',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(78, 121, 167, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`,
  strokeWidth: 2,
  propsForDots: { r: '0' },
  propsForBackgroundLines: { stroke: '#333' },
}

const MoveTrendChart = memo(function MoveTrendChart({ trend, title }) {
  const dateMap = {}
  const seriesKeys = []
  const seenKeys = new Set()

  trend.forEach(({ date, move_number, color, avg_seconds }) => {
    const key = move_number === 0 ? `all (${color})` : `move ${move_number} (${color})`
    if (!seenKeys.has(key)) { seenKeys.add(key); seriesKeys.push(key) }
    if (!dateMap[date]) dateMap[date] = { date }
    dateMap[date][key] = avg_seconds
  })

  const sorted = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date))
  if (sorted.length === 0) return null

  const labelInterval = Math.max(1, Math.ceil(sorted.length / 6))
  const labels = sorted.map((d, i) =>
    i % labelInterval === 0 ? d.date.slice(0, 7) : ''
  )

  const datasets = seriesKeys.map((k, i) => ({
    data: sorted.map((d) => d[k] ?? 0),
    color: () => SERIES_COLORS[i % SERIES_COLORS.length],
    strokeWidth: 2,
  }))

  if (datasets.length === 0 || datasets[0].data.length === 0) return null

  const data = { labels, datasets }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || 'Average time per move over time'}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={data}
          width={Math.max(CHART_WIDTH, sorted.length * 20)}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={false}
          withInnerLines
          withOuterLines
          fromZero
        />
      </ScrollView>
      <View style={styles.legend}>
        {seriesKeys.map((k, i) => (
          <View key={k} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }]} />
            <Text style={styles.legendLabel}>{k}</Text>
          </View>
        ))}
      </View>
    </View>
  )
})

export default MoveTrendChart

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  title: {
    fontSize: 13,
    color: '#f0d9b5',
    marginBottom: 8,
    fontWeight: '600',
  },
  chart: {
    borderRadius: 8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: '#bbb',
    fontSize: 11,
  },
})
