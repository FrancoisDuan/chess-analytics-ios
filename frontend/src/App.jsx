import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import UserSearchForm from './components/UserSearchForm'
import MoveTimeChart from './components/MoveTimeChart'
import MoveTrendChart from './components/MoveTrendChart'
import CompareChart from './components/CompareChart'
import { getMoveTimeStats, getMoveTimeTrend, compareUsers } from './services/api'

const TABS = ['Move Time', 'Trend', 'Compare']

export default function App() {
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [statsData, setStatsData] = useState(null)
  const [statsUsername, setStatsUsername] = useState('')

  const [trendData, setTrendData] = useState(null)
  const [trendUsername, setTrendUsername] = useState('')
  const [moveNumbers, setMoveNumbers] = useState('')

  const [compareData, setCompareData] = useState(null)
  const [compareUser1, setCompareUser1] = useState('')
  const [compareUser2, setCompareUser2] = useState('')

  async function handleStatsFetch({ username, timeClass, limit }) {
    setLoading(true); setError(null)
    try {
      const params = { limit }
      if (timeClass) params.time_class = timeClass
      setStatsData(await getMoveTimeStats(username, params))
      setStatsUsername(username)
    } catch (e) { setError(e.response?.data?.detail || e.message) }
    finally { setLoading(false) }
  }

  async function handleTrendFetch({ username, timeClass, limit }) {
    setLoading(true); setError(null)
    try {
      const params = { limit }
      if (timeClass) params.time_class = timeClass
      if (moveNumbers.trim()) params.move_numbers = moveNumbers.trim()
      setTrendData(await getMoveTimeTrend(username, params))
      setTrendUsername(username)
    } catch (e) { setError(e.response?.data?.detail || e.message) }
    finally { setLoading(false) }
  }

  async function handleCompareFetch({ username, timeClass, limit }) {
    if (!compareUser2.trim()) { setError('Please enter a second username'); return }
    setLoading(true); setError(null)
    try {
      const params = { limit }
      if (timeClass) params.time_class = timeClass
      setCompareData(await compareUsers(username, compareUser2.trim(), params))
      setCompareUser1(username)
    } catch (e) { setError(e.response?.data?.detail || e.message) }
    finally { setLoading(false) }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>♟ Chess Analytics</Text>
          <Text style={styles.subtitle}>Explore how long players spend on each move</Text>
        </View>

        <View style={styles.tabs}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === i && styles.tabActive]}
              onPress={() => { setTab(i); setError(null) }}
            >
              <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {tab === 0 && (
          <View>
            <UserSearchForm onSubmit={handleStatsFetch} loading={loading} />
            {statsData ? (
              <MoveTimeChart stats={statsData} title={`Move time stats — ${statsUsername}`} />
            ) : null}
          </View>
        )}

        {tab === 1 && (
          <View>
            <UserSearchForm
              onSubmit={handleTrendFetch}
              loading={loading}
              extraField={{
                label: 'Track specific moves (comma-separated, e.g. 1,2,3)',
                value: moveNumbers,
                onChange: setMoveNumbers,
                placeholder: 'leave blank for all moves',
              }}
            />
            {trendData ? (
              <MoveTrendChart trend={trendData} title={`Time-per-move trend — ${trendUsername}`} />
            ) : null}
          </View>
        )}

        {tab === 2 && (
          <View>
            <UserSearchForm
              onSubmit={handleCompareFetch}
              loading={loading}
              label="Username 1"
              extraField={{
                label: 'Username 2',
                value: compareUser2,
                onChange: setCompareUser2,
                placeholder: 'second chess.com username',
              }}
            />
            {compareData ? (
              <CompareChart data={compareData} username1={compareUser1} username2={compareUser2} />
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f0d9b5',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#aaa',
    marginTop: 4,
    fontSize: 13,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#f0d9b5',
  },
  tabText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#5c1a1a',
    borderWidth: 1,
    borderColor: '#a33',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#ffcccc',
  },
})
