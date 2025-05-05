import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.123.195:3000/api/hareketler'; // Backend API URL'i buna göre ayarla

const AciklamaScreen = () => {
  const [hareketler, setHareketler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHareketler = async () => {
      try {
        const no = await AsyncStorage.getItem('ogrenciNo');
        if (!no) {
          Alert.alert('Hata', 'Öğrenci numarası alınamadı');
          return;
        }
  
        const response = await axios.get(`${API_URL}?ogrenciNo=${no}`);
        setHareketler(response.data);
      } catch (error) {
        console.error('API Hatası:', error); // Hata mesajını loglayın
        Alert.alert('Hata', 'Hareketler alınamadı');
      } finally {
        setLoading(false);
      }
    };
  
    fetchHareketler();
  }, []);
  

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Tarih: {new Date(item.islemTarihi).toLocaleString()}</Text>
      <Text style={styles.text}>İşlem Türü: {item.islemTuru}</Text>
      <Text style={styles.text}>Tutar: ₺{item.tutar}</Text>
      <Text style={styles.text}>Bakiye: ₺{item.bakiye}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İşlem Geçmişi</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={hareketler}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Henüz işlem yapılmamış</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#444',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
});

export default AciklamaScreen;
