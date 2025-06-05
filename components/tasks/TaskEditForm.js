import React from 'react'
import { View, Text, TextInput, Switch, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'

const TaskEditForm = ({ task, setTask, onTimePickerPress }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Título*</Text>
      <TextInput
        style={styles.textInput}
        value={task.title}
        onChangeText={(text) => setTask({ ...task, title: text })}
        placeholder='Nombre de la tarea'
      />

      <Text style={styles.inputLabel}>Hora*</Text>
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={onTimePickerPress}
      >
        <Text style={styles.timePickerText}>{task.time}</Text>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Descripción</Text>
      <TextInput
        style={[styles.textInput, styles.textArea]}
        value={task.description}
        onChangeText={(text) => setTask({ ...task, description: text })}
        placeholder='Detalles adicionales'
        multiline
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Activar notificación</Text>
        <Switch
          value={task.hasNotification}
          onValueChange={(value) =>
            setTask({ ...task, hasNotification: value })
          }
          thumbColor={task.hasNotification ? '#2196F3' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#2196F3' }}
        />
      </View>
    </View>
  )
}

export default TaskEditForm
