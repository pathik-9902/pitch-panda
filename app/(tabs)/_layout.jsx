import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import icons from '../../assets/icons/icons'; 
import { UserContext } from '../UserContext'; 
import { Ionicons } from '@expo/vector-icons';
const TabIcon = ({ icon, color, focused }) => {
  const iconSize = focused ? 28 : 24;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: iconSize, height: iconSize }}
      />
      {focused && <View style={styles.indicator} />}
    </View>
  );
};

const TabsLayout = () => {
  const { userState } = useContext(UserContext);
  const router = useRouter();

  const navigateToProfile = () => {
    router.push('/(profile)/Profile');
  };

  const navigateToCitySelect = () => {
    router.push('/(auth)/CitySelect');
  };

  const locationText = userState?.location || 'Select city';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <TouchableOpacity style={styles.locationContainer} onPress={navigateToCitySelect}>
            <Ionicons name="location-outline" size={16} color="#5AB25E" />
            <Text style={styles.locationText}>{locationText}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={navigateToProfile}>
          <View style={styles.avatar}>
             <Text style={styles.avatarText}>{userState?.fname?.charAt(0) || 'U'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false, 
          tabBarActiveTintColor: '#5AB25E',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="(book)"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.bookturf} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="(fitness)"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.fitness} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerIcon: {
    width: 16,
    height: 16,
  },
  locationText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 2,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5AB25E',
  },
  tabBar: {
    backgroundColor: '#FFF',
    borderTopWidth: 0,
    height: 90,
    paddingBottom: 30,
    paddingTop: 10,
    elevation: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5AB25E',
    marginTop: 6,
  }
});

export default TabsLayout;
