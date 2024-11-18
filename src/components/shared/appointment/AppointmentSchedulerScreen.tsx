  import React, { useMemo, useState, useCallback, useEffect } from 'react';
  import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
  import { Calendar, DateData } from 'react-native-calendars';
  import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
  import { 
    Button, 
    Card, 
    Title, 
    Paragraph, 
    Modal, 
    Portal, 
    TextInput, 
    List, 
    Chip, 
    useTheme,
    Divider,
    Avatar,
    SegmentedButtons,
    IconButton,
    Surface
  } from 'react-native-paper';
  import Animated, { 
    FadeIn,
    FadeOut,
    Layout,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
  } from 'react-native-reanimated';
  import { LinearGradient } from 'expo-linear-gradient';
  import { useAuth } from '../../../context/AuthContext';
  import { appointments, members, users } from '../../../data/mockData';
  import { Appointment, Animal, User, Member } from '../../../data/models';
  import ScreenWrapper from '../screen-wrapper/ScreenWrapper';

  const { width } = Dimensions.get('window');

  type AppointmentStatus = 'Confirmed' | 'Requested' | 'Completed';

  interface NewAppointment {
    id: string;
    animalId: string;
    date: string;
    time: string;
    status: AppointmentStatus;
    assignedTo: string;
    requestedBy?: string;
    procedure: string;
  }

  // Define the calendar marking types
  interface DotMarking {
    color: string;
    key: string;
  }

  interface CustomMarking {
    marked?: boolean;
    dots?: DotMarking[];
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
    customStyles?: {
      container?: {
        borderWidth?: number;
        borderColor?: string;
      };
    };
  }

  type MarkedDates = {
    [date: string]: CustomMarking;
  }

  interface AppointmentWithAnimals extends Appointment {
    animals: Animal[];
  }

  const AppointmentSchedulerScreen: React.FC = () => {
    const { authData } = useAuth();
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [scheduleViewModalVisible, setScheduleViewModalVisible] = useState(false); // New state
    const [appointmentDetailsModal, setAppointmentDetailsModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithAnimals | null>(null);
    const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);
    const [procedure, setProcedure] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState<AppointmentWithAnimals[]>([]);
    const [appointmentsForSelectedDate, setAppointmentsForSelectedDate] = useState<AppointmentWithAnimals[]>([]); // Appointments for a date
    const [selectedVet, setSelectedVet] = useState<User | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'avian' | 'mammal' | 'reptile' | null>(null);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [appointmentTime, setAppointmentTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    

    const isAssistVet = authData?.role === 'assistantVet';

  // Reset form function
  const resetForm = useCallback(() => {
    setSelectedAnimals([]);
    setAppointmentTime(new Date());
    setProcedure('');
    setSelectedVet(null);
    setSelectedCategory(null);
    setSelectedMember(null);
  }, []);


    // Animation values
    const cardScale = useSharedValue(1);
    const modalScale = useSharedValue(0.9);
    const modalOpacity = useSharedValue(0);

    // Animation styles
    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(cardScale.value) }]
    }));

    const modalAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: modalScale.value }],
      opacity: modalOpacity.value
    }));

    const handleTimeChange = useCallback((event: DateTimePickerEvent, selectedTime?: Date) => {
      setShowTimePicker(false);
      if (event.type === 'set' && selectedTime) {
        setAppointmentTime(selectedTime);
      }
    }, []);

    const toggleAnimalSelection = (animal: Animal) => {
      if (selectedAnimals.find((a) => a.id === animal.id)) {
        setSelectedAnimals(selectedAnimals.filter((a) => a.id !== animal.id));
      } else {
        setSelectedAnimals([...selectedAnimals, animal]);
      }
    };
    
    const handleAppointmentPress = useCallback(
      (appointment: AppointmentWithAnimals) => {
        setSelectedAppointment(appointment);
        setAppointmentDetailsModal(true);
      },
      []
    );
    
    const handleCreateAppointment = useCallback(() => {
      if (!selectedAnimals.length) {
        alert('Please select at least one animal.');
        return;
      }

      if (!selectedDate) {
        alert('Please select a date.');
        return;
      }

      if (isAssistVet && !selectedVet) {
        alert('Please select a HeadVet to assign this appointment.');
        return;
      }

      const formattedTime = appointmentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const newAppointment: AppointmentWithAnimals = {
        id: String(Date.now()),
        animalId: selectedAnimals.map((animal) => animal.id).join(','),
        date: selectedDate,
        time: formattedTime,
        status: isAssistVet ? 'Requested' : 'Confirmed', // assistVet => 'Requested', headVet => 'Confirmed'
        assignedTo: isAssistVet ? selectedVet?.id || '' : authData?.id || '', // assign to HeadVet or self
        requestedBy: authData?.id,
        procedure,
        animals: selectedAnimals,
      };

      setFilteredAppointments((prev) => [...prev, newAppointment]);
      setModalVisible(false);
      resetForm();
    }, [selectedAnimals, selectedDate, selectedVet, appointmentTime, procedure, authData, isAssistVet]);

    
    

  // Handle Appointment Actions (Approve, Reject, Cancel)
  const handleAppointmentAction = useCallback(
    (appointment: AppointmentWithAnimals, action: 'approve' | 'reject' | 'cancel') => {
      if (isAssistVet) return; // Restrict actions for assistVet

      if (action === 'approve') {
        setFilteredAppointments((prev) =>
          prev.map((app) =>
            app.id === appointment.id
              ? { ...appointment, status: 'Confirmed', assignedTo: authData?.id || '' }
              : app
          )
        );
      } else if (action === 'reject' || action === 'cancel') {
        setFilteredAppointments((prev) => prev.filter((app) => app.id !== appointment.id));
      }
    },
    [filteredAppointments, authData, isAssistVet]
  );
    
    
    const caretakerRequests = useMemo(() => {
      const requests = filteredAppointments.filter(
        (appointment) =>
          appointment.status === 'Requested' &&
          !appointment.date &&
          !appointment.time &&
          !appointment.assignedTo
      );
      console.log('Caretaker Requests:', requests);
      return requests;
    }, [filteredAppointments]);
    

    const handleConfirmAppointment = useCallback(() => {
      // Extract only the date part to avoid time zone issues
      const selectedDateISO = appointmentDate.toISOString().split('T')[0];
      const selectedTimeFormatted = appointmentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    
      // Check for conflicts
      const isConflict = filteredAppointments.some(
        (appointment) =>
          appointment.date === selectedDateISO &&
          appointment.time === selectedTimeFormatted
      );
    
      if (isConflict) {
        alert('The selected date and time are already booked. Please choose another.');
        return;
      }
    
      const updatedAppointment: AppointmentWithAnimals = {
        ...selectedAppointment!,
        date: selectedDateISO, // Ensure consistent date format
        time: selectedTimeFormatted,
        status: 'Confirmed',
        assignedTo: authData?.id || '', // Assign to the logged-in user
      };
    
      setFilteredAppointments((prev) =>
        prev.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
      );
    
      setConfirmationModalVisible(false);
      setAppointmentDetailsModal(false);
    
      // Reset defaults
      setAppointmentDate(new Date());
      setAppointmentTime(new Date());
    }, [appointmentDate, appointmentTime, filteredAppointments, selectedAppointment, authData]);
    
    
    const handleDayPress = useCallback(
      (day: DateData) => {
        const date = day.dateString; // Already in `YYYY-MM-DD` format
        setSelectedDate(date);

        // Get all appointments for the selected date
        const appointmentsForDate = filteredAppointments.filter(
          (appointment) => appointment.date === date
        );

        if (appointmentsForDate.length > 0) {
          setAppointmentsForSelectedDate(appointmentsForDate); // Set filtered appointments
          setScheduleViewModalVisible(true); // Open schedule view modal
        } else {
          resetForm();
          setModalVisible(true); // Open the create appointment modal if no appointments exist
        }
      },
      [filteredAppointments, resetForm]
    );

    
    
    const getMarkedDates = useCallback((): MarkedDates => {
      const marked: MarkedDates = {};
    
      filteredAppointments.forEach((appointment) => {
        const isSelected = selectedDate === appointment.date;
        marked[appointment.date] = {
          marked: true,
          dots: [
            {
              color: appointment.status === 'Confirmed' ? '#4CAF50' : '#FFA726',
              key: appointment.id,
            },
          ],
          selected: isSelected,
          selectedColor: '#E8F5E9',
          selectedTextColor: '#4CAF50',
        };
      });
    
      // Mark the currently selected date if it has no appointments
      if (selectedDate && !marked[selectedDate]) {
        marked[selectedDate] = {
          selected: true,
          selectedColor: '#E8F5E9',
          selectedTextColor: '#4CAF50',
        };
      }
    
      return marked;
    }, [filteredAppointments, selectedDate]);
    
    
    useEffect(() => {
      if (authData) {
        const userAppointments = appointments.map((app) => ({
          ...app,
          animals: members
            .flatMap((member) => member.animals)
            .filter((animal) => app.animalId.split(',').includes(animal.id)),
        }));
    
        setFilteredAppointments(userAppointments as AppointmentWithAnimals[]);
      }
    }, [authData]);
    
    
    
    
    return (
      <ScreenWrapper>
      <Animated.View style={styles.container} layout={Layout.springify()}>
      <Calendar
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            theme={{
              todayTextColor: '#4CAF50',
              selectedDayBackgroundColor: '#4CAF50',
              selectedDayTextColor: '#FFFFFF',
              dotColor: '#4CAF50',
              selectedDotColor: '#FFFFFF',
              arrowColor: '#4CAF50',
              monthTextColor: '#4CAF50',
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '400',
              textMonthFontWeight: '700',
              textDayHeaderFontWeight: '600',
            }}
            markingType="multi-dot"
            enableSwipeMonths
          />


  <ScrollView style={styles.appointmentList}>
            <Title style={styles.title}>Appointments</Title>
            {filteredAppointments.map((appointment, index) => (
              <Animated.View
                key={`${appointment.id}-${index}`}
                entering={FadeIn.delay(index * 100)}
                exiting={FadeOut}
                layout={Layout.springify()}
              >
                <TouchableOpacity onPress={() => handleAppointmentPress(appointment)}>
                  <Surface style={styles.appointmentCard}>
                    <View style={styles.cardContent}>
                      <View style={styles.headerRow}>
                        <Title>{appointment.procedure}</Title>
                      </View>
                      <Chip mode="outlined" style={styles.statusChip}>
                        {appointment.status}
                      </Chip>
                      <Paragraph>{`Date: ${appointment.date || 'Pending'}`}</Paragraph>
                      <Paragraph>{`Time: ${appointment.time || 'Pending'}`}</Paragraph>
                      <Paragraph>{`Assigned to: ${
                        users.find((u) => u.id === appointment.assignedTo)?.name || 'Unassigned'
                      }`}</Paragraph>
                      <Paragraph>{`Animals: ${appointment.animals
                        .map((animal) => animal.name)
                        .join(', ')}`}</Paragraph>
                    </View>
                  </Surface>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>


      {/* Schedule View Modal */}
  <Portal>
    <Modal
      visible={scheduleViewModalVisible}
      onDismiss={() => setScheduleViewModalVisible(false)}
      contentContainerStyle={styles.modalContent}
    >
      <ScrollView>
        <Title style={styles.modalTitle}>Appointments for {selectedDate}</Title>
        {appointmentsForSelectedDate.length > 0 ? (
          appointmentsForSelectedDate.map((appointment, index) => (
            <Surface key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.cardContent}>
                <Title>{appointment.procedure}</Title>
                <Paragraph>{`Time: ${appointment.time}`}</Paragraph>
                <Paragraph>{`Vet: ${
                  users.find((u) => u.id === appointment.assignedTo)?.name || 'Unassigned'
                }`}</Paragraph>
                <Paragraph>{`Animals: ${appointment.animals
                  .map((animal) => animal.name)
                  .join(', ')}`}</Paragraph>
                <Chip
                  mode="outlined"
                  onPress={() => {
                    setSelectedAppointment(appointment); // Open details modal
                    setScheduleViewModalVisible(false); // Close the current modal
                    setAppointmentDetailsModal(true); // Open the details modal
                  }}
                >
                  View Details
                </Chip>
              </View>
            </Surface>
          ))
        ) : (
          <Paragraph>No appointments found for this date.</Paragraph>
        )}

        {/* Add Another Appointment Button */}
        <Button
          mode="contained"
          style={styles.addAppointmentButton}
          onPress={() => {
            setScheduleViewModalVisible(false); // Close the schedule view modal
            setModalVisible(true); // Open the create appointment modal
          }}
        >
          Add Another Appointment
        </Button>
      </ScrollView>
    </Modal>
  </Portal>




          {/* Create Appointment Modal */}
          <Portal>
    <Modal
      visible={modalVisible}
      onDismiss={() => setModalVisible(false)}
      contentContainerStyle={styles.modalContent}
    >
      <ScrollView>
        <Title>Create Appointment for {selectedDate}</Title>  
        
        {/* Category Selection */}
        <SegmentedButtons
          value={selectedCategory || ''}
          onValueChange={(value) => {
            setSelectedCategory(value as 'avian' | 'mammal' | 'reptile' | null);
            setSelectedMember(null);
            setSelectedAnimals([]);
          }}
          buttons={[
            { value: 'avian', label: 'Avian' },
            { value: 'mammal', label: 'Mammal' },
            { value: 'reptile', label: 'Reptile' },
          ]}
        />

        {selectedCategory && (
          <Animated.View entering={SlideInRight}>
            <Title style={styles.sectionTitle}>Select Species</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.speciesContainer}>
                {members
                  .filter((member) => member.category === selectedCategory)
                  .map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      onPress={() => setSelectedMember(member)}
                      style={[
                        styles.speciesCard,
                        selectedMember?.id === member.id && styles.selectedSpeciesCard,
                      ]}
                    >
                      <Image source={{ uri: member.imageUrl }} style={styles.speciesImage} />
                      <Title style={styles.speciesTitle}>{member.name}</Title>
                      <Paragraph>{`${member.totalHeads} animals`}</Paragraph>
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {selectedMember && (
          <Animated.View entering={SlideInRight}>
            <Title style={styles.sectionTitle}>Select Animals</Title>
            <View style={styles.animalGrid}>
              {selectedMember.animals.map((animal: Animal) => (
                <TouchableOpacity
                  key={animal.id}
                  onPress={() => toggleAnimalSelection(animal)}
                  style={[
                    styles.animalCard,
                    selectedAnimals.find((a) => a.id === animal.id) && styles.selectedAnimalCard,
                  ]}
                >
                  <Image source={{ uri: animal.imageUri }} style={styles.animalImage} />
                  <Title style={styles.animalName}>{animal.name}</Title>
                  <Chip mode="outlined" style={styles.statusChip}>
                    {animal.healthStatus}
                  </Chip>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

  {authData?.role === 'assistantVet' && (
    <Animated.View entering={SlideInRight}>
      <Title style={styles.sectionTitle}>Select HeadVet</Title>
      <View style={styles.vetGrid}>
        {users
          .filter((user) => user.role === 'headVet') // Show only HeadVets
          .map((headVet) => (
            <TouchableOpacity
              key={headVet.id}
              onPress={() => setSelectedVet(headVet)}
              style={[
                styles.vetCard,
                selectedVet?.id === headVet.id && styles.selectedVetCard,
              ]}
            >
              <Avatar.Image source={{ uri: headVet.profilePicture }} size={48} />
              <Paragraph style={styles.vetName}>{headVet.name}</Paragraph>
            </TouchableOpacity>
          ))}
      </View>
    </Animated.View>
  )}
        {/* Time Selection */}
        <TouchableOpacity 
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <View style={styles.timePickerContent}>
            <Paragraph>
              Selected Time: {appointmentTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </Paragraph>
            <IconButton icon="clock" size={24} />
          </View>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={appointmentTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setAppointmentTime(selectedTime);
            }}
          />
        )}

        {/* Procedure Input */}
        <TextInput
          label="Procedure"
          value={procedure}
          onChangeText={setProcedure}
          style={styles.input}
          mode="outlined"
        />

        {/* Create Appointment Button */}
        <Button
          mode="contained"
          onPress={() => {
            console.log('Create Appointment Button Pressed'); // Debugging log
            handleCreateAppointment();
          }}
          style={styles.submitButton}
        >
  {authData?.role === 'assistantVet' ? 'Request Appointment' : 'Create Appointment'}
  </Button>
      </ScrollView>
    </Modal>
  </Portal>

          {/* Appointment Details Modal */}
          <Portal>
          <Modal
              visible={appointmentDetailsModal}
              onDismiss={() => setAppointmentDetailsModal(false)}
              contentContainerStyle={styles.detailsModalContainer}
            >
      {selectedAppointment && (
        <ScrollView>
          <Title style={styles.modalTitle}>{selectedAppointment.procedure}</Title>
          <Divider style={styles.divider} />
          <List.Item
            title="Date & Time"
            description={`${selectedAppointment.date} at ${selectedAppointment.time}`}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="Status"
            description={selectedAppointment.status}
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Assigned Vet"
            description={
              users.find((user) => user.id === selectedAppointment.assignedTo)?.name || 'Unassigned'
            }
            left={(props) => <List.Icon {...props} icon="account" />}
          />

          {/* Display Selected Animal Images */}
  {/* Display Selected Animal Images */}
  <View style={styles.selectedAnimalContainer}>
    <Title style={styles.sectionTitle}>Selected Animals</Title>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {selectedAppointment?.animals.map((animal) => (
        <View key={animal.id} style={styles.selectedAnimalCard}>
          <Image source={{ uri: animal.imageUri }} style={styles.selectedAnimalImage} />
          <Paragraph style={styles.selectedAnimalName}>{animal.name}</Paragraph>
        </View>
      ))}
    </ScrollView>
  </View>


          {/* Action Buttons */}
          {authData?.role !== 'assistantVet' && selectedAppointment.status === 'Confirmed' && (
            <Button
              mode="contained"
              onPress={() => {
                handleAppointmentAction(selectedAppointment, 'cancel');
                setAppointmentDetailsModal(false);
              }}
              style={styles.cancelButton}
            >
              Cancel Appointment
            </Button>
          )}
{authData?.role !== 'assistantVet' && selectedAppointment.status === 'Requested' && (
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => {
                  handleAppointmentAction(selectedAppointment, 'approve');
                  setAppointmentDetailsModal(false);
                }}
                style={styles.approveButton}
              >
                Approve
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  handleAppointmentAction(selectedAppointment, 'reject');
                  setAppointmentDetailsModal(false);
                }}
                style={styles.rejectButton}
              >
                Reject
              </Button>
            </View>
          )}
        </ScrollView>
      )}
    </Modal>
  </Portal>



  <Portal>
    <Modal
      visible={confirmationModalVisible}
      onDismiss={() => setConfirmationModalVisible(false)}
      contentContainerStyle={styles.modalContent}
    >
      <Title style={styles.modalTitle}>Confirm Appointment</Title>
      <Paragraph>
        Please select a date and time for the appointment before confirming.
      </Paragraph>

      {/* Date Picker */}
      <TouchableOpacity
    style={styles.datePickerContainer}
    onPress={() => setShowDatePicker(true)}
  >
    <Paragraph>
      Selected Date: {appointmentDate.toISOString().split('T')[0]} {/* Use only the date part */}
    </Paragraph>
  </TouchableOpacity>
  {showDatePicker && (
    <DateTimePicker
      value={appointmentDate}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
          // Normalize the selected date to midnight UTC
          const normalizedDate = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          ));
          setAppointmentDate(normalizedDate);
        }
      }}
    />
  )}

      {/* Time Picker */}
      <TouchableOpacity
        style={styles.timePickerContainer}
        onPress={() => setShowTimePicker(true)}
      >
        <Paragraph>
          Selected Time: {appointmentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </Paragraph>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={appointmentTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setAppointmentTime(selectedTime);
          }}
        />
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          disabled={!appointmentDate || !appointmentTime}
          onPress={handleConfirmAppointment}
          style={styles.approveButton}
        >
          Confirm
        </Button>
        <Button
          mode="outlined"
          onPress={() => setConfirmationModalVisible(false)}
          style={styles.rejectButton}
        >
          Cancel
        </Button>
      </View>
    </Modal>
  </Portal>





        </Animated.View>
      </ScreenWrapper>
    );
  };

  const styles = StyleSheet.create({
    vetGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    vetCard: {
      width: '48%',
      marginBottom: 16,
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      alignItems: 'center',
    },
    selectedVetCard: {
      borderColor: '#4CAF50',
      backgroundColor: '#E8F5E9',
    },
    vetName: {
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    
    addAppointmentButton: {
      marginTop: 16,
      backgroundColor: '#4CAF50',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 12,
      maxHeight: '80%',
      marginHorizontal: 16,
    },
    modalTitle: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: 'center',
      color: '#1976D2',
    },
    appointmentCard: {
      marginBottom: 12,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      backgroundColor: '#ffffff',
    },
    cardContent: {
      padding: 8,
    },
    statusChip: {
      alignSelf: 'flex-start',
      marginVertical: 8,
    },
    datePickerContainer: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      padding: 16,
      marginVertical: 12,
    },
    timePickerContainer: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      padding: 16,
      marginVertical: 12,
    },  
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    caretakerChip: {
      backgroundColor: '#FFEB3B',
      marginLeft: 8,
    },
    
    caretakerContainer: {
      marginTop: 16,
      padding: 8,
      backgroundColor: '#F9F9F9',
      borderRadius: 12,
    },
    requestCard: {
      marginBottom: 12,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      backgroundColor: '#FFFFFF',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    approveButton: {
      backgroundColor: '#4CAF50',
      flex: 1,
      marginRight: 8,
    },
    rejectButton: {
      backgroundColor: '#f44336',
      flex: 1,
    },
    cancelButton: {
      backgroundColor: '#f44336',
      marginTop: 16,
    },
    whiteText: {
      color: '#FFFFFF',
    },  
    greenButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 24,
      marginTop: 16,
    },
    greenButtonContent: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },  
    selectedAnimalScroll: {
      marginTop: 16,
      marginBottom: 8,
      flexDirection: 'row',
    },
    smallAnimalCard: {
      alignItems: 'center',
      marginRight: 12,
    },
    smallAnimalImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: '#1976D2',
    },
    smallAnimalName: {
      fontSize: 12,
      textAlign: 'center',
      marginTop: 4,
    },
    animalCountText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#555',
      marginTop: 8,
    },
    
    detailsModalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 16,
      elevation: 10,
    },
    selectedAnimalContainer: {
      alignItems: 'center',
      marginVertical: 16,
    },
    selectedAnimalView: {
      alignItems: 'center',
    },
    selectedAnimalImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: '#1976D2',
    },
    selectedAnimalName: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    detailsModalTitle: {
      fontSize: 24,
      marginVertical: 16,
      color: '#1976D2',
    },
    
    timePickerButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      marginVertical: 12,
      overflow: 'hidden',
    },
    timePickerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    iOSPicker: {
      width: '100%',
      height: 200,
    },
    doneButton: {
      marginTop: 8,
      alignSelf: 'flex-end',
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F5F5F5',
    },
    appointmentList: {
      flex: 1,
      marginTop: 16,
    },
    input: {
      marginVertical: 12,
    },
    submitButton: {
      marginTop: 16,
    },
    divider: {
      marginVertical: 12,
    },
    actionButton: {
      marginVertical: 6,
    },
    calendarContainer: {
      marginBottom: 20,
    },
    calendarSurface: {
      elevation: 4,
      borderRadius: 16,
      backgroundColor: '#ffffff',
      overflow: 'hidden',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 16,
      color: '#1976D2',
    },
    cardGradient: {
      padding: 16,
    },
    appointmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    procedureTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
    },
    appointmentDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    detailIcon: {
      margin: 0,
      marginRight: 8,
    },
    detailText: {
      flex: 1,
      fontSize: 14,
    },
    detailsModalContent: {
      margin: 20,
      backgroundColor: 'transparent',
    },
    modalContainer: {
      backgroundColor: '#ffffff',
      padding: 24,
      borderRadius: 20,
      elevation: 5,
    },

    detailsCard: {
      borderRadius: 12,
      overflow: 'hidden',
      marginVertical: 16,
    },
    modalActions: {
      marginTop: 24,
    },
    closeButton: {
      borderRadius: 8,
    },

    sectionTitle: {
      fontSize: 18,
      marginTop: 16,
      marginBottom: 8,
    },

    dateText: {
      marginBottom: 16,
    },

    speciesContainer: {
      flexDirection: 'row',
      paddingVertical: 8,
    },
    speciesCard: {
      width: 150,
      marginRight: 16,
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      alignItems: 'center',
    },
    selectedSpeciesCard: {
      borderColor: '#4CAF50',
      backgroundColor: '#E8F5E9',
    },
    speciesImage: {
      width: 120,
      height: 120,
      borderRadius: 8,
    },
    speciesTitle: {
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    animalGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    animalCard: {
      width: '48%',
      marginBottom: 16,
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      alignItems: 'center',
    },
    selectedAnimalCard: {
      borderColor: '#4CAF50',
      backgroundColor: '#E8F5E9',
    },
    animalImage: {
      width: '100%',
      height: 120,
      borderRadius: 8,
    },
    animalName: {
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    vetContainer: {
      flexDirection: 'row',
      paddingVertical: 8,
    },
    createButton: {
      marginTop: 24,
      marginBottom: 16,
    },
  });

  export default AppointmentSchedulerScreen;