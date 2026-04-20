import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { UserContext } from '../UserContext';
import { B_URL } from '@env';

const Rewards = () => {
    const { userState, setUserState } = useContext(UserContext);
    const [pgCoins, setPgCoins] = useState(userState.pgCoins || 0);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchPgCoins();
    }, []);

    const fetchPgCoins = async () => {
        try {
            const response = await fetch(`${B_URL}/users/pgcoins/${userState.userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'fetch' }),
            });

            if (response.ok) {
                const data = await response.json();
                setPgCoins(data.pgCoins);
                // Sync with context
                setUserState(prev => ({ ...prev, pgCoins: data.pgCoins }));
            }
        } catch (error) {
            console.error('Error fetching PG Coins:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPgCoins();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
               <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={24} color="#0F172A" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Panda Rewards</Text>
               <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5AB25E']} tintColor="#5AB25E" />}
            >
                <View style={styles.heroCard}>
                   <View style={styles.coinBadge}>
                      <Ionicons name="flash" size={32} color="#F59E0B" />
                   </View>
                   <Text style={styles.coinValueText}>{pgCoins}</Text>
                   <Text style={styles.coinLabelText}>Panda Coins Available</Text>
                   <View style={styles.worthBox}>
                      <Text style={styles.worthText}>Worth ₹{pgCoins / 10}</Text>
                   </View>
                </View>

                <View style={styles.section}>
                   <Text style={styles.sectionTitle}>How to earn</Text>
                   <View style={styles.benefitCard}>
                      <View style={[styles.benefitIcon, { backgroundColor: '#F0FDF4' }]}>
                         <Ionicons name="calendar-check" size={20} color="#5AB25E" />
                      </View>
                      <View style={styles.benefitInfo}>
                         <Text style={styles.benefitTitle}>Book a Match</Text>
                         <Text style={styles.benefitSub}>Earn 10 coins for every ₹100 spent on bookings</Text>
                      </View>
                   </View>
                   <View style={styles.benefitCard}>
                      <View style={[styles.benefitIcon, { backgroundColor: '#EFF6FF' }]}>
                         <Ionicons name="people" size={20} color="#3B82F6" />
                      </View>
                      <View style={styles.benefitInfo}>
                         <Text style={styles.benefitTitle}>Refer Friends</Text>
                         <Text style={styles.benefitSub}>Get 50 coins when your friend completes their first match</Text>
                      </View>
                   </View>
                </View>

                <View style={styles.section}>
                   <Text style={styles.sectionTitle}>History</Text>
                   <View style={styles.emptyHistory}>
                      <Ionicons name="receipt-outline" size={40} color="#CBD5E1" />
                      <Text style={styles.emptyHistoryText}>No transactions yet</Text>
                   </View>
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    scrollContent: {
        padding: 24,
    },
    heroCard: {
        backgroundColor: '#0F172A',
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
    },
    coinBadge: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.2)',
    },
    coinValueText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFF',
    },
    coinLabelText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
    },
    worthBox: {
        marginTop: 20,
        backgroundColor: 'rgba(90, 178, 94, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    worthText: {
        color: '#5AB25E',
        fontWeight: '800',
        fontSize: 14,
    },
    section: {
        marginTop: 40,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    benefitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    benefitIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    benefitInfo: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    benefitSub: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    emptyHistory: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    emptyHistoryText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
        marginTop: 12,
    }
});

export default Rewards;
