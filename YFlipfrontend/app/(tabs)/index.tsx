import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  return (
    <View style={styles.container}>
      <Index />
    </View>
  );
}

function Index() {
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
        { text: 'Remove Image', onPress: removeImage, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);  // Correctly set the URI of the selected image
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    alert('Image removed!');
  };

  return (
    <View style={styles.container}>
      {/* Top Colored Section */}
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.iconButtonLeft}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButtonRight}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconTextRight}>○</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.topText}>Welcome to YardFlip!</Text>
      </View>

      <View style={styles.curve} />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Capture or Upload Image</Text>

        {/* Show selected image or placeholder */}
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.imageBox} />  // Display the image here
        ) : (
          <Text style={styles.placeholder}>No image uploaded</Text>
        )}
      </View>

      {/* Bottom Bar with Rounded Top Corners */}
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
    backgroundColor: '#f9f9f9',
  },
  topSection: {
    height: 180,
    backgroundColor: '#FFC0CB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconButtonLeft: {
    position: 'absolute',
    left: 20,
    top: 40,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonRight: {
    position: 'absolute',
    right: 20,
    top: 40,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconTextRight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  curve: {
    height: 50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    marginTop: -50,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imageBox: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  buttonText: {
    color: '#FF69B4',
    fontSize: 18,
    fontWeight: 'bold',
  },
});