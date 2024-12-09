import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import Balloon from '../../components/balloon/';
import { firestore, auth } from '../../firebase'; // Ajuste o caminho conforme necessário
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const whatsImage = require('../../assets/whats.webp');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#42f563', // Cor do fundo, igual ao Login
  },
  title: {
    fontSize: 15, // Ajuste o tamanho da fonte para 15
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#3fab4e', // Cor do botão semelhante ao Login
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: 'black', // Cor do texto como branco
    marginTop: 10,
    width:200,
    backgroundColor: 'white', // Cor de fundo azul
    borderRadius: 10,
    fontSize: 18,
    padding: 8,
    flexShrink: 1, // Garante que não quebre de linha
    whiteSpace: 'nowrap', // Impede quebra de linha
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  messageBalloon: {
    backgroundColor: '#006400', // Verde escuro para as mensagens
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%', // Limita o tamanho da mensagem
  },
  messageText: {
    color: 'white', // Cor do texto das mensagens (branco)
    fontSize: 16,
  },
});


const Chat = ({ route }) => {
  const { user } = route.params; // Usuário com quem estamos conversando
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // Para armazenar o usuário logado
  const [isTyping, setIsTyping] = useState(false); // Para monitorar se o usuário está digitando
  const [typingTimeout, setTypingTimeout] = useState(null); // Controle de tempo para detectar quando o usuário parou de digitar

  // Monitorando o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // Atualiza o usuário logado
      } else {
        setCurrentUser(null); // Se não estiver logado, define como null
      }
    });

    return () => unsubscribe(); // Cleanup ao desmontar o componente
  }, []);

  useEffect(() => {
    if (!currentUser || !user.id) return; // Se não houver usuário logado ou o usuário da conversa

    const chatId = [currentUser.uid, user.id].sort().join("_"); // Criando ID único para o chat
    const chatDoc = doc(firestore, 'chats', chatId);
    
    const unsubscribe = onSnapshot(chatDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMessages(docSnapshot.data().messages || []);
        // Atualiza o status de digitação
        const typingUser = docSnapshot.data().typingUser;
        setIsTyping(typingUser !== currentUser.uid && typingUser !== undefined);
      }
    });

    return () => unsubscribe(); // Cleanup ao desmontar o componente
  }, [currentUser]);

  // Atualiza o status de digitação no Firestore
  const handleTyping = (value) => {
    setNewMessage(value);

    if (value.trim() !== '') {
      if (typingTimeout) {
        clearTimeout(typingTimeout); // Limpa o timeout anterior se o usuário continuar digitando
      }

      // Define o status de digitação no Firestore
      updateTypingStatus(true);

      const timeout = setTimeout(() => {
        updateTypingStatus(false); // Se o usuário parar de digitar por 1 segundo, atualiza para false
      }, 1000); // Espera 1 segundo após o usuário parar de digitar

      setTypingTimeout(timeout);
    } else {
      updateTypingStatus(false); // Se o campo estiver vazio, define como 'false'
    }
  };

  // Atualiza o status de digitação no Firestore
  const updateTypingStatus = (typing) => {
    if (!currentUser || !user.id) return;

    const chatId = [currentUser.uid, user.id].sort().join("_");
    const chatDoc = doc(firestore, 'chats', chatId);

    updateDoc(chatDoc, {
      typingUser: typing ? currentUser.uid : null,
    });
  };

  // Função para enviar mensagem
  const sendMessage = async () => {
    if (newMessage.trim() === '') return; // Não envia mensagens vazias

    const chatId = [currentUser.uid, user.id].sort().join("_");
    const chatDoc = doc(firestore, 'chats', chatId);

    const newMessageObj = {
      id: new Date().getTime().toString(), // Garante que o ID seja uma string
      sentBy: currentUser.uid,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const chatSnapshot = await getDoc(chatDoc);

      if (!chatSnapshot.exists()) {
        await setDoc(chatDoc, { users: [currentUser.uid, user.id], messages: [newMessageObj] });
      } else {
        await updateDoc(chatDoc, { messages: arrayUnion(newMessageObj) });
      }

      // Limpa os campos após o envio
      setNewMessage('');
      updateTypingStatus(false); // Limpa o status de digitação ao enviar a mensagem
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chat com {user.name}</Text>
      <ScrollView>
        {messages.map((message) => (
          <Balloon key={message.id} message={message} currentUser={currentUser?.uid} />
        ))}
      </ScrollView>

      {/* Indicador de digitação */}
      {isTyping && <Text style={styles.typingIndicator}>{user.name} está digitando...</Text>}

      <TextInput
        style={styles.messageInput}
        value={newMessage}
        onChangeText={handleTyping}
        placeholder="Digite uma mensagem"
      />

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Enviar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Chat;
