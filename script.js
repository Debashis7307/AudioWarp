document.addEventListener('DOMContentLoaded', function() {
  // Sample songs data
  const songs = [
      {
          id: 1,
          title: "Sanson Ki Maala Pe",
          artist: "Nusrat Fateh Ali Khan",
          album: "सांसों की माला पे",
          duration: "0:34",
          cover: "1.jpg",
          audio: "1s.mp3",
          liked: false
      },
      {
          id: 2,
          title: "Leo",
          artist: "Leo Sayer",
          album: "A New One",
          duration: "0:44",
          cover: "2.jpg",
          audio: "2s.mp3",
          liked: true
      },
      {
          id: 3,
          title: "Finding Her",
          artist: "Kushagra, Bharath",
          album: "Finding Her",
          duration: "3:27",
          cover: "3.jpg",
          audio: "3s.mp3",
          liked: false
      },
      {
          id: 4,
          title: "O Rangrez",
          artist: "Javed Bashir and Shreya Ghoshal",
          album: "Bhaag Milkha Bhaag",
          duration: "6:25",
          cover: "4.jpg",
          audio: "4s.mp3",
          liked: false
      },
      {
          id: 5,
          title: "Perfect",
          artist: "Ed Sheeran",
          album: "Divide",
          duration: "4:23",
          cover: "5.jpg",
          audio: "5s.mp3",
          liked: true
      },
      {
          id: 6,
          title: "Co2",
          artist: " Prateek Kuhad ",
          album: "The Way That Lovers Do",
          duration: "2:43",
          cover: "6.jpg",
          audio: "6s.mp3",
          liked: false
      },
      {
          id: 7,
          title: "Sitar-Lofi",
          artist: "Rishab Rikhiram Sharma, Shankar-Ehsaan-Loy",
          album: "Sony Music Entertainment India Pvt. Ltd.",
          duration: "2:05",
          cover: "7.jpg",
          audio: "7s.mp3",
          liked: false
      },
      {
          id: 8,
          title: "Namo Namo",
          artist: "Amit Trivedi",
          album: "Kedarnath",
          duration: "5:46",
          cover: "8.jpg",
          audio: "8s.mp3",
          liked: true
      }
  ];

  // DOM elements
  const audioPlayer = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const likeBtn = document.getElementById('like-btn');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const volumeSlider = document.getElementById('volume-slider');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingArtist = document.getElementById('now-playing-artist');
  const nowPlayingImg = document.getElementById('now-playing-img');
  const songList = document.getElementById('song-list');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const repeatBtn = document.getElementById('repeat-btn');
  const shareBtn = document.getElementById('share-btn');

  // Player state
  let currentSongIndex = 0;
  let isPlaying = false;
  let isShuffled = false;
  let isRepeated = false;
  let originalSongsOrder = [...songs];
  let currentSongsList = [...songs];

  // Initialize player
  function initPlayer() {
      renderSongList();
      updatePlayerInfo();
      
      // Set volume
      audioPlayer.volume = volumeSlider.value / 100;
  }

  // Render song list
  function renderSongList() {
      songList.innerHTML = '';
      
      currentSongsList.forEach((song, index) => {
          const tr = document.createElement('tr');
          tr.setAttribute('data-id', song.id);
          if (index === currentSongIndex && isPlaying) {
              tr.classList.add('active');
          }
          
          tr.innerHTML = `
              <td>${index + 1}</td>
              <td>${song.title}</td>
              <td>${song.artist}</td>
              <td>${song.album}</td>
              <td>${song.duration}</td>
              <td>
                  <button class="btn btn-sm btn-link like-song-btn" data-id="${song.id}">
                      <i class="${song.liked ? 'fas' : 'far'} fa-heart"></i>
                  </button>
                  <button class="btn btn-sm btn-link share-song-btn" data-id="${song.id}">
                      <i class="fas fa-share-alt"></i>
                  </button>
              </td>
          `;
          
          tr.addEventListener('click', () => playSong(index));
          
          songList.appendChild(tr);
      });
      
      // Add event listeners to like buttons
      document.querySelectorAll('.like-song-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const songId = parseInt(btn.getAttribute('data-id'));
              toggleLike(songId);
          });
      });
  }

  // Play a song
  function playSong(index) {
      if (index < 0 || index >= currentSongsList.length) return;
      
      currentSongIndex = index;
      const song = currentSongsList[currentSongIndex];
      
      audioPlayer.src = song.audio;
      audioPlayer.play()
          .then(() => {
              isPlaying = true;
              updatePlayerInfo();
              updatePlayButton();
              highlightCurrentSong();
          })
          .catch(error => {
              console.error('Error playing song:', error);
          });
  }

  // Toggle play/pause
  function togglePlay() {
      if (audioPlayer.src) {
          if (isPlaying) {
              audioPlayer.pause();
          } else {
              audioPlayer.play();
          }
          isPlaying = !isPlaying;
          updatePlayButton();
          highlightCurrentSong();
      } else if (currentSongsList.length > 0) {
          playSong(0);
      }
  }

  // Update play button icon
  function updatePlayButton() {
      if (isPlaying) {
          playIcon.classList.remove('fa-play');
          playIcon.classList.add('fa-pause');
      } else {
          playIcon.classList.remove('fa-pause');
          playIcon.classList.add('fa-play');
      }
  }

  // Play next song
  function playNext() {
      if (isRepeated) {
          audioPlayer.currentTime = 0;
          audioPlayer.play();
          return;
      }
      
      if (currentSongIndex < currentSongsList.length - 1) {
          playSong(currentSongIndex + 1);
      } else {
          playSong(0);
      }
  }

  // Play previous song
  function playPrev() {
      if (audioPlayer.currentTime > 3) {
          audioPlayer.currentTime = 0;
          return;
      }
      
      if (currentSongIndex > 0) {
          playSong(currentSongIndex - 1);
      } else {
          playSong(currentSongsList.length - 1);
      }
  }

  // Update player info (title, artist, cover)
  function updatePlayerInfo() {
      if (currentSongsList.length === 0) return;
      
      const song = currentSongsList[currentSongIndex];
      nowPlayingTitle.textContent = song.title;
      nowPlayingArtist.textContent = song.artist;
      nowPlayingImg.src = song.cover;
      
      // Update like button
      const likeIcon = likeBtn.querySelector('i');
      likeIcon.className = song.liked ? 'fas fa-heart' : 'far fa-heart';
      likeBtn.classList.toggle('active', song.liked);
  }

  // Toggle like status for current song
  function toggleLike(songId) {
      const songIndex = currentSongsList.findIndex(s => s.id === songId);
      if (songIndex === -1) return;
      
      currentSongsList[songIndex].liked = !currentSongsList[songIndex].liked;
      
      // Update in original list
      const originalIndex = originalSongsOrder.findIndex(s => s.id === songId);
      if (originalIndex !== -1) {
          originalSongsOrder[originalIndex].liked = currentSongsList[songIndex].liked;
      }
      
      // Update UI
      updatePlayerInfo();
      renderSongList();
  }

  // Highlight current song in the list
  function highlightCurrentSong() {
      const rows = songList.querySelectorAll('tr');
      rows.forEach((row, index) => {
          if (index === currentSongIndex && isPlaying) {
              row.classList.add('active');
          } else {
              row.classList.remove('active');
          }
      });
  }

  // Update progress bar
  function updateProgress() {
      const { currentTime, duration } = audioPlayer;
      const progressPercent = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      
      // Update time display
      currentTimeEl.textContent = formatTime(currentTime);
      durationEl.textContent = formatTime(duration);
  }

  // Format time (seconds to MM:SS)
  function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Set progress when clicked on progress bar
  function setProgress(e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audioPlayer.duration;
      audioPlayer.currentTime = (clickX / width) * duration;
  }

  // Toggle shuffle
  function toggleShuffle() {
      isShuffled = !isShuffled;
      shuffleBtn.classList.toggle('active', isShuffled);
      
      if (isShuffled) {
          // Shuffle the playlist (except the currently playing song)
          const currentSong = currentSongsList[currentSongIndex];
          const otherSongs = currentSongsList.filter((_, i) => i !== currentSongIndex);
          
          // Fisher-Yates shuffle algorithm
          for (let i = otherSongs.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [otherSongs[i], otherSongs[j]] = [otherSongs[j], otherSongs[i]];
          }
          
          currentSongsList = [currentSong, ...otherSongs];
          currentSongIndex = 0;
      } else {
          // Restore original order
          currentSongsList = [...originalSongsOrder];
          currentSongIndex = currentSongsList.findIndex(song => song.id === currentSongsList[currentSongIndex].id);
      }
      
      renderSongList();
  }

  // Toggle repeat
  function toggleRepeat() {
      isRepeated = !isRepeated;
      repeatBtn.classList.toggle('active', isRepeated);
  }

  // Load playlist (simulated)
  function loadPlaylist(type) {
      // In a real app, this would fetch different playlists
      // For demo, we'll just show a message
      alert(`Loading ${type} playlist...`);
  }

  // Event listeners
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);
  likeBtn.addEventListener('click', () => toggleLike(currentSongsList[currentSongIndex].id));
  shareBtn.addEventListener('click', () => {
      const song = currentSongsList[currentSongIndex];
      alert(`Sharing "${song.title}" by ${song.artist}`);
  });
  
  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayer.addEventListener('ended', playNext);
  audioPlayer.addEventListener('loadedmetadata', updateProgress);
  
  document.querySelector('.progress').addEventListener('click', setProgress);
  
  volumeSlider.addEventListener('input', () => {
      audioPlayer.volume = volumeSlider.value / 100;
  });
  
  shuffleBtn.addEventListener('click', toggleShuffle);
  repeatBtn.addEventListener('click', toggleRepeat);

  // Initialize the player
  initPlayer();
});

