import React, { useState } from 'react'
import { Modal, View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { styles } from '../../styles'

const TimePicker = ({
  selectedHour,
  selectedMinute,
  onTimeChange,
  visible,
  onClose,
}) => {
  const [tempHour, setTempHour] = useState(selectedHour)
  const [tempMinute, setTempMinute] = useState(selectedMinute)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const confirmTime = () => {
    onTimeChange(tempHour, tempMinute)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.timePickerOverlay}>
        <View style={styles.timePickerModal}>
          <View style={styles.timePickerHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.timePickerCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.timePickerTitle}>Seleccionar Hora</Text>
            <TouchableOpacity onPress={confirmTime}>
              <Text style={styles.timePickerConfirm}>Confirmar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timePickerDisplay}>
            <Text style={styles.timePickerDisplayText}>
              {tempHour.toString().padStart(2, '0')}:
              {tempMinute.toString().padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.timePickerContent}>
            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>Hora</Text>
              <ScrollView
                style={styles.timePickerScroll}
                showsVerticalScrollIndicator={false}
              >
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timePickerItem,
                      tempHour === hour && styles.timePickerItemSelected,
                    ]}
                    onPress={() => setTempHour(hour)}
                  >
                    <Text
                      style={[
                        styles.timePickerItemText,
                        tempHour === hour && styles.timePickerItemTextSelected,
                      ]}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.timePickerSeparator}>:</Text>

            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>Minutos</Text>
              <ScrollView
                style={styles.timePickerScroll}
                showsVerticalScrollIndicator={false}
              >
                {minutes.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timePickerItem,
                      tempMinute === minute && styles.timePickerItemSelected,
                    ]}
                    onPress={() => setTempMinute(minute)}
                  >
                    <Text
                      style={[
                        styles.timePickerItemText,
                        tempMinute === minute &&
                          styles.timePickerItemTextSelected,
                      ]}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default TimePicker
