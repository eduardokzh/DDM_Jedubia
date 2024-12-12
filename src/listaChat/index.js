import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { firestore, auth } from '../../firebase'; // Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';

const whatsImage = require('../../assets/whats.webp');

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);  // Para armazenar o usuário logado
  const navigation = useNavigation();

  // Monitorando o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);  // Atualiza o usuário logado
      } else {
        setCurrentUser(null);  // Se não estiver logado, define como null
      }
    });

    return () => unsubscribe(); // Cleanup ao desmontar o componente
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;  // Se não houver usuário logado, não faz nada

      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const usersData = querySnapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .filter(user => user.id !== currentUser.uid); // Filtrando o próprio usuário logado

        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao carregar usuários: ', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const startChat = (user) => {
    // Navegar para a tela de chat com o usuário selecionado
    navigation.navigate('ChatDetails', { user });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Usuários</Text>
      
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>Nenhum usuário encontrado</Text>
      ) : (
        users.map(user => (
          <TouchableOpacity
            key={user.id}
            style={styles.userItem}
            onPress={() => startChat(user)}
          >
            <View style={styles.userInfo}>
              <Image source={whatsImage} style={styles.userImage} />
              <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',  // Cor suave de fundo
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',  // Contraste maior para o título
  },
  userItem: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    elevation: 4,  // Sombra para destacar cada item
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  noUsersText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default Chats;
