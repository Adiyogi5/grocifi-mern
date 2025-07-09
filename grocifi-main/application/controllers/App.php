<?php defined('BASEPATH') or exit('No direct script access allowed');

class App extends MY_Controller
{
    public function index()
    {
        
        $appLink = "https://play.google.com/store/apps/details?id=" . @$this->general_settings['androidurl'];

        echo "
        <html>
            <head>
                <title>App Link</title>
                <script>
                    let seconds = 3;
                    function updateCountdown() {
                        document.getElementById('countdown').innerText = seconds;
                        if (seconds <= 0) {
                            window.location.href = '$appLink';
                        } else {
                            seconds--;
                            setTimeout(updateCountdown, 1000);
                        }
                    }
                    window.onload = updateCountdown;
                </script>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                    }
                </style>
            </head>
            <body>
                <h2>Redirecting to the app in <span id='countdown'>3</span> seconds...</h2>
            </body>
        </html>";
        exit;
    }

}
