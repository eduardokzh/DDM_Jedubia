//telaChat
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firestore } from '../../firebase'; // Firebase configuration
import { doc, setDoc,updateDoc, arrayUnion, onSnapshot , getDoc} from 'firebase/firestore';
import Balloon from '../../components/balloon';

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
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

const currentUser = "lUYqOGX99PekkYQwYNFCRJdHLlF3";  // Usuário logado

const Chat = ({ route }) => {
  const { user } = route.params;  // Usuário com quem estamos conversando
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Escutando as mensagens em tempo real
  useEffect(() => {
    const chatId = [currentUser, user.id].sort().join("_");  // Criando ID único para o chat
    const chatDoc = doc(firestore, 'chats', chatId);
    
    const unsubscribe = onSnapshot(chatDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMessages(docSnapshot.data().messages || []);
      }
    });

    // Cleanup ao desmontar o componente
    return () => unsubscribe();
  }, [user.id]);

  // Enviar uma nova mensagem
  
const sendMessage = async () => {
  if (newMessage.trim() === '') return;  // Não envia mensagens vazias

  const chatId = [currentUser, user.id].sort().join("_"); // Criando ID único para o chat
  const chatDoc = doc(firestore, 'chats', chatId);

  const newMessageObj = {
    id: new Date().getTime(),  // Gerando um ID único para cada mensagem
    sentBy: currentUser,  // ID do usuário que enviou a mensagem
    content: newMessage.trim(),  // Conteúdo da mensagem
  };

  try {
    // Verificando se o documento do chat existe
    const chatSnapshot = await getDoc(chatDoc);
    
    if (!chatSnapshot.exists()) {
      // Se o documento não existe, cria um novo chat com a primeira mensagem
      await setDoc(chatDoc, {
        messages: [newMessageObj], // Cria o chat com a primeira mensagem
      });
    } else {
      // Se o chat já existe, apenas adiciona a nova mensagem
      await updateDoc(chatDoc, {
        messages: arrayUnion(newMessageObj),  // Adiciona a nova mensagem ao array de mensagens
      });
    }

    setNewMessage('');  // Limpa o campo de mensagem após enviar
  } catch (error) {
    console.error('Erro ao enviar mensagem: ', error);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chat com {user.name}</Text>
      {messages.map(message => (
        <Balloon key={message.id} message={message} currentUser={currentUser} />
      ))}

      <TextInput
        style={styles.messageInput}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Digite uma mensagem"
      />

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Enviar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Chat;
