var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var GoogleTTS = require('google-tts-api');
var App = {
    playin: false,
    DeviceIp: "",
    Player: null,
    GoogleHome: function (host, url, callback) {
        var client = new Client();
        client.connect(host, function () {
            client.launch(DefaultMediaReceiver, function (err, player) {
                var media = {
                    contentId: url,
                    contentType: 'audio/mp3',
                    streamType: 'BUFFERED'
                };
                App.Player = player;
                App.Player.load(media, { autoplay: true }, function (err, status) {
                    App.Player.on('status', function (status) {
                        if (status.playerState == "IDLE" && App.playin == false) {
                            App.Player.stop();
                            client.close();
                        }
                    });
                });
            });
        });
        client.on('error', function (err) {
            console.log('Error: %s', err.message);
            client.close();
            callback('error');
        });
    },
    run: function (ip, text) {
        App.DeviceIp = ip;
        var lang = "en";
        GoogleTTS(text, lang, 1).then(function (url) {
            App.GoogleHome(App.DeviceIp, url, function (res) {
                console.log(res);
            });
        });
    }
};

App.run("192.168.0.103", "Well, this is a pushed Notification to Google Home... Bye now!");