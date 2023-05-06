Twitch.ext.onAuthorized(function(auth) {
    return auth.viewer.opaqueId;
    // You can use the opaque identifier for further processing or API calls
});