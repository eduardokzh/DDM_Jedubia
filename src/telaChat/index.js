import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import Balloon from '../../components/balloon/'; // Componente para mostrar as mensagens
import { firestore, auth } from '../../firebase';
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',  // Cor de fundo mais suave
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#4CAF50', // Cor do header
    padding: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'space-between',
  },
  messageInput: {
    flex: 1,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    padding: 5,
    marginBottom: 10,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  emoji: {
    fontSize: 28,
    marginHorizontal: 10,
  },
});

const Chat = ({ route }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !user.id) return;

    const chatId = [currentUser.uid, user.id].sort().join("_");
    const chatDoc = doc(firestore, 'chats', chatId);

    const unsubscribe = onSnapshot(chatDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMessages(docSnapshot.data().messages || []);
        const typingUser = docSnapshot.data().typingUser;
        setIsTyping(typingUser !== currentUser.uid && typingUser !== undefined);
      }
    });

    return () => unsubscribe();
  }, [currentUser, user.id]);

  const handleTyping = (value) => {
    setNewMessage(value);

    if (value.trim() !== '') {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      updateTypingStatus(true);

      const timeout = setTimeout(() => {
        updateTypingStatus(false);
      }, 1000);

      setTypingTimeout(timeout);
    } else {
      updateTypingStatus(false);
    }
  };

  const updateTypingStatus = (typing) => {
    if (!currentUser || !user.id) return;

    const chatId = [currentUser.uid, user.id].sort().join("_");
    const chatDoc = doc(firestore, 'chats', chatId);

    updateDoc(chatDoc, {
      typingUser: typing ? currentUser.uid : null,
    });
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const chatId = [currentUser.uid, user.id].sort().join("_");
    const chatDoc = doc(firestore, 'chats', chatId);

    const newMessageObj = {
      id: new Date().getTime().toString(),
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

      setNewMessage('');
      updateTypingStatus(false);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const addEmojiToMessage = (emoji) => {
    setNewMessage((prev) => prev + emoji);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{user.name}</Text>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <Balloon key={message.id} message={message} currentUser={currentUser?.uid} />
        ))}
        {isTyping && <Text style={styles.typingIndicator}>{user.name} está digitando...</Text>}
      </ScrollView>

      {/* Emoji Row */}
      <View style={styles.emojiRow}>
        {['😊', '😂', '❤️', '👍', '😢'].map((emoji) => (
          <TouchableOpacity key={emoji} onPress={() => addEmojiToMessage(emoji)}>
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={handleTyping}
          placeholder="Digite uma mensagem"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
