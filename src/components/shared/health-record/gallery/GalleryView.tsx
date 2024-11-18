// import React, { useState } from 'react';
// import { View, Modal, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
// import { Text, TextInput, IconButton, Avatar, Button } from 'react-native-paper';
// import { MotiView } from 'moti';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// interface Comment {
//   id: string;
//   userId: string;
//   username: string;
//   text: string;
//   timestamp: string;
// }

// interface GalleryItem {
//   id: string;
//   imageUri: string;
//   caption: string;
//   date: string;
//   uploadedBy: {
//     id: string;
//     name: string;
//     avatar: string;
//   };
//   likes: string[];
//   comments: Comment[];
// }

// export const GalleryView = ({ gallery, authData, onAddComment, onToggleLike }) => {
//   const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
//   const [newComment, setNewComment] = useState('');
//   const [uploadModal, setUploadModal] = useState(false);
//   const [newUpload, setNewUpload] = useState({
//     imageUri: '',
//     caption: '',
//   });

//   const screenWidth = Dimensions.get('window').width;

//   const handleImagePress = (item: GalleryItem) => {
//     setSelectedImage(item);
//   };

//   const handleAddComment = () => {
//     if (selectedImage && newComment.trim()) {
//       onAddComment(selectedImage.id, {
//         id: Date.now().toString(),
//         userId: authData.id,
//         username: authData.name,
//         text: newComment,
//         timestamp: new Date().toISOString(),
//       });
//       setNewComment('');
//     }
//   };

//   const renderGalleryItem = ({ item }: { item: GalleryItem }) => (
//     <TouchableOpacity 
//       style={styles.galleryItem} 
//       onPress={() => handleImagePress(item)}
//     >
//       <Image source={{ uri: item.imageUri }} style={styles.galleryImage} />
//       <View style={styles.galleryOverlay}>
//         <View style={styles.galleryStats}>
//           <MaterialCommunityIcons name="paw" size={16} color="#fff" />
//           <Text style={styles.galleryStatsText}>{item.likes.length}</Text>
//           <MaterialCommunityIcons name="comment-outline" size={16} color="#fff" />
//           <Text style={styles.galleryStatsText}>{item.comments.length}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const ImageDetailModal = () => (
//     <Modal
//       visible={!!selectedImage}
//       onRequestClose={() => setSelectedImage(null)}
//       animationType="slide"
//     >
//       <View style={styles.modalContainer}>
//         {/* Header */}
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={() => setSelectedImage(null)}>
//             <MaterialCommunityIcons name="close" size={24} color="#000" />
//           </TouchableOpacity>
//         </View>

//         {selectedImage && (
//           <FlatList
//             data={[selectedImage]}
//             keyExtractor={item => item.id}
//             renderItem={({ item }) => (
//               <View>
//                 {/* User Info */}
//                 <View style={styles.userInfo}>
//                   <Avatar.Image 
//                     size={40} 
//                     source={{ uri: item.uploadedBy.avatar }} 
//                   />
//                   <Text style={styles.username}>{item.uploadedBy.name}</Text>
//                 </View>

//                 {/* Image */}
//                 <Image
//                   source={{ uri: item.imageUri }}
//                   style={styles.modalImage}
//                 />

//                 {/* Actions */}
//                 <View style={styles.actions}>
//                   <TouchableOpacity onPress={() => onToggleLike(item.id)}>
//                     <MaterialCommunityIcons
//                       name={item.likes.includes(authData.id) ? "paw" : "paw-outline"}
//                       size={24}
//                       color={item.likes.includes(authData.id) ? "#FF6B6B" : "#000"}
//                     />
//                   </TouchableOpacity>
//                   <Text style={styles.likesCount}>
//                     {item.likes.length} {item.likes.length === 1 ? 'like' : 'likes'}
//                   </Text>
//                 </View>

//                 {/* Caption */}
//                 <View style={styles.captionContainer}>
//                   <Text style={styles.captionUsername}>{item.uploadedBy.name}</Text>
//                   <Text style={styles.caption}>{item.caption}</Text>
//                 </View>

//                 {/* Comments */}
//                 <View style={styles.commentsContainer}>
//                   {item.comments.map(comment => (
//                     <View key={comment.id} style={styles.commentItem}>
//                       <Text style={styles.commentUsername}>{comment.username}</Text>
//                       <Text style={styles.commentText}>{comment.text}</Text>
//                     </View>
//                   ))}
//                 </View>

//                 {/* Comment Input */}
//                 <View style={styles.commentInput}>
//                   <TextInput
//                     value={newComment}
//                     onChangeText={setNewComment}
//                     placeholder="Add a comment..."
//                     style={styles.commentTextInput}
//                   />
//                   <Button
//                     onPress={handleAddComment}
//                     disabled={!newComment.trim()}
//                   >
//                     Post
//                   </Button>
//                 </View>
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={gallery}
//         renderItem={renderGalleryItem}
//         keyExtractor={item => item.id}
//         numColumns={2}
//         columnWrapperStyle={styles.galleryRow}
//       />
//       <ImageDetailModal />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   galleryRow: {
//     justifyContent: 'space-between',
//     padding: 8,
//   },
//   galleryItem: {
//     width: '48%',
//     marginBottom: 16,
//     position: 'relative',
//   },
//   galleryImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//   },
//   galleryOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 8,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   galleryStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   galleryStatsText: {
//     color: '#fff',
//     marginRight: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 12,
//   },
//   username: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   modalImage: {
//     width: '100%',
//     height: 400,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 8,
//   },
//   likesCount: {
//     fontWeight: 'bold',
//   },
//   captionContainer: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   captionUsername: {
//     fontWeight: 'bold',
//     marginRight: 8,
//   },
//   caption: {
//     color: '#333',
//   },
//   commentsContainer: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   commentItem: {
//     flexDirection: 'row',
//     marginBottom: 8,
//     flexWrap: 'wrap',
//   },
//   commentUsername: {
//     fontWeight: 'bold',
//     marginRight: 8,
//   },
//   commentText: {
//     color: '#333',
//     flex: 1,
//   },
//   commentInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   commentTextInput: {
//     flex: 1,
//     marginRight: 8,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//   },
// });