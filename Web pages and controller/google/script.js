const ws = new WebSocket('ws://ip_address');

ws.onopen = () => {
  console.log('WebSocket connection established');
};

ws.onmessage = (event) => {
  const video = event.data;

  if (['google'].includes(video)) {
    document.getElementById('home').style.display = 'none';
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = `videos/${video}.mp4`;

    videoPlayer.autoplay = true;

    document.getElementById('videoContainer').style.display = 'block';

    videoPlayer.onended = () => {
      document.getElementById('videoContainer').style.display = 'none';
      document.getElementById('thankYou').style.display = 'block';

      setTimeout(() => {
        document.getElementById('thankYou').style.display = 'none';
        document.getElementById('home').style.display = 'block';
      }, 2000); 
    };
  }
};