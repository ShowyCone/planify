import { useState, useEffect } from 'react'
import {
  Modal,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Switch,
  Alert,
  BackHandler,
} from 'react-native'
import EmojiPicker from '../common/EmojiPicker'
import TimePicker from '../common/TimePicker'
import RoutineItem from './RoutineItem'
import { styles } from '../../styles'

const DayRoutineScreen = ({
  visible,
  onClose,
  dayKey,
  dayLabel,
  routines,
  onAddRoutine,
  onDeleteRoutine,
}) => {
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedHour, setSelectedHour] = useState(9)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [newReminder, setNewReminder] = useState({
    emoji: '⏰',
    title: '',
    description: '',
    time: '09:00',
    hasNotification: true,
  })

  const dayRoutines = routines[dayKey] || []

  const handleTimeChange = (hour, minute) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`
    setSelectedHour(hour)
    setSelectedMinute(minute)
    setNewReminder({ ...newReminder, time: timeString })
  }

  const addReminder = () => {
    if (!newReminder.title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para el recordatorio')
      return
    }

    const reminderWithId = {
      ...newReminder,
      id: Date.now().toString(),
    }

    onAddRoutine(dayKey, reminderWithId)
    resetReminderForm()
    setShowReminderModal(false)
    Alert.alert('✅ Éxito', 'Recordatorio agregado a la rutina')
  }

  const resetReminderForm = () => {
    setNewReminder({
      emoji: '⏰',
      title: '',
      description: '',
      time: '09:00',
      hasNotification: true,
    })
    setSelectedHour(9)
    setSelectedMinute(0)
  }

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
            <Text style={styles.cancelButton}>Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{dayLabel}</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <TouchableOpacity
            style={styles.addRoutineButton}
            onPress={() => setShowReminderModal(true)}
          >
            <Text style={styles.addRoutineButtonText}>
              + Agregar Recordatorio
            </Text>
          </TouchableOpacity>

          {dayRoutines.length > 0 ? (
            <View style={styles.routinesContainer}>
              <Text style={styles.routinesTitle}>Recordatorios:</Text>
              {dayRoutines.map((routine) => (
                <RoutineItem
                  key={routine.id}
                  routine={routine}
                  onDelete={() => onDeleteRoutine(dayKey, routine.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📝</Text>
              <Text style={styles.emptyStateText}>
                No hay recordatorios para {dayLabel.toLowerCase()}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Agrega tu primer recordatorio para comenzar
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Modal para agregar recordatorio */}
        <Modal
          visible={showReminderModal}
          animationType='slide'
          presentationStyle='pageSheet'
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowReminderModal(false)}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Recordatorio</Text>
              <TouchableOpacity onPress={addReminder}>
                <Text style={styles.saveButton}>Guardar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emoji</Text>
                <TouchableOpacity
                  style={styles.emojiSelectButton}
                  onPress={() => setShowEmojiPicker(true)}
                >
                  <Text style={styles.emojiSelectButtonText}>
                    {newReminder.emoji} Seleccionar emoji
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Título *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newReminder.title}
                  onChangeText={(text) =>
                    setNewReminder({ ...newReminder, title: text })
                  }
                  placeholder='Ej: Hacer ejercicio'
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newReminder.description}
                  onChangeText={(text) =>
                    setNewReminder({ ...newReminder, description: text })
                  }
                  placeholder='Descripción adicional...'
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hora</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timePickerButtonText}>
                    🕐 {newReminder.time}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Activar notificación</Text>
                <Switch
                  value={newReminder.hasNotification}
                  onValueChange={(value) =>
                    setNewReminder({ ...newReminder, hasNotification: value })
                  }
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={
                    newReminder.hasNotification ? '#2196F3' : '#f4f3f4'
                  }
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        <EmojiPicker
          selectedEmoji={newReminder.emoji}
          onEmojiSelect={(emoji) => setNewReminder({ ...newReminder, emoji })}
          visible={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
        />

        <TimePicker
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          onTimeChange={handleTimeChange}
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
        />
      </SafeAreaView>
    </Modal>
  )
}

export default DayRoutineScreen
