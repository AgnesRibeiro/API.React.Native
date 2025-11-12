import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Image,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';

type Movie = {
  id: string;
  title: string;
  image: string;
  director: string;
  release_date: string;
  rt_score: string;
  description: string;
};

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://ghibliapi.vercel.app/films');
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        const formattedMovies: Movie[] = data.map((film: any) => ({
          id: film.id || 'unknown',
          title: film.title || 'Título não disponível',
          image: film.movie_banner || film.image || 'https://via.placeholder.com/300x150/4a6572/ffffff?text=Studio+Ghibli',
          director: film.director || 'Diretor não informado',
          release_date: film.release_date || 'Ano não informado',
          rt_score: film.rt_score || '0',
          description: film.description || 'Descrição não disponível para este filme.'
        }));
        
        setMovies(formattedMovies.slice(0, 12));
      } catch (error) {
        console.error('Erro na API:', error);
        setError('Erro ao carregar os filmes do Studio Ghibli');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const openMovieDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeMovieDetails = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a6572" />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText}>Verifique sua conexão com internet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Studio Ghibli</Text>
        <Text style={styles.subtitle}>Catálogo de filmes</Text>
        
        {movies.map(movie => (
          <TouchableOpacity 
            key={movie.id} 
            style={styles.movieCard}
            onPress={() => openMovieDetails(movie)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: movie.image }}
              style={styles.banner}
              resizeMode="cover"
            />
            <View style={styles.movieContent}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              
              <View style={styles.movieDetails}>
                <Text style={styles.detailText}>🎬 {movie.director}</Text>
                <Text style={styles.detailText}>📅 {movie.release_date}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {movie.rt_score}/100</Text>
                </View>
              </View>
              
              <Text style={styles.description} numberOfLines={3}>
                {movie.description || 'Descrição não disponível.'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        
        <Text style={styles.footer}>
          {movies.length} filmes carregados da API
        </Text>
      </ScrollView>

      {/* Modal para detalhes do filme */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeMovieDetails}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMovie && (
              <>
                <Image
                  source={{ uri: selectedMovie.image }}
                  style={styles.modalBanner}
                  resizeMode="cover"
                />
                <ScrollView style={styles.modalScroll}>
                  <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                  
                  <View style={styles.modalDetails}>
                    <Text style={styles.modalDetailText}>🎬 Diretor: {selectedMovie.director}</Text>
                    <Text style={styles.modalDetailText}>📅 Lançamento: {selectedMovie.release_date}</Text>
                    <View style={styles.modalRatingContainer}>
                      <Text style={styles.modalRating}>⭐ Avaliação: {selectedMovie.rt_score}/100</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.modalDescription}>
                    {selectedMovie.description || 'Descrição não disponível.'}
                  </Text>
                </ScrollView>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeMovieDetails}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a6572',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  movieCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: 150,
  },
  movieContent: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a6572',
    marginBottom: 8,
  },
  movieDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    backgroundColor: '#4a6572',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4a6572',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalBanner: {
    width: '100%',
    height: 200,
  },
  modalScroll: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6572',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDetails: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalDetailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  modalRatingContainer: {
    backgroundColor: '#4a6572',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  modalRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  closeButton: {
    backgroundColor: '#4a6572',
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});