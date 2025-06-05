import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { styles } from '../../styles'

const TaskItem = ({ task, onDelete, onEdit }) => {
  const handleDeletePress = () => {
    Alert.alert(
      'Eliminar rutina',
      `¿Estás seguro de que quieres eliminar "${task.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    )
  }
  return (
    <TouchableOpacity onPress={() => onEdit()}>
      <View style={styles.routineCard}>
        <Text style={styles.routineEmoji}>{task.emoji || '⏰'}</Text>
        <View style={styles.routineContent}>
          <View style={styles.routineTextContainer}>
            <Text style={styles.routineTitle}>{task.title}</Text>
            <Text>-</Text>
            {task.description && (
              <Text style={styles.routineDescription} numberOfLines={1}>
                {task.description}
              </Text>
            )}
          </View>
          <Text style={styles.routineTime}>🕐 {task.time || '--:--'}</Text>
          {task.hasNotification && (
            <Text style={styles.notificationIndicator}>
              🔔 Notificación activa
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation()
            handleDeletePress()
          }}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default TaskItem
