/**
 * Reusable form for entering a chess.com username + optional filters.
 */
import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'

const TIME_CLASSES = ['', 'blitz', 'rapid', 'bullet', 'daily', 'classical']

export default function UserSearchForm({ onSubmit, loading, label = 'Username', extraField }) {
  const [username, setUsername] = useState('')
  const [timeClass, setTimeClass] = useState('')
  const [limit, setLimit] = useState('100')

  function handleSubmit() {
    if (!username.trim()) return
    onSubmit({ username: username.trim(), timeClass, limit: Number(limit) || 100 })
  }

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="e.g. magnuscarlsen"
          placeholderTextColor="#555"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Time class</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={timeClass}
            onValueChange={setTimeClass}
            style={styles.picker}
            dropdownIconColor="#aaa"
            itemStyle={styles.pickerItem}
          >
            {TIME_CLASSES.map((tc) => (
              <Picker.Item key={tc} label={tc || 'all'} value={tc} color="#eee" />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.limitField}>
          <Text style={styles.label}>Max games</Text>
          <TextInput
            style={styles.input}
            value={limit}
            onChangeText={setLimit}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Loading…' : 'Fetch'}</Text>
        </TouchableOpacity>
      </View>

      {extraField ? (
        <View style={styles.field}>
          <Text style={styles.label}>{extraField.label}</Text>
          <TextInput
            style={styles.input}
            value={extraField.value}
            onChangeText={extraField.onChange}
            placeholder={extraField.placeholder}
            placeholderTextColor="#555"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 10,
  },
  limitField: {
    flex: 1,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#2a2a4a',
    borderWidth: 1,
    borderColor: '#444',
    color: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 4,
    fontSize: 15,
  },
  pickerWrapper: {
    backgroundColor: '#2a2a4a',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    color: '#eee',
    height: 44,
  },
  pickerItem: {
    fontSize: 15,
  },
  button: {
    backgroundColor: '#f0d9b5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginBottom: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#1a1a2e',
    fontWeight: '700',
    fontSize: 15,
  },
})
