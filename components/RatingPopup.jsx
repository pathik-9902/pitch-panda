import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { B_URL } from '@env';

const RatingPopup = ({ visible, onClose, onSubmit, turfId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`${B_URL}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turfId, value: rating, comment }),
      });
  
      if (response.ok) {
        onSubmit({ rating, comment });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.shade}>
        <View style={styles.card}>
          <Text style={styles.title}>How was your match?</Text>
          <Text style={styles.subtitle}>Rate your experience at this pitch</Text>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => setRating(val)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={val <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={val <= rating ? '#F59E0B' : '#E2E8F0'}
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Tell us about the turf quality, lighting, etc."
            placeholderTextColor="#94A3B8"
            multiline={true}
            value={comment}
            onChangeText={setComment}
            numberOfLines={4}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
               <Text style={styles.cancelText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitBtn, rating === 0 && styles.disabledBtn]} 
              onPress={handleSubmit}
              disabled={rating === 0 || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  shade: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    fontSize: 15,
    color: '#1E293B',
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 15,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#5AB25E',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5AB25E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  disabledBtn: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },
});

export default RatingPopup;
