var App = {};

App.dialogic        = null;
App.wsUrl           = 'ws://192.168.1.109:1080';
App.userId          = window.location.hash.replace('#', '');
App.XMSAppName      = 'conf_demo';
App.connectionType  = 'video';

window.onload = function() {

    if (App.userId) {
        App.init();
    } else {
        alert('You must specify the user by using hash in the url: index.html#username');
    }
};

App.init = function() {
    var joinButton  = document.getElementById('join'),
        remoteVideo = document.getElementById('remoteVideo'),
        localVideo  = document.getElementById('localVideo');

    // Create API object instance
    App.dialogic = new Dialogic();

    joinButton.style.display = 'block';
    remoteVideo.style.display = 'none';

    // Biding join room event
    joinButton.addEventListener('click', function() {
        var call = App.dialogic.call(App.XMSAppName, App.connectionType);

        if (call === 'ok') {
            console.log('Call in progress');
        } else {
            console.log('Call failed');
        }

        this.style.display = 'none';
        localVideo.style.display = 'none';
        remoteVideo.style.display = 'block';
    });

    App.registerCurrentUser();
};

App.registerCurrentUser = function() {

    // Set Handlers
    App.dialogic.setHandlers({
        onRegisterOk        :   App.registerSuccess,
        onRegisterFail      :   App.registerFail,
        onRinging           :   App.callRingingHandler,
        onConnected         :   App.callConnectedHandler,
        onInCall            :   App.incomingCallHandler,
        onHangup            :   App.callHangupHandler,
        onDisconnect        :   App.disconnectHandler,
        onUserMediaOk       :   App.userMediaSuccessHandler,
        onUserMediaFail     :   App.userMediaFailHandler,
        onRemoteStreamOk    :   App.remoteStreamAddedHandler,
        onMessage           :   App.messageHandler,
        onInfo              :   App.infoHandler,
        onDeregister        :   App.deRegisterHandler
    });

    // Register user
    App.dialogic.register(App.userId, App.wsUrl, '');

    console.log('Logging in as ' + App.userId + ' to ' + App.wsUrl);
};

App.deRegisterHandler = function (reason) {
  console.log('deRegisterHandler user deregistered: ' + reason);
};

App.infoHandler = function (contentType, content) {
  console.log('user onInfo Handler. Got info contentType: ' + contentType + ' message: ' + content);
};

App.messageHandler = function (from, contentType, content) {
    console.log('user messageHandler. Got message from: ' + from + ' message: ' + content);
};

App.disconnectHandler = function() {
    console.log('user disconnected.');
};

App.registerSuccess = function() {

    App.dialogic.initialize({
        localVideo  : document.getElementById('localVideo'),
        remoteVideo : document.getElementById('remoteVideo')
    });

    App.dialogic.acquireLocalMedia({
        audio: true,
        video: true
    });
};

App.registerFail = function() {
    console.log('User not registered with XMS');
};

App.incomingCallHandler = function() {
    console.log('Call offered');
};

App.callHangupHandler = function() {
    console.log('Hangup');
};

App.userMediaSuccessHandler = function() {
    console.log('Browser mic/camera in use. Enter name to call and press Make Call');
};

App.userMediaFailHandler = function() {
    console.log('Browser Mic/Camera cannot be accessed');
};

App.callRingingHandler = function() {
    console.log('Remote side ringing');
};

App.callConnectedHandler = function() {
    console.log('Remote side connected');
};

App.remoteStreamAddedHandler = function() {
    console.log('Media connected');
};
