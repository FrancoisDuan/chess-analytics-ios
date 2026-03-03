/**
 * Line chart comparing two users' average time per move number.
 * One line per user (averaged across white and black).
 */
import { memo } from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

const CHART_WIDTH = Dimensions.get('window').width - 32

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

function avgByMove(stats) {
  const byMove = {}
  stats.forEach(({ move_number, avg_seconds }) => {
    if (!byMove[move_number]) byMove[move_number] = { sum: 0, count: 0 }
    byMove[move_number].sum += avg_seconds
    byMove[move_number].count += 1
  })
  return byMove
}

const CompareChart = memo(function CompareChart({ data, username1, username2 }) {
  const map1 = avgByMove(data.move_time_stats1)
  const map2 = avgByMove(data.move_time_stats2)

  const allMoves = Array.from(
    new Set([...Object.keys(map1), ...Object.keys(map2)].map(Number))
  ).sort((a, b) => a - b).slice(0, 30)

  if (allMoves.length === 0) return null

  const labelInterval = Math.max(1, Math.ceil(allMoves.length / 8))
  const labels = allMoves.map((m, i) =>
    i % labelInterval === 0 ? String(m) : ''
  )
  const data1 = allMoves.map((m) => (map1[m] ? map1[m].sum / map1[m].count : 0))
  const data2 = allMoves.map((m) => (map2[m] ? map2[m].sum / map2[m].count : 0))

  const chartData = {
    labels,
    datasets: [
      { data: data1, color: () => '#4e79a7', strokeWidth: 2 },
      { data: data2, color: () => '#f28e2b', strokeWidth: 2 },
    ],
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Comparison: {username1} vs {username2}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={chartData}
          width={Math.max(CHART_WIDTH, allMoves.length * 18)}
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
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4e79a7' }]} />
          <Text style={styles.legendLabel}>{username1}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f28e2b' }]} />
          <Text style={styles.legendLabel}>{username2}</Text>
        </View>
      </View>
    </View>
  )
})

export default CompareChart

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
    gap: 16,
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
    fontSize: 12,
  },
})
