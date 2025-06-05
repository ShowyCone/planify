import {
  Modal,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  BackHandler,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { styles } from '../../styles'

const DaySelectionScreen = ({ visible, onClose, onDaySelect }) => {
  const days = [
    { key: 'monday', label: 'Lunes', emoji: '📅' },
    { key: 'tuesday', label: 'Martes', emoji: '📅' },
    { key: 'wednesday', label: 'Miércoles', emoji: '📅' },
    { key: 'thursday', label: 'Jueves', emoji: '📅' },
    { key: 'friday', label: 'Viernes', emoji: '📅' },
    { key: 'saturday', label: 'Sábado', emoji: '📅' },
    { key: 'sunday', label: 'Domingo', emoji: '📅' },
    { key: 'everyday', label: 'Todos los días', emoji: '🔄' },
  ]

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose()
        return true // Previene cerrar la app
      }
      return false
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [visible, onClose])

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Crear Rutina</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.daySelectionTitle}>
            Selecciona el día para tu rutina:
          </Text>
          <View style={styles.dayButtonsContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={styles.dayButton}
                onPress={() => onDaySelect(day.key, day.label)}
              >
                <Text style={styles.dayButtonEmoji}>{day.emoji}</Text>
                <Text style={styles.dayButtonText}>{day.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default DaySelectionScreen
