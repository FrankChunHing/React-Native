import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ConfirmTradeModal = ({ visible, onClose, onConfirm, order, action, slotSize, currentPrice, limitOrderPrice, cash }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Closing popup');
        onClose();
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {(!order || !action) ? (
            <Text style={{ color: 'red' }}>Please select Buy/Sell and order type</Text>
          ) : (slotSize * currentPrice > cash && order === 'market') || (slotSize * limitOrderPrice > cash && order === 'limit') ? (
            <Text style={{ color: 'red' }}>Not enough BP</Text>
          ) : (
            <TouchableOpacity style={styles.modalButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});

export default ConfirmTradeModal;
