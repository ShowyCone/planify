import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

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

export const loadTasks = async () => {
  try {
    const savedTasks = await AsyncStorage.getItem('planify_tasks')
    return savedTasks ? JSON.parse(savedTasks) : {}
  } catch (error) {
    console.error('Error loading tasks:', error)
    return {}
  }
}

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem('planify_tasks', JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks:', error)
  }
}

export const loadRoutines = async () => {
  try {
    const savedRoutines = await AsyncStorage.getItem('planify_routines')
    return savedRoutines ? JSON.parse(savedRoutines) : {}
  } catch (error) {
    console.error('Error loading routines:', error)
    return {}
  }
}

export const saveRoutines = async (routines) => {
  try {
    await AsyncStorage.setItem('planify_routines', JSON.stringify(routines))
  } catch (error) {
    console.error('Error saving routines:', error)
  }
}

export const scheduleNotification = async (task, date) => {
  if (!task.hasNotification || !task.time) return null

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
  return null
}

export const updateTask = async (date, taskId, updatedTask) => {
  try {
    const savedTasks = await loadTasks()
    if (savedTasks[date]) {
      const taskIndex = savedTasks[date].findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        savedTasks[date][taskIndex] = updatedTask
        await saveTasks(savedTasks)
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Error updating task:', error)
    return false
  }
}

export const updateRoutine = async (dayKey, routineId, updatedRoutine) => {
  try {
    const savedRoutines = await loadRoutines()
    if (savedRoutines[dayKey]) {
      const routineIndex = savedRoutines[dayKey].findIndex(
        (routine) => routine.id === routineId
      )
      if (routineIndex !== -1) {
        savedRoutines[dayKey][routineIndex] = updatedRoutine
        await saveRoutines(savedRoutines)
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Error updating routine:', error)
    return false
  }
}

export const cancelScheduledNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
    return true
  } catch (error) {
    console.error('Error canceling notification:', error)
    return false
  }
}
