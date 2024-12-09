import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import EmojiSelector from 'react-native-emoji-selector'; // Importa o seletor de emojis
import Balloon from '../../components/balloon/';
import { firestore, auth } from '../../firebase';
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#42f563',
  },
  title: {
    fontSize: 24,
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
    backgroundColor: '#3fab4e',
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
    color: 'black',
    marginTop: 10,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 18,
    padding: 8,
    flexShrink: 1,
  },
  emojiButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 18, // Tamanho do emoji reduzido
  },
});

const Chat = ({ route }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // Controle para exibir o seletor de emojis

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
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
  }, [currentUser]);

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chat com {user.name}</Text>
      <ScrollView>
        {messages.map((message) => (
          <Balloon key={message.id} message={message} currentUser={currentUser?.uid} />
        ))}
      </ScrollView>

      {isTyping && <Text style={styles.typingIndicator}>{user.name} está digitando...</Text>}

      <TextInput
        style={styles.messageInput}
        value={newMessage}
        onChangeText={handleTyping}
        placeholder="Digite uma mensagem"
      />

      {/* Botão para exibir o seletor de emojis */}
      <TouchableOpacity style={styles.emojiButton} onPress={() => setEmojiPickerVisible(!emojiPickerVisible)}>
        <Text style={styles.emojiText}>😊</Text>
      </TouchableOpacity>

      {emojiPickerVisible && (
        <EmojiSelector
          onEmojiSelected={(emoji) => setNewMessage(newMessage + emoji)}
        />
      )}

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Enviar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Chat;