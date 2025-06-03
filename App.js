// App.js
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native'
import { Calendar } from 'react-native-calendars'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { StatusBar } from 'expo-status-bar'

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

// Componente selector de emoji
const EmojiPicker = ({ selectedEmoji, onEmojiSelect, visible, onClose }) => {
  const emojis = [
    '⏰',
    '📝',
    '💼',
    '🏃‍♂️',
    '🍎',
    '📚',
    '💻',
    '🎯',
    '☕',
    '🚗',
    '🏠',
    '📞',
    '💡',
    '🎵',
    '🛒',
    '🧘‍♀️',
    '🏋️‍♂️',
    '🍳',
    '🚿',
    '📺',
    '🎨',
    '📖',
    '🌅',
    '🌙',
  ]

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.emojiPickerOverlay}>
        <View style={styles.emojiPickerModal}>
          <View style={styles.emojiPickerHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.timePickerCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.timePickerTitle}>Seleccionar Emoji</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.timePickerConfirm}>Listo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.emojiGrid}>
            {emojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.emojiButton,
                  selectedEmoji === emoji && styles.emojiButtonSelected,
                ]}
                onPress={() => onEmojiSelect(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

// Componente selector de hora
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

// Pantalla de selección de días
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

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
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

          {days.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={styles.dayButton}
              onPress={() => onDaySelect(day.key, day.label)}
            >
              <Text style={styles.dayButtonEmoji}>{day.emoji}</Text>
              <Text style={styles.dayButtonText}>{day.label}</Text>
              <Text style={styles.dayButtonArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

// Pantalla de rutina del día
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

    // Reset form
    setNewReminder({
      emoji: '⏰',
      title: '',
      description: '',
      time: '09:00',
      hasNotification: true,
    })
    setSelectedHour(9)
    setSelectedMinute(0)
    setShowReminderModal(false)

    Alert.alert('✅ Éxito', 'Recordatorio agregado a la rutina')
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
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

          {dayRoutines.length > 0 && (
            <View style={styles.routinesContainer}>
              <Text style={styles.routinesTitle}>Recordatorios:</Text>
              {dayRoutines.map((routine) => (
                <View key={routine.id} style={styles.routineCard}>
                  <View style={styles.routineEmojiContainer}>
                    <Text style={styles.routineEmoji}>{routine.emoji}</Text>
                  </View>
                  <View style={styles.routineContent}>
                    <Text style={styles.routineTitle}>{routine.title}</Text>
                    {routine.description && (
                      <Text style={styles.routineDescription}>
                        {routine.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.routineTimeContainer}>
                    <Text style={styles.routineTime}>{routine.time}</Text>
                    <TouchableOpacity
                      style={styles.deleteRoutineButton}
                      onPress={() => onDeleteRoutine(dayKey, routine.id)}
                    >
                      <Text style={styles.deleteRoutineButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {dayRoutines.length === 0 && (
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

        {/* Selector de emoji */}
        <EmojiPicker
          selectedEmoji={newReminder.emoji}
          onEmojiSelect={(emoji) => setNewReminder({ ...newReminder, emoji })}
          visible={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
        />

        {/* Selector de hora */}
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

export default function App() {
  const [selectedDate, setSelectedDate] = useState('')
  const [tasks, setTasks] = useState({})
  const [routines, setRoutines] = useState({})
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showDaySelection, setShowDaySelection] = useState(false)
  const [showDayRoutine, setShowDayRoutine] = useState(false)
  const [selectedRoutineDay, setSelectedRoutineDay] = useState({
    key: '',
    label: '',
  })
  const [selectedHour, setSelectedHour] = useState(9)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [newTask, setNewTask] = useState({
    title: '',
    time: '09:00',
    description: '',
    hasNotification: false,
  })
  const [markedDates, setMarkedDates] = useState({})

  useEffect(() => {
    initializeApp()
  }, [])

  useEffect(() => {
    updateMarkedDates()
  }, [tasks])

  const initializeApp = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permisos de notificación',
          'Para recibir recordatorios de tus tareas, habilita las notificaciones en la configuración',
          [{ text: 'Entendido' }]
        )
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Recordatorios Planify',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196F3',
          sound: true,
        })
      }

      await loadTasks()
      await loadRoutines()
    } catch (error) {
      console.log('Error initializing app:', error)
      await loadTasks()
      await loadRoutines()
    }
  }

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('planify_tasks')
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const loadRoutines = async () => {
    try {
      const savedRoutines = await AsyncStorage.getItem('planify_routines')
      if (savedRoutines) {
        setRoutines(JSON.parse(savedRoutines))
      }
    } catch (error) {
      console.error('Error loading routines:', error)
    }
  }

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('planify_tasks', JSON.stringify(newTasks))
      setTasks(newTasks)
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }

  const saveRoutines = async (newRoutines) => {
    try {
      await AsyncStorage.setItem(
        'planify_routines',
        JSON.stringify(newRoutines)
      )
      setRoutines(newRoutines)
    } catch (error) {
      console.error('Error saving routines:', error)
    }
  }

  const updateMarkedDates = () => {
    const marked = {}
    Object.keys(tasks).forEach((date) => {
      if (tasks[date] && tasks[date].length > 0) {
        marked[date] = {
          marked: true,
          dotColor: '#2196F3',
          selectedColor: '#2196F3',
        }
      }
    })
    setMarkedDates(marked)
  }

  const scheduleNotification = async (task, date) => {
    if (!task.hasNotification || !task.time) return

    try {
      const [hours, minutes] = task.time.split(':').map(Number)
      const [year, month, day] = date.split('-').map(Number)
      const notificationDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        0,
        0
      )

      const now = new Date()

      if (notificationDate.getTime() > now.getTime() - 30000) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Recordatorio de Planify',
            body: `${task.title}${
              task.description ? ' - ' + task.description : ''
            }`,
            sound: true,
            priority: Notifications.AndroidImportance.HIGH,
          },
          trigger: notificationDate,
        })

        return notificationId
      }
    } catch (error) {
      console.error('Error scheduling notification:', error)
    }
  }

  const handleTimeChange = (hour, minute) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`
    setSelectedHour(hour)
    setSelectedMinute(minute)
    setNewTask({ ...newTask, time: timeString })
  }

  const addTask = async () => {
    if (!selectedDate || !newTask.title || !newTask.time) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos')
      return
    }

    const updatedTasks = { ...tasks }
    if (!updatedTasks[selectedDate]) {
      updatedTasks[selectedDate] = []
    }

    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
    }

    updatedTasks[selectedDate].push(taskWithId)

    if (taskWithId.hasNotification) {
      const notificationId = await scheduleNotification(
        taskWithId,
        selectedDate
      )
      if (notificationId) {
        taskWithId.notificationId = notificationId
      }
    }

    await saveTasks(updatedTasks)

    setNewTask({
      title: '',
      time: '09:00',
      description: '',
      hasNotification: false,
    })
    setSelectedHour(9)
    setSelectedMinute(0)
    setShowTaskModal(false)

    Alert.alert(
      '✅ Éxito',
      'Tarea agregada correctamente' +
        (taskWithId.hasNotification ? '\n🔔 Notificación programada' : '')
    )
  }

  const deleteTask = async (date, taskId) => {
    const updatedTasks = { ...tasks }
    const taskToDelete = updatedTasks[date].find((task) => task.id === taskId)

    if (taskToDelete && taskToDelete.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(
          taskToDelete.notificationId
        )
      } catch (error) {
        console.log('Error canceling notification:', error)
      }
    }

    updatedTasks[date] = updatedTasks[date].filter((task) => task.id !== taskId)

    if (updatedTasks[date].length === 0) {
      delete updatedTasks[date]
    }

    await saveTasks(updatedTasks)
  }

  const addRoutine = async (dayKey, routine) => {
    const updatedRoutines = { ...routines }
    if (!updatedRoutines[dayKey]) {
      updatedRoutines[dayKey] = []
    }
    updatedRoutines[dayKey].push(routine)
    await saveRoutines(updatedRoutines)
  }

  const deleteRoutine = async (dayKey, routineId) => {
    const updatedRoutines = { ...routines }
    if (updatedRoutines[dayKey]) {
      updatedRoutines[dayKey] = updatedRoutines[dayKey].filter(
        (routine) => routine.id !== routineId
      )
      if (updatedRoutines[dayKey].length === 0) {
        delete updatedRoutines[dayKey]
      }
      await saveRoutines(updatedRoutines)
    }
  }

  const handleDaySelect = (dayKey, dayLabel) => {
    setSelectedRoutineDay({ key: dayKey, label: dayLabel })
    setShowDaySelection(false)
    setShowDayRoutine(true)
  }

  const onDayPress = (day) => {
    setSelectedDate(day.dateString)
  }

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Planify</Text>
        <Text style={styles.headerSubtitle}>Tu gestor de tiempo personal</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.routineButton}
            onPress={() => setShowDaySelection(true)}
          >
            <Text style={styles.routineButtonText}>🔄 Crear Rutina</Text>
          </TouchableOpacity>
        </View>

        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: '#4CAF50',
            },
          }}
          theme={{
            selectedDayBackgroundColor: '#4CAF50',
            todayTextColor: '#2196F3',
            dayTextColor: '#333',
            textDisabledColor: '#d9e1e8',
            dotColor: '#2196F3',
            selectedDotColor: '#ffffff',
            arrowColor: '#2196F3',
            monthTextColor: '#333',
            indicatorColor: '#2196F3',
          }}
        />

        {selectedDate && (
          <View style={styles.selectedDateSection}>
            <Text style={styles.selectedDateTitle}>
              {formatDate(selectedDate)}
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowTaskModal(true)}
            >
              <Text style={styles.addButtonText}>+ Agregar Tarea</Text>
            </TouchableOpacity>

            {tasks[selectedDate] && tasks[selectedDate].length > 0 && (
              <View style={styles.tasksContainer}>
                <Text style={styles.tasksTitle}>Tareas del día:</Text>
                {tasks[selectedDate].map((task) => (
                  <View key={task.id} style={styles.taskItem}>
                    <View style={styles.taskContent}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskTime}>🕐 {task.time}</Text>
                      {task.description && (
                        <Text style={styles.taskDescription}>
                          {task.description}
                        </Text>
                      )}
                      {task.hasNotification && (
                        <Text style={styles.notificationIndicator}>
                          🔔 Notificación activa
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteTask(selectedDate, task.id)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal para agregar tareas */}
      <Modal
        visible={showTaskModal}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTaskModal(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nueva Tarea</Text>
            <TouchableOpacity onPress={addTask}>
              <Text style={styles.saveButton}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título de la tarea *</Text>
              <TextInput
                style={styles.textInput}
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                placeholder='Ej: Reunión de trabajo'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hora *</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timePickerButtonText}>
                  🕐 {newTask.time}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newTask.description}
                onChangeText={(text) =>
                  setNewTask({ ...newTask, description: text })
                }
                placeholder='Descripción adicional...'
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Activar notificación</Text>
              <Switch
                value={newTask.hasNotification}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, hasNotification: value })
                }
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={newTask.hasNotification ? '#2196F3' : '#f4f3f4'}
              />
            </View>

            {newTask.hasNotification && (
              <Text style={styles.notificationInfo}>
                💡 Recibirás una notificación a la hora programada
              </Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Selector de hora */}
      <TimePicker
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        onTimeChange={handleTimeChange}
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
      />

      {/* Pantalla de selección de días */}
      <DaySelectionScreen
        visible={showDaySelection}
        onClose={() => setShowDaySelection(false)}
        onDaySelect={handleDaySelect}
      />

      {/* Pantalla de rutina del día */}
      <DayRoutineScreen
        visible={showDayRoutine}
        onClose={() => setShowDayRoutine(false)}
        dayKey={selectedRoutineDay.key}
        dayLabel={selectedRoutineDay.label}
        routines={routines}
        onAddRoutine={addRoutine}
        onDeleteRoutine={deleteRoutine}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  routineButton: {
    backgroundColor: '#9C27B0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  routineButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDateSection: {
    padding: 20,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tasksContainer: {
    marginTop: 10,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  notificationIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  notificationInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  timePickerButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  timePickerButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  timePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    maxHeight: '70%',
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timePickerCancel: {
    fontSize: 16,
    color: '#666',
  },
  timePickerConfirm: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  timePickerDisplay: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  timePickerDisplayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  timePickerScroll: {
    maxHeight: 200,
    width: '100%',
  },
  timePickerItem: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  timePickerItemSelected: {
    backgroundColor: '#2196F3',
  },
  timePickerItemText: {
    fontSize: 18,
    color: '#333',
  },
  timePickerItemTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  timePickerSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  // Estilos para la selección de días
  daySelectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayButtonEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  dayButtonText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  dayButtonArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  // Estilos para rutinas del día
  addRoutineButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addRoutineButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  routinesContainer: {
    marginTop: 10,
  },
  routinesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  routineCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routineEmojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  routineEmoji: {
    fontSize: 24,
  },
  routineContent: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  routineDescription: {
    fontSize: 14,
    color: '#666',
  },
  routineTimeContainer: {
    alignItems: 'center',
  },
  routineTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  deleteRoutineButton: {
    backgroundColor: '#f44336',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteRoutineButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // Estilos para selector de emoji
  emojiPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiPickerModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    maxHeight: '70%',
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-around',
  },
  emojiButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    margin: 5,
  },
  emojiButtonSelected: {
    backgroundColor: '#e3f2fd',
  },
  emojiText: {
    fontSize: 24,
  },
  emojiSelectButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  emojiSelectButtonText: {
    fontSize: 16,
    color: '#333',
  },
})
