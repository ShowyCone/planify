import React from 'react'
import { View, TextInput, Text, TouchableOpacity, Switch } from 'react-native'
import { styles } from '../../styles'

const TaskForm = ({ newTask, setNewTask, onTimePickerPress, data }) => {
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Título de la tarea *</Text>
        <TextInput
          style={styles.textInput}
          value={data ? data.title : newTask.title}
          onChangeText={(text) =>
            setNewTask((prev) => ({ ...prev, title: text }))
          }
          placeholder='Ej: Reunión de trabajo'
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Hora *</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={onTimePickerPress}
        >
          <Text style={styles.timePickerButtonText}>🕐 {newTask.time}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descripción</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={newTask.description}
          onChangeText={(text) =>
            setNewTask((prev) => ({ ...prev, description: text }))
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
            setNewTask((prev) => ({ ...prev, hasNotification: value }))
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
    </>
  )
}

export default TaskForm
