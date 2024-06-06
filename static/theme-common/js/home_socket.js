const socket = io.connect(socket_domain, {
    transports: ["websocket", "xhr-polling", "htmlfile", "jsonp-polling"],
    rejectUnauthorized: false,
    requestCert: false,
});

socket.emit("checkAuction", {"domain_id": site_id});

socket.on('checkAuction',function(data) {
   // console.log(data);
});