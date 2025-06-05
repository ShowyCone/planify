import React, { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  FlatList,
} from 'react-native'
import { Calendar } from 'react-native-calendars'
import DaySelectionScreen from '../components/routines/DaySelectionScreen'
import DayRoutineScreen from '../components/routines/DayRoutineScreen'
import TimePicker from '../components/common/TimePicker'
import TaskItem from '../components/common/TaskItem'
import TaskForm from '../components/tasks/TaskForm'
import {
  loadTasks,
  saveTasks,
  loadRoutines,
  saveRoutines,
  scheduleNotification,
} from '../utils/storage'
import { formatDate } from '../utils/helpers'
import { styles } from '../styles'
import RoutineItem from '../components/routines/RoutineItem'
import TaskEditForm from '../components/tasks/TaskEditForm'
import { cancelScheduledNotification } from '../utils/storage'

const MainScreen = () => {
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
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editingDate, setEditingDate] = useState('')

  useEffect(() => {
    initializeApp()
  }, [])

  useEffect(() => {
    updateMarkedDates()
  }, [tasks])

  const initializeApp = async () => {
    const loadedTasks = await loadTasks()
    const loadedRoutines = await loadRoutines()
    setTasks(loadedTasks || {})
    setRoutines(loadedRoutines || {})
  }

  const updateMarkedDates = () => {
    const marked = {}
    Object.keys(tasks).forEach((date) => {
      if (tasks[date]?.length > 0) {
        marked[date] = {
          marked: true,
          dotColor: '#2196F3',
          selectedColor: '#2196F3',
        }
      }
    })
    setMarkedDates(marked)
  }

  const handleTimeChange = (hour, minute) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`
    setSelectedHour(hour)
    setSelectedMinute(minute)
    setNewTask((prev) => ({ ...prev, time: timeString }))
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
    setTasks(updatedTasks)
    resetTaskForm()
    setShowTaskModal(false)

    Alert.alert(
      '✅ Éxito',
      'Tarea agregada correctamente' +
        (taskWithId.hasNotification ? '\n🔔 Notificación programada' : '')
    )
  }

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      time: '09:00',
      description: '',
      hasNotification: false,
    })
    setSelectedHour(9)
    setSelectedMinute(0)
  }

  const deleteTask = async (date, taskId) => {
    const updatedTasks = { ...tasks }
    const taskToDelete = updatedTasks[date].find((task) => task.id === taskId)

    // Lógica para cancelar notificación (si existe)

    updatedTasks[date] = updatedTasks[date].filter((task) => task.id !== taskId)
    if (updatedTasks[date].length === 0) {
      delete updatedTasks[date]
    }

    await saveTasks(updatedTasks)
    setTasks(updatedTasks)
  }

  const addRoutine = async (dayKey, routine) => {
    const updatedRoutines = { ...routines }
    if (!updatedRoutines[dayKey]) {
      updatedRoutines[dayKey] = []
    }
    updatedRoutines[dayKey].push(routine)
    await saveRoutines(updatedRoutines)
    setRoutines(updatedRoutines)
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
      setRoutines(updatedRoutines)
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

  const getAllRoutines = () => {
    const daysOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]
    const everydayRoutines = routines.everyday ? [...routines.everyday] : []

    return daysOfWeek.map((dayKey) => ({
      dayKey,
      dayName: getDayName(dayKey), // Función que convierte 'monday' a 'Lunes'
      routines: [...(routines[dayKey] || []), ...everydayRoutines],
    }))
  }

  // Función helper para nombres de días
  const getDayName = (dayKey) => {
    const dayNames = {
      sunday: 'Domingo',
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      everyday: 'Todos los días',
    }
    return dayNames[dayKey]
  }

  // 2. Función para manejar la edición de tareas
  const handleEditTask = (task, date) => {
    const [hours, minutes] = task.time.split(':').map(Number)
    setSelectedHour(hours)
    setSelectedMinute(minutes)
    setEditingTask(task)
    setEditingDate(date)
    setShowEditTaskModal(true)
  }

  // 3. Función para actualizar la tarea
  const updateTask = async () => {
    if (!editingTask.title || !editingTask.time) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos')
      return
    }

    try {
      const updatedTasks = { ...tasks }

      // Buscar la tarea en la fecha original
      const taskIndex = updatedTasks[editingDate].findIndex(
        (t) => t.id === editingTask.id
      )

      if (taskIndex !== -1) {
        // Cancelar notificación anterior si existe
        if (updatedTasks[editingDate][taskIndex].notificationId) {
          await cancelScheduledNotification(
            updatedTasks[editingDate][taskIndex].notificationId
          )
        }

        // Programar nueva notificación si está activada
        let notificationId = null
        if (editingTask.hasNotification) {
          notificationId = await scheduleNotification(editingTask, editingDate)
        }

        // Actualizar la tarea
        updatedTasks[editingDate][taskIndex] = {
          ...editingTask,
          notificationId: notificationId || null,
        }

        await saveTasks(updatedTasks)
        setTasks(updatedTasks)
        setShowEditTaskModal(false)

        Alert.alert(
          '✅ Éxito',
          'Tarea actualizada correctamente' +
            (editingTask.hasNotification ? '\n🔔 Notificación programada' : '')
        )
      }
    } catch (error) {
      console.error('Error updating task:', error)
      Alert.alert('Error', 'No se pudo actualizar la tarea')
    }
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
        <Text style={styles.centeredTitle}>Calendario De Tareas</Text>
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

            {tasks[selectedDate]?.length > 0 ? (
              <View style={styles.tasksContainer}>
                <Text style={styles.tasksTitle}>Tareas del día:</Text>
                {tasks[selectedDate].map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={() => deleteTask(selectedDate, task.id)}
                    onEdit={() => handleEditTask(task, selectedDate)}
                  />
                ))}
              </View>
            ) : null}
          </View>
        )}
        <View style={styles.routinesContainer}>
          <Text style={styles.centeredTitle}>Tus Rutinas Diarias:</Text>

          {getAllRoutines().map(
            (day) =>
              day.routines.length > 0 && (
                <View key={day.dayKey} style={styles.dayRoutineSection}>
                  <Text style={styles.dayRoutineTitle}>{day.dayName}</Text>

                  {day.routines.map((routine) => (
                    <RoutineItem
                      key={`${day.dayKey}-${routine.id}`}
                      routine={{ ...routine, dayKey: day.dayKey }}
                      onEdit={() => console.log(routine)}
                      onDelete={() => deleteRoutine(day.dayKey, routine.id)}
                    />
                  ))}
                </View>
              )
          )}
        </View>
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
            <TaskForm
              newTask={newTask}
              setNewTask={setNewTask}
              onTimePickerPress={() => setShowTimePicker(true)}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal para editar tareas */}
      <Modal
        visible={showEditTaskModal}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditTaskModal(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Tarea</Text>
            <TouchableOpacity onPress={updateTask}>
              <Text style={styles.saveButton}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TaskEditForm
              task={editingTask}
              setTask={setEditingTask}
              onTimePickerPress={() => setShowTimePicker(true)}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <TimePicker
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        onTimeChange={handleTimeChange}
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
      />

      <DaySelectionScreen
        visible={showDaySelection}
        onClose={() => setShowDaySelection(false)}
        onDaySelect={handleDaySelect}
      />

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

export default MainScreen
