import React from 'react';
import { SafeAreaView, ScrollView, View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.logoBadge}>
               <Text style={styles.logoPanda}>🐼</Text>
            </View>
            <Text style={styles.brandTitle}>Pitch Panda</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>The ultimate arena booking experience</Text>
          </View>
          
          <View style={styles.bottomSection}>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/Login')}
              activeOpacity={0.9}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <View style={styles.buttonIcon}>
                 <Text style={{ color: '#FFF', fontWeight: '900' }}>→</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New here?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/Register')}>
                <Text style={styles.signUpText}>Join the club</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)', // Dark slate overlay
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoBadge: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoPanda: {
    fontSize: 40,
  },
  brandTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -2,
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: '#5AB25E',
    borderRadius: 2,
    marginVertical: 20,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
    maxWidth: '80%',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#5AB25E',
    borderRadius: 24,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    elevation: 10,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    fontWeight: '600',
  },
  signUpText: {
    color: '#5AB25E',
    fontSize: 15,
    fontWeight: '800',
    textDecorationLine: 'underline',
  }
});

export default Index;
