import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firestore } from '../../firebase'; // Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const currentUser = "EXHVS5u50ShTWQhnYAymprkJrxr2"; // Substitua pelo UID real do usuário logado

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 32,
  },
  userItem: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
});

const Chats = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const usersData = querySnapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .filter(user => user.id !== currentUser); // Filtrando o usuário logado

        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao carregar usuários: ', error);
      }
    };

    fetchUsers();
  }, []);

  const startChat = (user) => {
    // Navegar para a tela de chat com o usuário selecionado
    navigation.navigate('ChatDetails', { user });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Usuários</Text>
      {users.map(user => (
        <TouchableOpacity
          key={user.id}
          style={styles.userItem}
          onPress={() => startChat(user)}
        >
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default Chats;
