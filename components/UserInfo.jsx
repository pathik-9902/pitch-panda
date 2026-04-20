import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const UserInfo = ({ user }) => {
  return (
    <View style={styles.userInfoContainer}>
      <Text style={styles.userInfo}>User Id: #{user.userId}</Text>
      <Text style={styles.userInfo}>UserName: {user.username}</Text>
      <Text style={styles.userInfo}>Full Name: {user.fname} {user.lname}</Text>
      <Text style={styles.userInfo}>Email: {user.email}</Text>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
});
