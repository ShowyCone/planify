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
  const minutes = Array.from({ length: 60 }, (_, i) => i) // Todos los minutos de 0 a 59

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

export default function App() {
  const [selectedDate, setSelectedDate] = useState('')
  const [tasks, setTasks] = useState({})
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
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
      // Solicitar permisos específicos para notificaciones
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

      // Configurar canal de notificaciones para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Recordatorios Planify',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196F3',
          sound: true,
        })
      }

      // Cargar datos guardados
      await loadTasks()
    } catch (error) {
      console.log('Error initializing app:', error)
      await loadTasks()
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

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('planify_tasks', JSON.stringify(newTasks))
      setTasks(newTasks)
    } catch (error) {
      console.error('Error saving tasks:', error)
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

      // Crear fecha correctamente sin problemas de zona horaria
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

      console.log('=== DEBUG NOTIFICACIÓN ===')
      console.log('Tarea:', task.title)
      console.log('Hora seleccionada:', task.time)
      console.log('Fecha seleccionada:', date)
      console.log(
        'Fecha de notificación:',
        notificationDate.toLocaleString('es-ES')
      )
      console.log('Fecha actual:', now.toLocaleString('es-ES'))
      console.log(
        'Diferencia en minutos:',
        (notificationDate.getTime() - now.getTime()) / (1000 * 60)
      )

      // Solo programar si la fecha es futura (con margen de 30 segundos para testing)
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

        console.log('✅ Notificación programada con ID:', notificationId)
        console.log('========================')
        return notificationId
      } else {
        console.log('❌ La fecha ya pasó, no se programa notificación')
        console.log('========================')
      }
    } catch (error) {
      console.error('Error scheduling notification:', error)
      Alert.alert(
        'Error',
        'No se pudo programar la notificación: ' + error.message
      )
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

    // Programar notificación si está habilitada
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

    // Resetear formulario
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

    // Cancelar notificación si existe
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

  const onDayPress = (day) => {
    setSelectedDate(day.dateString)
  }

  const formatDate = (dateString) => {
    // Crear fecha sin problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month - 1 porque los meses van de 0-11

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
})
