import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { styles } from '../../styles'

const RoutineItem = ({ routine, onDelete, onEdit }) => {
  const handleDeletePress = () => {
    Alert.alert(
      'Eliminar rutina',
      `¿Estás seguro de que quieres eliminar "${routine.title}"?`,
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
        <Text style={styles.routineEmoji}>{routine.emoji || '⏰'}</Text>
        <View style={styles.routineContent}>
          <View style={styles.routineTextContainer}>
            <Text style={styles.routineTitle}>{routine.title}</Text>
            <Text>-</Text>
            {routine.description && (
              <Text style={styles.routineDescription} numberOfLines={1}>
                {routine.description}
              </Text>
            )}
          </View>
          <Text style={styles.routineTime}>🕐 {routine.time || '--:--'}</Text>
          {routine.hasNotification && (
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

export default RoutineItem
