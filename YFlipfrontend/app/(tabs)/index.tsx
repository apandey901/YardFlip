import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Function to handle image selection from the gallery or camera
  const handleImagePicker = () => {
    Alert.alert(
      'Upload or Capture Image',
      'Choose an option:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take a Photo', onPress: () => uploadImage('camera') },
        { text: 'Pick from Gallery', onPress: () => uploadImage('gallery') },
        { text: 'Remove Image', onPress: removeImage, style: 'destructive' },  // To remove image
      ],
      { cancelable: true }
    );
  };

  // Function to handle uploading from camera or gallery
  const uploadImage = async (mode: 'camera' | 'gallery') => {
    let result;

    if (mode === 'camera') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        alert('Camera permission is required!');
        return;
      }

      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],  // Ensure square aspect ratio
        quality: 1,  // Highest quality
      });
    } else {
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!galleryPermission.granted) {
        alert('Gallery permission is required!');
        return;
      }

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],  // Ensure square aspect ratio
        quality: 1,  // Highest quality
      });
    }

    // Check if the user didn't cancel the image selection and if there's an asset
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);  // Set the URI of the selected image
    }
  };

  // Function to remove the uploaded image
  const removeImage = () => {
    setSelectedImage(null);
    alert('Image removed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture or Upload Image</Text>

      {/* Show selected image or placeholder */}
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>No image uploaded</Text>
      )}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Upload / Capture Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
