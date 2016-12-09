/* global new_block,formatDate, randStr, bag, $, clear_blocks, document, WebSocket, escapeHtml, window */
var ws = {};

// =================================================================================
// On Load
// =================================================================================
$(document).ready(function() {
    connect_to_server();
    console.log('in ready');

    //$('input[name="name"]').val('r' + randStr(6));

    // =================================================================================
    // jQuery UI Events
    // =================================================================================
    $('#sub').click(function() {

        $('#myModal').modal('hide');
        console.log('form data');
        var data = $('#propertyregisterfrom').serializeArray();
        var obj = {
            type: 'create',
            name: data[0].value,
            adhaar_no: data[1].value,
            survey_no: data[2].value,
            location: data[3].value,
            area: data[4].value,
            v: 1

        };
        console.log(obj.area + '*' + obj.name + '*' + obj.location + '*' + obj.adhaar_no + '*' + obj.survey_no);
        if (obj.area && obj.name && obj.location && obj.adhaar_no && obj.survey_no) {

            console.log('creating property, sending', obj);
            ws.send(JSON.stringify(obj));
            alert("Congrats! " + name + " Your property has been registered!");
        } else {
            alert("You haven't inserted all required data!");
        }
        return false;
    });


    $('#transfer').click(function() {
        var n = "deepali".trim().toLowerCase();
        var sn = "A1234";
        var nn = "sumantH".trim().toLowerCase();
        console.log('transferring property', sn);

        var obj = {
            type: 'transfer',
            survey_no: sn,
            name: n,
            new_name: nn,
            v: 1

        };
        console.log(obj.name + '*' + obj.survey_no + '*' + obj.new_name);
        if (obj.new_name && obj.name && obj.survey_no) {
            console.log('transferring, sending', obj);
            ws.send(JSON.stringify(obj));
        } else {
            alert("You haven't inserted all required data!");
        }
        return false;
    });

});



// =================================================================================
// Socket Stuff
// =================================================================================
function connect_to_server() {
    var connected = false;
    connect();

    function connect() {
        var wsUri = 'ws://' + document.location.hostname + ':' + document.location.port;
        console.log('Connectiong to websocket', wsUri);

        ws = new WebSocket(wsUri);
        ws.onopen = function(evt) { onOpen(evt); };
        ws.onclose = function(evt) { onClose(evt); };
        ws.onmessage = function(evt) { onMessage(evt); };
        //ws.onerror = function(evt) { onError(evt); };
    }

    function onOpen(evt) {
        console.log('WS CONNECTED');
        connected = true;
        //clear_blocks();
        $('#errorNotificationPanel').fadeOut();
        ws.send(JSON.stringify({ type: 'get', v: 1 }));
        ws.send(JSON.stringify({ type: 'chainstats', v: 1 }));
    }

    function onClose(evt) {
        console.log('WS DISCONNECTED', evt);
        connected = false;
        setTimeout(function() { connect(); }, 5000); //try again one more time, server restarts are quick
    }

    function onMessage(msg) {
        try {
            var msgObj = JSON.parse(msg.data);
            if (msgObj.property) {
                console.log('rec', msgObj.msg, msgObj);
            } else if (msgObj.msg === 'chainstats') {
                console.log('rec', msgObj.msg, ': ledger blockheight', msgObj.chainstats.height, 'block', msgObj.blockstats.height);
                var e = formatDate(msgObj.blockstats.transactions[0].timestamp.seconds * 1000, '%M/%d/%Y &nbsp;%I:%m%P');
                $('#blockdate').html('<span style="color:#fff">TIME</span>&nbsp;&nbsp;' + e + ' UTC');
                var temp = {
                    id: msgObj.blockstats.height,
                    blockstats: msgObj.blockstats
                };
                //new_block(temp);								//send to blockchain.js
            } else console.log('rec', msgObj.msg, msgObj);
        } catch (e) {
            console.log('ERROR', e);
        }
    }

    function onError(evt) {
        console.log('ERROR ', evt);
        if (!connected && bag.e == null) { //don't overwrite an error message
            $('#errorName').html('Warning');
            $('#errorNoticeText').html('Waiting on the node server to open up so we can talk to the blockchain. ');
            $('#errorNoticeText').append('This app is likely still starting up. ');
            $('#errorNoticeText').append('Check the server logs if this message does not go away in 1 minute. ');
            $('#errorNotificationPanel').fadeIn();
        }
    }
}