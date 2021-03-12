import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen= () => {
    const [hasCameraPermission, setPermission] = useState(null);
    const [photoBase64, setPhotoBase64] = useState('');
    const camera = useRef(null);

    useEffect(() => {
      askCameraPermission();
    }, []);
  
    const askCameraPermission = async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setPermission(status == 'granted');
    }
    const snap = async () => {
        if (camera) {
          const photo = await camera.current.takePictureAsync({ base64: true });
          setPhotoBase64(photo.base64);
        }
      };
      return (
        <View style={{ flex: 1 }}>
          {hasCameraPermission ?
            (
              <View style={{ flex: 1 }}>
                <Camera style={{ flex: 3 }} ref={camera} />
                <View>
                  <Button title="Take Photo" onPress={snap} />
                </View>
                <View>
                  
                
                      <Image style={{ height: '20%', width: '20%' }} source={{ uri: `data:image/gif;base64,${photoBase64}` }} />
                     
                  
                </View>
              </View>
            ) : (
              <Text>No access to camera</Text>
            )}
        </View>
      );
}

export default CameraScreen;