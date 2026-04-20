import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../UserContext';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const { userState, setUserState, logout } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/Login');
  };

  const ProfileItem = ({ icon, title, onPress, color = '#64748B' }) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.itemIcon, { backgroundColor: color + '12' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.itemTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );

  const StatItem = ({ label, value, icon, color }) => (
    <View style={styles.statBox}>
      <View style={[styles.statIcon, { backgroundColor: color + '12' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {userState?.userId ? (
          <>
            <View style={styles.headerSection}>
               <View style={styles.headerTop}>
                  <View style={styles.avatarWrapper}>
                     <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{(userState.fname || 'P').charAt(0).toUpperCase()}{(userState.lname || 'P').charAt(0).toUpperCase()}</Text>
                     </View>
                     <TouchableOpacity style={styles.editBadge} onPress={() => router.push('/(profile)/Edit')}>
                        <Ionicons name="pencil" size={12} color="#FFF" />
                     </TouchableOpacity>
                  </View>
                  <View style={styles.userInfo}>
                     <Text style={styles.userName}>{userState.fname} {userState.lname}</Text>
                     <Text style={styles.userEmail}>{userState.email}</Text>
                     <View style={styles.loyaltyTag}>
                        <Ionicons name="shield-checkmark" size={12} color="#5AB25E" />
                        <Text style={styles.loyaltyText}>Premium Member</Text>
                     </View>
                  </View>
               </View>

               <View style={styles.rewardsCard}>
                  <View style={styles.rewardsInfo}>
                     <Text style={styles.rewardsLabel}>Panda Coins</Text>
                     <View style={styles.coinRow}>
                        <Ionicons name="flash" size={24} color="#F59E0B" />
                        <Text style={styles.coinValue}>{userState.pgCoins || 0}</Text>
                     </View>
                     <Text style={styles.rewardsSub}>Save ₹{(userState.pgCoins || 0) / 10} on your next booking</Text>
                  </View>
                  <TouchableOpacity style={styles.redeemBtn} onPress={() => router.push('/(profile)/Rewards')}>
                     <Text style={styles.redeemText}>View</Text>
                  </TouchableOpacity>
               </View>

               <View style={styles.quickStats}>
                  <StatItem label="Bookings" value="12" icon="calendar" color="#3B82F6" />
                  <View style={styles.statDivider} />
                  <StatItem label="Rank" value="#124" icon="trophy" color="#8B5CF6" />
               </View>
            </View>

            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuCard}>
              <ProfileItem icon="person-outline" title="Edit Profile" onPress={() => router.push('/(profile)/Edit')} color="#5AB25E" />
              <View style={styles.itemDivider} />
              <ProfileItem icon="time-outline" title="Booking History" onPress={() => router.push('/(profile)/BookedSlots')} color="#3B82F6" />
              <View style={styles.itemDivider} />
              <ProfileItem icon="wallet-outline" title="Payments" onPress={() => {}} color="#8B5CF6" />
            </View>

            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuCard}>
              <ProfileItem icon="notifications-outline" title="Notifications" onPress={() => {}} color="#F59E0B" />
              <View style={styles.itemDivider} />
              <ProfileItem icon="shield-outline" title="Security" onPress={() => {}} color="#64748B" />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
               <Ionicons name="log-out-outline" size={20} color="#EF4444" />
               <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>

            <View style={styles.footerInfo}>
               <Text style={styles.version}>v 1.0.2</Text>
               <Text style={styles.copyright}>Crafted with pride by Pitch Panda</Text>
            </View>
          </>
        ) : (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#5AB25E" />
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.replace('/(auth)/Login')}>
               <Text style={{ color: '#5AB25E', fontWeight: '700' }}>Please Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    padding: 24,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#5AB25E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5AB25E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0F172A',
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  loyaltyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  loyaltyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5AB25E',
    textTransform: 'uppercase',
  },
  rewardsCard: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  rewardsInfo: {
    flex: 1,
  },
  rewardsLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  coinValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
  },
  rewardsSub: {
    color: '#5AB25E',
    fontSize: 12,
    fontWeight: '600',
  },
  redeemBtn: {
    backgroundColor: '#5AB25E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  redeemText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginLeft: 70,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    marginTop: 32,
    padding: 18,
    borderRadius: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
  },
  footerInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  copyright: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  loader: {
    paddingTop: 100,
    alignItems: 'center',
  }
});

export default Profile;
