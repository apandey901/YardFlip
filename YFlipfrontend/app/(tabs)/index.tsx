import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Define the file path for saving user data
const fileUri = FileSystem.documentDirectory + 'users.json';

type User = {
  username: string;
  password: string;
};

export default function App() {
  return (
    <View style={styles.container}>
      <Index />
    </View>
  );
}

function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For sign-up form
  const [users, setUsers] = useState<User[]>([]); // Store user data

  // Load users from the file on component mount
  useEffect(() => {
    loadUsersFromFile();
  }, []);

  // Load users from the file
  const loadUsersFromFile = async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      setUsers(JSON.parse(fileContent)); // Parse and set users in state
    } catch (error) {
      console.log('Error loading users from file or file does not exist:', error);
    }
  };

  // Save users to the file
  const saveUsersToFile = async (newUsers: User[]) => {
    try {
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(newUsers));
    } catch (error) {
      console.error('Error saving users to file:', error);
    }
  };

  // Handle login logic
  const handleLogin = () => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      Alert.alert('Error', 'User not found. Please sign up.');
      setIsSignUp(true); // Switch to sign-up form
    } else if (user.password !== password) {
      Alert.alert('Error', 'Incorrect password');
    } else {
      Alert.alert('Login Successful', `Welcome back, ${username}!`);
      setModalVisible(false); // Close modal upon successful login
    }
  };

  // Handle sign-up logic
  const handleSignUp = () => {
    if (username === '' || password === '' || confirmPassword === '') {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const userExists = users.some((u) => u.username === username);
    if (userExists) {
      Alert.alert('Error', 'Username already exists');
      return;
    }

    const newUser: User = { username, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsersToFile(updatedUsers); // Save new user to file

    Alert.alert('Sign Up Successful', `Welcome, ${username}!`);
    setModalVisible(false); // Close modal after sign-up
    setIsSignUp(false); // Reset back to login mode
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

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
        aspect: [1, 1],
        quality: 1,
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
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri); // Set the image URI
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

        {/* Login button with profile icon */}
        <TouchableOpacity style={styles.iconButtonRight} onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/007/296/445/non_2x/login-head-sign-icon-design-monochrome-icon-people-icon-design-vector.jpg' }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>

        <Text style={styles.topText}>Welcome to YardFlip!</Text>
      </View>

      <View style={styles.curve} />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Capture or Upload Image</Text>

        {/* Show selected image or placeholder */}
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.imageBox} />
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

      {/* Modal for login and sign-up */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isSignUp ? (
              // Sign-Up Form
              <>
                <Text style={styles.modalTitle}>Sign Up</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.modalButton} onPress={handleSignUp}>
                  <Text style={styles.modalButtonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsSignUp(false)}>
                  <Text style={styles.modalButtonText}>Back to Login</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Login Form
              <>
                <Text style={styles.modalTitle}>Login</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
                  <Text style={styles.modalButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsSignUp(true)}>
                  <Text style={styles.modalButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: 50,  // Adjust width
    height: 50, // Adjust height
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 40, // Increase this number to make the ☰ symbol bigger
    color: 'black',
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
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#FF69B4',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
