<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>futusign Screen</title>
</head>
<body>
  <div id="root"></div>
  <iframe
    id="futusign_youtube"
    style="visibility: hidden;"
    frameborder="0"
    src="https://www.youtube.com/embed/XIMLoLxmTDw?enablejsapi=1"
  ></iframe>
  <div id="futusign_cover" style="opacity: 0;"></div>
  <script>
    (function(){
      // SET WIDTH OF YOUTUBE
      var futusignYoutubeEl = document.getElementById('futusign_youtube');
      var width = window.outerWidth;
      var height = window.outerHeight
      if ((width / height) >= (16 / 9)) {
        futusignYoutubeEl.style.width = width.toString() + 'px';
        futusignYoutubeEl.style.height = (width * (9 / 16)).toString() + 'px';
      } else {
        futusignYoutubeEl.style.width = (height * (16 / 9)).toString() + 'px';
        futusignYoutubeEl.style.height = (height).toString() + 'px';
      }
      // SETUP YOUTUBE EMITTERS
      window.futusignYoutubeStateChange = {
        addEventListener: function(listener) {
          window.document.addEventListener('futusign_youtube_state_change', listener);
        },
        removeEventListener: function(listener) {
          window.document.removeEventListener('futusign_youtube_state_change', listener);
        }
      };
      window.futusignYoutubeError = {
        addEventListener: function(listener) {
          window.document.addEventListener('futusign_youtube_error', listener);
        },
        removeEventListener: function(listener) {
          window.document.removeEventListener('futusign_youtube_error', listener);
        }
      };
      // STARTUP YOUTUBE
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = function() {
        var player = new window.YT.Player('futusign_youtube', {
          playerVars: { 'controls': 0 },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError,
          }
        });
        function onPlayerReady() {
          window.futusignYoutubePlayer = player;
        }
        function onPlayerStateChange(event) {
          window.document.dispatchEvent(
            new CustomEvent(
              'futusign_youtube_state_change',
              { detail: event.data }
            )
          );
        }
        function onPlayerError(event) {
          window.document.dispatchEvent(
            new CustomEvent(
              'futusign_youtube_error',
              { detail: event.data }
            )
          );
        }
      }
    })();
  </script>
  <?php while (have_posts()) : the_post(); ?>
    <script>
      window.publicPath = '<?php echo trailingslashit( plugins_url( '', __FILE__ ) ); ?>';
      window.screenId = <?php echo get_the_ID(); ?>;
    </script>
  <?php endwhile; ?>
  <script src="<?php echo plugins_url( 'vendor.bundle.js?version=2017030801', __FILE__ ); ?>"></script>
  <script src="<?php echo plugins_url( 'main.bundle.js?version=2017030801', __FILE__ ); ?>"></script>
</body>
</html>
