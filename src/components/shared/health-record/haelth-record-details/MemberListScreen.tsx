import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { members } from '../../../../data/mockData';

const MemberListScreen = ({ route }: any) => {
  const { category } = route.params; // 'avian', 'mammal', or 'reptile'
  const navigation = useNavigation();

  const filteredMembers = members.filter((member) => member.category === category);

  const handleMemberPress = (member: any) => {
    navigation.navigate('MemberAnimalList', { member });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleMemberPress(item)}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Total Heads: {item.totalHeads}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  title: { fontSize: 18, fontWeight: 'bold' },
});

export default MemberListScreen;
