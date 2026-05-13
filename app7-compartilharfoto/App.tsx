import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

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
  async function takePhoto() {
    if (cameraRef.current && isCameraReady) {
      await cameraRef.current.takePictureAsync().then(data => {
        setPhoto(data.uri);
      });
    }
  }

  // async function savePhoto() {
  //   if (photo && photo.length > 0) {
  //     await MediaLibrary.saveToLibraryAsync(photo).then(res =>{
  //       alert('Foto salva com sucesso!');
  //     })
  //     .catch(err => {
  //       alert('Erro ao salvar foto: ' + err.message);
  //     });
  //   }
  // }

async function compartilharFoto() {
  if (!photo) return;

  const disponivel = await Sharing.isAvailableAsync();

  if (!disponivel) {
    alert('Compartilhamento não disponível neste dispositivo');
    return;
  }

  try {
    await Sharing.shareAsync(photo, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Compartilhar foto',
    });
  } catch (error: any) {
    alert('Erro ao compartilhar: ' + error.message);
  }
}


  async function savePhoto() {
  if (!photo) return;

  // Solicita permissão
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    alert('Permissão negada para acessar a galeria');
    return;
  }

  try {
    await MediaLibrary.saveToLibraryAsync(photo);

    alert('Foto salva com sucesso!');
  } catch (err: any) {
    alert('Erro ao salvar foto: ' + err.message);
  }
}

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
          <Text style={styles.text}>
            <Ionicons name="camera-reverse-outline" size={32} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text} disabled={!isCameraReady}>
            <Ionicons name="camera-outline" size={32} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={savePhoto}>
          <Text style={styles.text} disabled={!isCameraReady}>
              <Ionicons name="save-outline" size={32} color="white" />
          </Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={compartilharFoto}>
          <Text style={styles.text} disabled={!isCameraReady}>
              <Ionicons name="share-outline" size={32} color="white" />
          </Text>
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
