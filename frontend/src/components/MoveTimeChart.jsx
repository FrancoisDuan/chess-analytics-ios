/**
 * Line chart: average seconds spent per move number.
 * Two lines — white and black.
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
  color: (opacity = 1) => `rgba(240, 217, 181, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`,
  strokeWidth: 2,
  propsForDots: { r: '0' },
  propsForBackgroundLines: { stroke: '#333' },
}

const MoveTimeChart = memo(function MoveTimeChart({ stats, title }) {
  const byMove = {}
  stats.forEach(({ move_number, color, avg_seconds }) => {
    if (!byMove[move_number]) byMove[move_number] = { move_number }
    byMove[move_number][color] = avg_seconds
  })
  const sorted = Object.values(byMove)
    .sort((a, b) => a.move_number - b.move_number)
    .slice(0, 30)

  if (sorted.length === 0) return null

  const labelInterval = Math.max(1, Math.ceil(sorted.length / 8))
  const labels = sorted.map((d, i) =>
    i % labelInterval === 0 ? String(d.move_number) : ''
  )
  const whiteData = sorted.map((d) => d.white ?? 0)
  const blackData = sorted.map((d) => d.black ?? 0)

  const data = {
    labels,
    datasets: [
      { data: whiteData, color: () => '#f0d9b5', strokeWidth: 2 },
      { data: blackData, color: () => '#b58863', strokeWidth: 2 },
    ],
    legend: ['White', 'Black'],
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || 'Average seconds per move'}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={data}
          width={Math.max(CHART_WIDTH, sorted.length * 18)}
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
          <View style={[styles.legendDot, { backgroundColor: '#f0d9b5' }]} />
          <Text style={styles.legendLabel}>White</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#b58863' }]} />
          <Text style={styles.legendLabel}>Black</Text>
        </View>
      </View>
    </View>
  )
})

export default MoveTimeChart

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
