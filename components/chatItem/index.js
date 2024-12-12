import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import UserDefaultImage from '../../assets/user.png';

const styles = StyleSheet.create({
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Alinha verticalmente os itens
    marginVertical: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff', // Fundo branco para o item do chat
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
  },
  userPairImage: {
    width: 48, // Aumentando a imagem do usuário
    height: 48,
    borderRadius: 24, // Tornando a imagem circular
    marginRight: 12,
  },
  userPairPhone: {
    fontWeight: '600', // Aumentando o peso da fonte
    fontSize: 16, // Aumentando o tamanho da fonte
    color: '#333', // Cor mais escura para melhor contraste
  },
  chatLastMessage: {
    fontWeight: '400',
    color: '#666', // Cor mais suave para a última mensagem
    fontSize: 14, // Ajustando o tamanho da fonte
  },
  container: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  chatButton: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#4CAF50', // Cor de fundo do botão
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white', // Texto branco para o botão
    fontWeight: '500',
  },
});

const ChatItem = ({ chat, currentUser, onPress }) => {
  const [userPair] = chat.users.filter((u) => u.id !== currentUser);
  
  return (
    <View style={styles.chatItemContainer}>
      <Image source={UserDefaultImage} style={styles.userPairImage} />
      <View style={{ flexGrow: 1 }}> {/* Permite que o texto ocupe o espaço restante */}
        <Text style={styles.userPairPhone}>{userPair.phone}</Text> {/* Exibindo o telefone do usuário */}
        <Text style={styles.chatLastMessage}>
          {chat.messages[chat.messages.length - 1]?.content}
        </Text>
        <TouchableOpacity style={styles.chatButton} onPress={onPress}>
          <Text style={styles.chatButtonText}>Ir para o chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatItem;
