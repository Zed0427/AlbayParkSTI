  import React, { useState, useRef, useEffect } from 'react';
  import { View, StyleSheet, Image, Animated, TouchableOpacity, FlatList, Dimensions } from 'react-native';
  import { Text, Button, TextInput, Portal, Modal, Card, IconButton, Chip, FAB, SegmentedButtons, Menu, Avatar } from 'react-native-paper';
  import { AnimalDetailsScreenProps } from '../../../../types/types';
  import { HealthRecord, Animal, Member } from '../../../../data/models';
  import { animals, healthRecords, members } from '../../../../data/mockData';  
  import { useAuth } from '../../../../context/AuthContext';
  import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
  import { LineChart, BarChart } from 'react-native-chart-kit';
  import * as ImagePicker from 'expo-image-picker';
  import ScreenWrapper from '../../screen-wrapper/ScreenWrapper';
  import { MotiView } from 'moti';

  const AnimalDetailsScreen: React.FC<AnimalDetailsScreenProps> = ({ route, navigation }) => {
    const { animalId } = route.params;
    const { authData } = useAuth();

// Update the animal finding logic with proper types
const animal = React.useMemo(() => {
  const foundMember: Member | undefined = members.find((member: Member) => 
    member.animals.some((animal: Animal) => animal.id === animalId)
  );
  return foundMember?.animals.find((animal: Animal) => animal.id === animalId);
}, [animalId]);

 // Log to debug
 useEffect(() => {
  console.log('Found animal:', animal);
}, [animal]);

const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('records');
    const [newRecord, setNewRecord] = useState({
      temperature: '',
      weight: '',
      heartRate: '',
      respiratoryRate: '',
      medication: '',
      diet: '',
      notes: '',
    });
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [imageCaption, setImageCaption] = useState('');
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const [newComment, setNewComment] = useState('');

  // Update records to use the healthRecords from the found animal
  const [records, setRecords] = useState(
    animal?.healthRecords || []
  );

   // Early return if no animal found
   if (!animal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Animal not found</Text>
      </View>
    );
  }

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleAddRecord = () => {
      if (!animal || !authData) return;

      const newHealthRecord: HealthRecord = {
        id: String(Date.now()),
        animalId: animal.id,
        date: new Date().toISOString(),
        type: 'checkup',
        notes: newRecord.notes + (newRecord.diet ? ` Diet: ${newRecord.diet}` : ''),
        vitals: {
          temperature: parseFloat(newRecord.temperature),
          weight: parseFloat(newRecord.weight),
          heartRate: parseInt(newRecord.heartRate),
          respiratoryRate: parseInt(newRecord.respiratoryRate),
        },
        treatedBy: authData.id,
        images: [],
        medications: newRecord.medication
          ? [{
              name: newRecord.medication,
              dosage: 'As prescribed',
              frequency: 'daily',
              startDate: new Date().toISOString(),
              endDate: '',
            }]
          : [],
        status: 'completed',
      };

      setRecords([newHealthRecord, ...records]);
      setIsModalVisible(false);
      setNewRecord({
        temperature: '',
        weight: '',
        heartRate: '',
        respiratoryRate: '',
        medication: '',
        diet: '',
        notes: '',
      });
    };

    const handleStatusChange = (newStatus: Animal['healthStatus']) => {
      if (animal && (authData?.role === 'headVet' || authData?.role === 'assistantVet')) {
        animal.healthStatus = newStatus;
        // You might want to call an API to update the status on the server here
      }
      setStatusMenuVisible(false);
    };

    const handleAddImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && authData) {
        const newItem: GalleryItem = {
          id: String(Date.now()),
          imageUri: result.assets[0].uri,
          caption: imageCaption,
          date: new Date().toISOString(),
          uploadedBy: {
            id: authData.id,
            name: authData.name,
            avatar: authData.profilePicture || '/placeholder-user.jpg',
          },
          likes: [],
          comments: [],
        };
        setGallery([newItem, ...gallery]);
        setImageCaption('');
      }
    };

    const handleAddComment = () => {
      if (selectedImage && newComment.trim() && authData) {
        const updatedGallery = gallery.map(item => {
          if (item.id === selectedImage.id) {
            return {
              ...item,
              comments: [
                ...item.comments,
                {
                  id: Date.now().toString(),
                  userId: authData.id,
                  username: authData.name,
                  text: newComment,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return item;
        });
        setGallery(updatedGallery);
        setNewComment('');
      }
    };

    const handleToggleLike = (imageId: string) => {
      if (authData) {
        const updatedGallery = gallery.map(item => {
          if (item.id === imageId) {
            const likes = item.likes.includes(authData.id)
              ? item.likes.filter(id => id !== authData.id)
              : [...item.likes, authData.id];
            return { ...item, likes };
          }
          return item;
        });
        setGallery(updatedGallery);
      }
    };

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const headerTranslate = scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, -100],
      extrapolate: 'clamp',
    });

    if (!animal) return null;

    const isValidNumber = (value: any): boolean => !isNaN(parseFloat(value)) && isFinite(value);

    const temperatureData = records.length
      ? records.slice(0, 7).reverse().map(record => record.vitals.temperature ?? 0)
      : [0, 0, 0, 0, 0, 0, 0];

    const weightData = records.length
      ? records.slice(0, 7).reverse().map(record => record.vitals.weight ?? 0)
      : [0, 0, 0, 0, 0, 0, 0];

    if (temperatureData.length === 0 || weightData.length === 0) {
      return (
        <Text style={{ textAlign: 'center', marginTop: 16 }}>
          No data available for analytics.
        </Text>
      );
    }

    const renderGalleryItem = ({ item }: { item: GalleryItem }) => (
      <TouchableOpacity
        style={styles.galleryItem}
        onPress={() => setSelectedImage(item)}
      >
        <Image source={{ uri: item.imageUri }} style={styles.galleryImage} />
        <View style={styles.galleryOverlay}>
          <View style={styles.galleryStats}>
            <MaterialCommunityIcons name="paw" size={16} color="#fff" />
            <Text style={styles.galleryStatsText}>{item.likes.length}</Text>
            <MaterialCommunityIcons name="comment-outline" size={16} color="#fff" />
            <Text style={styles.galleryStatsText}>{item.comments.length}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: HealthRecord }) => (
      <Card key={item.id} style={styles.recordCard}>
        <Card.Content>
          <Text style={styles.dateText}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <View style={styles.vitalContainer}>
            <IconButton icon="thermometer" size={20} iconColor="#666" />
            <Text style={styles.vitalText}>
              {item.vitals.temperature}°C
            </Text>
          </View>
          <View style={styles.vitalContainer}>
            <IconButton icon="weight" size={20} iconColor="#666" />
            <Text style={styles.vitalText}>
              {item.vitals.weight} kg
            </Text>
          </View>
          <View style={styles.vitalContainer}>
            <IconButton icon="heart" size={20} iconColor="#666" />
            <Text style={styles.vitalText}>
              {item.vitals.heartRate} bpm
            </Text>
          </View>
          <View style={styles.vitalContainer}>
            <IconButton icon="lungs" size={20} iconColor="#666" />
            <Text style={styles.vitalText}>
              {item.vitals.respiratoryRate} breaths/min
            </Text>
          </View>
          <Text style={styles.medicationText}>
            Medications: {item.medications?.map((med) => `${med.name} (${med.dosage})`).join(', ') || 'None'}
          </Text>
          <Text style={styles.dietText}>Diet: {item.diet}</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </Card.Content>
      </Card>
    );

    const renderHeader = () => (
      <>
         <View style={styles.imageContainer}>
        <Animated.Image 
          source={{ uri: animal.imageUri }}
          style={[styles.image, { opacity: imageOpacity }]}
          onError={(error) => console.log('Image loading error:', error)}
        />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.infoHeader}>
          <Text style={styles.name}>{animal.uniqueName}</Text>
          <FontAwesome
            name={animal.gender === 'male' ? 'mars' : 'venus'}
            size={24}
            color="#666"
          />
        </View>
        <Text style={styles.species}>{animal.species}</Text>
        <Text style={styles.age}>{animal.age}</Text>
        <View style={styles.statusContainer}>
          <Chip
            style={[styles.statusChip, getStatusColor(animal.healthStatus)]}
            textStyle={styles.statusText}
          >
            {animal.healthStatus}
          </Chip>
            {(authData?.role === 'headVet' || authData?.role === 'assistantVet') && (
              <Menu
                visible={statusMenuVisible}
                onDismiss={() => setStatusMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => setStatusMenuVisible(true)}
                  />
                }
              >
                <Menu.Item onPress={() => handleStatusChange('healthy')} title="Healthy" />
                <Menu.Item onPress={() => handleStatusChange('sick')} title="Sick" />
                <Menu.Item onPress={() => handleStatusChange('under treatment')} title="Under Treatment" />
              </Menu>
            )}
          </View>
          <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'records', label: 'Records' },
            { value: 'analytics', label: 'Analytics' },
            { value: 'gallery', label: 'Gallery' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>
    </>
  );

    const renderContent = () => {
      if (activeTab === 'records') {
        return (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        );
      } else if (activeTab === 'analytics') {
        return (
          <>
            <Card style={styles.chartCard}>
              <Card.Title title="Temperature History" />
              <Card.Content>
                <LineChart
                  data={{
                    labels: ['1', '2', '3', '4', '5', '6', '7'],
                    datasets: [{ data: temperatureData }],
                  }}
                  width={300}
                  height={200}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </Card.Content>
            </Card>
            <Card style={styles.chartCard}>
              <Card.Title title="Weight History" />
              <Card.Content>
                <BarChart
                  data={{
                    labels: ['1', '2', '3', '4', '5', '6', '7'],
                    datasets: [{ data: weightData }],
                  }}
                  width={300}
                  height={200}
                  yAxisLabel="kg "
                  yAxisSuffix="kg"
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </Card.Content>
            </Card>
          </>
        );
      } else if (activeTab === 'gallery') {
        return (
          <FlatList
            data={gallery}
            renderItem={renderGalleryItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.galleryRow}
          />
        );
      }
      return null;
    };

    return (
      <ScreenWrapper contentContainerStyle={styles.container}>
        {renderHeader()}
        <FlatList
          data={[]}
          renderItem={() => null}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ListFooterComponent={renderContent}
        />

        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 350 }}
            >
              <Text style={styles.modalTitle}>Add Health Record</Text>
              <TextInput
                label="Temperature (°C)"
                value={newRecord.temperature}
                onChangeText={text => setNewRecord({ ...newRecord, temperature: text })}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Weight (kg)"
                value={newRecord.weight}
                onChangeText={text => setNewRecord({ ...newRecord, weight: text })}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Heart Rate (bpm)"
                value={newRecord.heartRate}
                onChangeText={text => setNewRecord({ ...newRecord, heartRate: text })}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Respiratory Rate (breaths/min)"
                value={newRecord.respiratoryRate}
                onChangeText={text => setNewRecord({ ...newRecord, respiratoryRate: text })}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Medication"
                value={newRecord.medication}
                onChangeText={text => setNewRecord({ ...newRecord, medication: text })}
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Diet"
                value={newRecord.diet}
                onChangeText={text => setNewRecord({ ...newRecord, diet: text })}
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Notes"
                value={newRecord.notes}
                onChangeText={text => setNewRecord({ ...newRecord, notes: text })}
                multiline
                numberOfLines={4}
                style={styles.input}
                mode="outlined"
              />
              <Button mode="contained" onPress={handleAddRecord} style={styles.submitButton}>
                Submit
              </Button>
            </MotiView>
          </Modal>

          <Modal
            visible={!!selectedImage}
            onDismiss={() => setSelectedImage(null)}
            contentContainerStyle={styles.imageModalContainer}
          >
            {selectedImage && (
              <View style={styles.imageModalContent}>
                <View style={styles.imageModalHeader}>
                  <Avatar.Image
                    size={40}
                    source={{ uri: selectedImage.uploadedBy.avatar }}
                  />
                  <Text style={styles.imageModalUsername}>{selectedImage.uploadedBy.name}</Text>
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={() => setSelectedImage(null)}
                    style={styles.imageModalCloseButton}
                  />
                </View>
                <Image
                  source={{ uri: selectedImage.imageUri }}
                  style={styles.imageModalImage}
                />
                <View style={styles.imageModalActions}>
                  <TouchableOpacity onPress={() => handleToggleLike(selectedImage.id)}>
                    <MaterialCommunityIcons
                      name={selectedImage.likes.includes(authData?.id || '') ? "paw" : "paw-outline"}
                      size={24}
                      color={selectedImage.likes.includes(authData?.id || '') ? "#FF6B6B" : "#000"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.imageModalLikesCount}>
                    {selectedImage.likes.length} {selectedImage.likes.length === 1 ? 'like' : 'likes'}
                  </Text>
                </View>
                <Text style={styles.imageModalCaption}>{selectedImage.caption}</Text>
                <FlatList
                  data={selectedImage.comments}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                      <Text style={styles.commentUsername}>{item.username}</Text>
                      <Text style={styles.commentText}>{item.text}</Text>
                    </View>
                  )}
                  style={styles.commentsList}
                />
                <View style={styles.commentInput}>
                  <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                    style={styles.commentTextInput}
                  />
                  <Button onPress={handleAddComment} disabled={!newComment.trim()}>
                    Post
                  </Button>
                </View>
              </View>
            )}
          </Modal>
        </Portal>

        <FAB
          icon={activeTab === 'gallery' ? 'image-plus' : 'plus'}
          style={styles.fab}
          onPress={activeTab === 'gallery' ? handleAddImage : () => setIsModalVisible(true)}
        />
      </ScreenWrapper>
    );
  };

  interface GalleryItem {
    id: string;
    imageUri: string;
    caption: string;
    date: string;
    uploadedBy: {
      id: string;
      name: string;
      avatar: string;
    };
    likes: string[];
    comments: {
      id: string;
      userId: string;
      username: string;
      text: string;
      timestamp: string;
    }[];
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return { backgroundColor: '#4CAF50' };
      case 'sick':
        return { backgroundColor: '#f44336' };
      case 'under treatment':
        return { backgroundColor: '#FF9800' };
      default:
        return { backgroundColor: '#9E9E9E' };
    }
  };

  const styles = StyleSheet.create({
    imageContainer: {
      width: '100%',
      height: 300,
      backgroundColor: '#f5f5f5',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      color: '#666',
      textAlign: 'center',
    },
    container: {
      flexGrow: 1,
      paddingBottom: 100,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: '#fff',
      zIndex: 1000,
      elevation: 4,
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    detailsContainer: {
      padding: 16,
      marginTop: -20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: '#fff',
    },
    infoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    species: {
      fontSize: 18,
      color: '#666',
      marginBottom: 4,
    },
    age: {
      fontSize: 16,
      color: '#666',
      marginBottom: 8,
    },
    statusChip: {
      marginBottom: 16,
    },
    statusText: {
      color: '#fff',
      fontWeight: '500',
      textAlign: 'center',
    },
    segmentedButtons: {
      marginBottom: 16,
    },
    chartCard: {
      marginBottom: 16,
    },
    recordCard: {
      marginBottom: 12,
      elevation: 2,
    },
    dateText: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
    },
    vitalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    vitalText: {
      fontSize: 14,
      color: '#666',
    },
    medicationText: {
      fontSize: 14,
      color: '#333',
      marginTop: 8,
    },
    dietText: {
      fontSize: 14,
      color: '#333',
      marginTop: 4,
    },
    notesText: {
      fontSize: 14,
      color: '#333',
      marginTop: 8,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      margin: 20,
      borderRadius: 12,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    input: {
      marginBottom: 16,
      backgroundColor: '#f5f5f5',
    },
    submitButton: {
      marginTop: 10,
      paddingVertical: 8,
      backgroundColor: '#26A69A',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    galleryRow: {
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    galleryItem: {
      width: '48%',
      marginBottom: 16,
      position: 'relative',
    },
    galleryImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
    },
    galleryOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    galleryStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    galleryStatsText: {
      color: '#fff',
      marginRight: 8,
    },
    imageModalContainer: {
      backgroundColor: 'white',
      margin: 0,
      justifyContent: 'flex-start',
      height: '100%',
    },
    imageModalContent: {
      flex: 1,
    },
    imageModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    imageModalUsername: {
      marginLeft: 12,
      fontWeight: 'bold',
      fontSize: 16,
    },
    imageModalCloseButton: {
      marginLeft: 'auto',
    },
    imageModalImage: {
      width: '100%',
      height: 300,
      resizeMode: 'cover',
    },
    imageModalActions: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    imageModalLikesCount: {
      marginLeft: 8,
      fontWeight: 'bold',
    },
    imageModalCaption: {
      padding: 16,
      paddingTop: 0,
    },
    commentsList: {
      maxHeight: 200,
    },
    commentItem: {
      flexDirection: 'row',
      padding: 8,
      paddingLeft: 16,
    },
    commentUsername: {
      fontWeight: 'bold',
      marginRight: 8,
    },
    commentText: {
      flex: 1,
    },
    commentInput: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    commentTextInput: {
      flex: 1,
      marginRight: 8,
      backgroundColor: '#f5f5f5',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  });

  export default AnimalDetailsScreen;