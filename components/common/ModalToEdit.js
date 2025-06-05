import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useState } from 'react'
import { styles } from '../../styles'
import TaskForm from '../tasks/TaskForm'
import { updateTask, updateRoutine } from '../../utils/storage'

const ModalToEdit = ({ data, isEdit, setIsEdit, type }) => {
  return (
    <Modal visible={isEdit} animationType='slide' presentationStyle='pageSheet'>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsEdit(false)}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Actualizar Tarea</Text>
          <TouchableOpacity onPress={console.log('test')}>
            <Text style={styles.saveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <TaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            onTimePickerPress={() => setShowTimePicker(true)}
            data={data}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default ModalToEdit
