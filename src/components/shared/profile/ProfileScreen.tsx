import React from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button, useTheme, Divider, List } from 'react-native-paper';
import ScreenWrapper from '../screen-wrapper/ScreenWrapper';
import { useAuth } from '../../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const getRoleSpecificData = (role: string) => {
  const data = {
    headVet: {
      stats: [
        { title: 'Patients', value: '1,234', icon: 'paw', color: '#2196F3' },
        { title: 'Experience', value: '8 yrs', icon: 'timer', color: '#4CAF50' },
        { title: 'Rating', value: '4.9', icon: 'star', color: '#FFC107' },
        { title: 'Reviews', value: '328', icon: 'chatbubbles', color: '#9C27B0' },
      ],
      specializations: ['Small Animal Medicine', 'Surgery', 'Dentistry', 'Emergency Care'],
      certifications: ['ACVIM Board Certified', 'Advanced Veterinary Surgery', 'Pet Dentistry Expert'],
      badge: 'Senior Veterinarian',
      badgeColor: '#1976D2',
      badgeIcon: 'shield-checkmark',
    },
    assistantVet: {
      stats: [
        { title: 'Assisted', value: '856', icon: 'people', color: '#2196F3' },
        { title: 'Experience', value: '3 yrs', icon: 'timer', color: '#4CAF50' },
        { title: 'Procedures', value: '425', icon: 'medical', color: '#FFC107' },
        { title: 'Training', value: '12', icon: 'school', color: '#9C27B0' },
      ],
      specializations: ['Diagnostic Imaging', 'Lab Analysis', 'Vaccination', 'Patient Care'],
      certifications: ['Veterinary Assistant Certified', 'Emergency Care Training', 'Lab Procedures'],
      badge: 'Assistant Veterinarian',
      badgeColor: '#00897B',
      badgeIcon: 'medkit',
    },
    caretaker: {
      stats: [
        { title: 'Animals', value: '45', icon: 'paw', color: '#2196F3' },
        { title: 'Experience', value: '2 yrs', icon: 'timer', color: '#4CAF50' },
        { title: 'Tasks', value: '1.2k', icon: 'checkmark-circle', color: '#FFC107' },
        { title: 'Training', value: '8', icon: 'school', color: '#9C27B0' },
      ],
      specializations: ['Animal Handling', 'Feeding Management', 'Hygiene Care', 'Behavioral Monitoring'],
      certifications: ['Animal Care Certified', 'First Aid for Animals', 'Handling Specialist'],
      badge: 'Animal Caretaker',
      badgeColor: '#558B2F',
      badgeIcon: 'heart',
    },
  };

  return data[role as keyof typeof data] || data.caretaker;
};


const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {

  return (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );
};

const ProfileScreen: React.FC = () => {
  const { authData, signOut } = useAuth();
  const theme = useTheme();
    const roleData = getRoleSpecificData(authData?.role || 'caretaker');

  const stats = [
    { title: 'Patients', value: '1,234', icon: 'paw', color: theme.colors.primary },
    { title: 'Experience', value: '8 yrs', icon: 'timer', color: '#4CAF50' },
    { title: 'Rating', value: '4.9', icon: 'star', color: '#FFC107' },
    { title: 'Reviews', value: '328', icon: 'chatbubbles', color: '#2196F3' },
  ];

  const specializations = ['Small Animal Medicine', 'Surgery', 'Dentistry', 'Emergency Care'];
  const certifications = ['ACVIM Board Certified', 'Advanced Veterinary Surgery', 'Pet Dentistry Expert'];

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View style={styles.coverImage}>
            <Image
              source={{ uri: 'https://placekitten.com/400/200' }}
              style={styles.backgroundImage}
            />
            <View style={styles.overlay} />
          </View>
          <View style={styles.profileInfo}>
            <Avatar.Image
              size={100}
              source={{ uri: authData?.profilePicture || 'https://placekitten.com/200/200' }}
              style={styles.avatar}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{authData?.name || 'John Doe'}</Text>
              <Text style={styles.role}>{roleData.badge}</Text>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: `${roleData.badgeColor}15` }]}>
                  <Ionicons name={roleData.badgeIcon} size={14} color={roleData.badgeColor} />
                  <Text style={[styles.badgeText, { color: roleData.badgeColor }]}>
                    {authData?.role === 'headVet' ? 'Verified Professional' : 'Certified Staff'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(200).duration(600)} style={styles.statsContainer}>
          {roleData.stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </Animated.View>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              {authData?.role === 'caretakerA' || 'caretakerB' || 'caretakerC' ? 'Responsibilities' : 'Specializations'}
            </Text>
            <View style={styles.chipContainer}>
              {roleData.specializations.map((spec, index) => (
                <View 
                  key={index} 
                  style={[styles.chip, { backgroundColor: `${roleData.badgeColor}15` }]}
                >
                  <Ionicons name="checkmark-circle" size={14} color={roleData.badgeColor} />
                  <Text style={[styles.chipText, { color: roleData.badgeColor }]}>{spec}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Certifications & Training</Text>
            {roleData.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <Ionicons name="ribbon" size={20} color={roleData.badgeColor} />
                <Text style={styles.certificationText}>{cert}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <List.Section>
          <List.Item
            title="Edit Profile"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => {}}
          />
          <List.Item
            title="Schedule"
            left={props => <List.Icon {...props} icon="calendar" />}
            onPress={() => {}}
          />
          <List.Item
            title="Settings"
            left={props => <List.Icon {...props} icon="cog" />}
            onPress={() => {}}
          />
        </List.Section>

        <Button
          mode="contained"
          onPress={signOut}
          style={styles.logoutButton}
          icon="logout"
        >
          Sign Out
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 16,
  },
  coverImage: {
    height: 160,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    marginLeft: 4,
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  statsCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  statsContent: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statsTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  chipText: {
    marginLeft: 6,
    color: '#2E7D32',
    fontSize: 13,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  certificationText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 8,
  },
});

export default ProfileScreen;