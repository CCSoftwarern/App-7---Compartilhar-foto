import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  //Armazena o caminho onde a foto está temporariamente salva após a captura
  const [photo, setPhoto] = useState<string | null>(null);
  //Permite que se obtenha uma referência a câmera (CameraView)
  const cameraRef = useRef<CameraView>(null);

  if (!permission) { return <View />; }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Preciso da sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Permitir" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  //Permite tirar uma foto e armanzenar a referência em uma variável de estado
  function takePhoto() {

    //A partir do objeto camera ref deve ser chamado o método takePictureAsync: 
    //cameraRef.current.takePictureAsync...
    cameraRef.current?.takePictureAsync()
      .then(photo => {
        setPhoto(photo.uri);
        console.log('Foto tirada:', photo.uri);
      })
      .catch(error => {
        console.error('Erro ao tirar foto:', error);
      });

  }

  //função para compartilhar foto
  function sharePhoto() {
    

  const onCameraReady = () => {
    setIsCameraReady(true)
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} 
                  facing={facing} 
                  ref={cameraRef} 
                  onCameraReady={onCameraReady}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text} disabled={!isCameraReady}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
