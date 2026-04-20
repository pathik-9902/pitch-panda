import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { B_URL } from '@env';
import CustomAlert from '../../../components/CustomAlert';
import iconsBack from '../../../assets/icons/back.png';

const Payments = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  
  const discount = Number(searchParams.discount) || 0;
  const weekend_inc = Number(searchParams.weekend_inc) || 0;
  const rawBookingDetails = typeof searchParams.bookingDetails === 'string' 
    ? JSON.parse(searchParams.bookingDetails) 
    : searchParams.bookingDetails;

  const bookingDetails = rawBookingDetails || {};
  const { 
    turfId, 
    playgroundId, 
    slotDate, 
    slotTime, 
    numOfHours = 0, 
    price = 0, 
    sport 
  } = bookingDetails;

  const nPrice = Number(price);
  const nNumOfHours = Number(numOfHours);
  const nDiscount = Number(discount);
  const nWeekendInc = Number(weekend_inc);
  const { userState, setUserState } = useContext(UserContext);
  const [redeemEnabled, setRedeemEnabled] = useState(false);
  const [paymentPercentage, setPaymentPercentage] = useState(100);
  const [bookingStatus, setBookingStatus] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const isWeekend = (dateStr) => {
    if (!dateStr) return false;
    const parts = dateStr.split('-');
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const calculateTotalPrice = () => {
    const basePrice = isWeekend(slotDate) ? nPrice + nWeekendInc : nPrice;
    const totalBase = basePrice * nNumOfHours;
    const discountAmount = (nDiscount * totalBase) / 100;
    const redeemedAmount = (redeemEnabled ? 100 : 0);
    const total = totalBase - discountAmount - redeemedAmount;
    return isNaN(total) ? 0 : total;
  };

  const performOperationOnCoins = async (action, amount = 0) => {
    try {
      const response = await axios.post(`${B_URL}/users/pgcoins/${userState.userId}`, {
        action,
        amount,
      });
      const { newPgCoins } = response.data;
      setUserState(prev => ({ ...prev, pgCoins: newPgCoins }));
    } catch (error) {
      console.error('Error updating coins:', error);
    }
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      setBookingStatus('Booking');

      // 1. Check for slot overlaps
      const overlapResponse = await axios.get(`${B_URL}/slots/book/${turfId}/${playgroundId}`);
      const existingBookings = overlapResponse.data;

      const [hours, minutes] = slotTime.split(':').map(Number);
      const parts = slotDate.split('-');
      const slotStart = new Date(parts[2], parts[1] - 1, parts[0]);
      slotStart.setHours(hours, minutes, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + numOfHours * 60 * 60 * 1000);

      const isSlotOverlap = existingBookings.some((booking) => {
        if (booking.status === 'booking' || booking.status === 'booked') {
          const [bookedHours, bookedMinutes] = booking.slotTime.split(':').map(Number);
          const bParts = booking.slotDate.split('-');
          const bookingStart = new Date(bParts[2], bParts[1] - 1, bParts[0]);
          bookingStart.setHours(bookedHours, bookedMinutes, 0, 0);
          const bookingEnd = new Date(bookingStart.getTime() + booking.numOfHours * 60 * 60 * 1000);

          return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          );
        }
        return false;
      });

      if (isSlotOverlap) {
        setAlertHeading('Slot Unavailable');
        setAlertMessage('This slot was just taken. Please select another time.');
        setAlertType('error');
        setAlertVisible(true);
        setBookingStatus('');
        return;
      }

      // 2. Process Booking
      const bookedBy = `${userState.fname} ${userState.lname}`;
      const amountPaid = (calculateTotalPrice() * paymentPercentage) / 100;
      const amountToBePaid = calculateTotalPrice() - amountPaid;

      await axios.post(`${B_URL}/slots/bookSlot`, {
        turfId, playgroundId, slotDate, slotTime, numOfHours, 
        userId: userState.userId, bookedBy, status: 'Booked',
        amountPaid, amountToBePaid,
      });

      // 3. Update Coins
      if (redeemEnabled) {
        await performOperationOnCoins('subtract', 100);
      }
      await performOperationOnCoins('add', 10 * numOfHours);

      setAlertHeading('Success');
      setAlertMessage('Your pitch is secured! See you on the field.');
      setAlertType('success');
      setAlertVisible(true);
      setBookingStatus('Booked');
    } catch (error) {
      setAlertHeading('Error');
      setAlertMessage('Something went wrong. Please try again.');
      setAlertType('error');
      setAlertVisible(true);
      setBookingStatus('');
    } finally {
      setLoading(false);
    }
  };

  const PriceRow = ({ label, value, isTotal, isNegative }) => (
    <View style={[styles.priceRow, isTotal && styles.totalRow]}>
      <Text style={[styles.priceLabel, isTotal && styles.totalLabel]}>{label}</Text>
      <Text style={[styles.priceValue, isTotal && styles.totalValue, isNegative && styles.negativeValue]}>
        {isNegative ? '-' : ''}₹{Math.round(value)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image source={iconsBack} tintColor="#1E293B" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Pay</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Booking Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{slotDate}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{slotTime}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{numOfHours}h</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sport</Text>
              <Text style={styles.summaryValue}>{sport}</Text>
            </View>
          </View>
        </View>

        <View style={styles.billCard}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <PriceRow label="Base Price" value={nPrice * nNumOfHours} />
          {isWeekend(slotDate) && <PriceRow label="Weekend Premium" value={nWeekendInc * nNumOfHours} />}
          {nDiscount > 0 && (
            <PriceRow 
              label={`Discount (${nDiscount}%)`} 
              value={(nDiscount * (isWeekend(slotDate) ? nPrice + nWeekendInc : nPrice) * nNumOfHours) / 100} 
              isNegative 
            />
          )}
          {redeemEnabled && <PriceRow label="Points Redeemed" value={100} isNegative />}
          <View style={styles.divider} />
          <PriceRow label="Grand Total" value={calculateTotalPrice()} isTotal />
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Payment Options</Text>
          <View style={styles.optionGrid}>
            {[30, 50, 100].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.optionBtn, paymentPercentage === p && styles.optionBtnActive]}
                onPress={() => setPaymentPercentage(p)}
              >
                <Text style={[styles.optionText, paymentPercentage === p && styles.optionTextActive]}>{p}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.redeemAction, redeemEnabled && styles.redeemActionActive]}
          onPress={() => setRedeemEnabled(!redeemEnabled)}
          disabled={userState.pgCoins < 100}
        >
          <View style={styles.redeemInfo}>
            <Text style={[styles.redeemTitle, redeemEnabled && styles.redeemTitleActive]}>Redeem 100 Points</Text>
            <Text style={styles.redeemSub}>Current: {userState.pgCoins || 0} pts</Text>
          </View>
          <View style={[styles.checkbox, redeemEnabled && styles.checkboxActive]}>
             {redeemEnabled && <Text style={styles.checkMark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>Cancellation Policy</Text>
          <Text style={styles.policyText}>• Full refund if canceled 24h before kick-off.</Text>
          <Text style={styles.policyText}>• No refund for late cancellations.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalFooter}>
          <Text style={styles.totalLabel}>Payable Now</Text>
          <Text style={styles.totalValueLarge}>₹{Math.round((calculateTotalPrice() * paymentPercentage) / 100)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.payBtn, (isLoading || bookingStatus === 'Booked') && styles.payBtnDisabled]} 
          onPress={handleBooking}
          disabled={isLoading || bookingStatus === 'Booked'}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.payBtnText}>
              {bookingStatus === 'Booked' ? 'Pitch Secured!' : 'Confirm Booking'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertVisible}
        type={alertType}
        heading={alertHeading}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (alertType === 'success') router.replace('/(tabs)');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 16,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 160,
  },
  summaryCard: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    width: '45%',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  billCard: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '700',
  },
  negativeValue: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  totalRow: {
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#5AB25E',
  },
  optionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBtnActive: {
    borderColor: '#5AB25E',
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  optionTextActive: {
    color: '#5AB25E',
  },
  redeemAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    marginBottom: 24,
  },
  redeemActionActive: {
    borderColor: '#5AB25E',
    backgroundColor: '#F0FDF4',
  },
  redeemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  redeemTitleActive: {
    color: '#166534',
  },
  redeemSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#5AB25E',
    borderColor: '#5AB25E',
  },
  checkMark: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  policyCard: {
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  policyText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalFooter: {
    flex: 1,
  },
  totalValueLarge: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
  },
  payBtn: {
    backgroundColor: '#5AB25E',
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 160,
    shadowColor: '#5AB25E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
  },
  payBtnDisabled: {
    opacity: 0.7,
    backgroundColor: '#94A3B8',
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  }
});

export default Payments;
