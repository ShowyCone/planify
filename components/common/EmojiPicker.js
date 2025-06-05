import React from 'react'
import { Modal, View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { styles } from '../../styles'

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

export default EmojiPicker
