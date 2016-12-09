/* global new_block,formatDate, randStr, bag, $, clear_blocks, document, WebSocket, escapeHtml, window */
var ws = {};

let prevFiftyBlocks = []; //Previous 125 block times (when committed to blockchain)
let timeData = [];
let transData = [];
let storeBlock; //Latest block
let blockTime;
let chainHeight;
let blockNum; //Chain height/length
let sum = 0; //Sum of total time between blocks
let avg = 'N/A';
let startBlock;
let stdDev;
let minMax;
let timeDiff; //Time difference between two blocks
let scrollWidth;
let max;
let min;
let block1;
let prev;
let b;
let blk;
let payload;
let transSpans;
let data;
let date,date1;


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
<<<<<<< HEAD
			ws.send(JSON.stringify(obj));
		}
		else{
			alert("You haven't inserted all required data!");
		}
		return false;
	});
   
   
    $('#sno').keypress(function (e) {
    if (e.which == '13') {
       $("#ppp").find("div").remove();
  
        console.log('ANCHOR');
        var name= this.value;
         $.ajax({
        type: 'GET',
        dataType : 'json',
        contentType: 'application/json',
        crossDomain:true,
        url: 'https://208091445d164b3aacc4d76ee95c747a-vp0.us.blockchain.ibm.com:5002/chain',
        success: function(d) {
			console.log(d);
            chainHeight = d.height;
			console.log('Height'+chainHeight);
            blockNum = d.height - 1;
            console.log(blockNum);
        },
        error: function(e){
            console.log(e);
        },
        async: true
    });
	
	for(let i = 0; i < chainHeight; i++){
		
            if(blockNum - i > 0)
            {
                
				
                $.ajax({
                    type: 'GET',
                    dataType : 'json',
                    contentType: 'application/json',
                    crossDomain:true,
                    url: 'https://208091445d164b3aacc4d76ee95c747a-vp0.us.blockchain.ibm.com:5002/chain/blocks/'+(blockNum-i),
                    success: function(d) {
						
                        blk = d.transactions[0];
						
						if(typeof blk != 'undefined'){
						console.log(d);
						console.log('Sumanth'+blk);
						blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
						payload=blk.payload;
						payload=window.atob(payload);   
						data=payload.split("\n");
                        var n1=data[5].toLowerCase().trim();
                        var n2=name.toLowerCase().trim();
                        var n = n1.localeCompare(n2);
                        console.log(n1 +' data '+ n2 + ' compare '+ n);
                            if(n==0){
                                //var temp=data[2]+" "+data[3]+" "+data[4]+" "+data[5]+" "+data[6]+" "+data[7];
                                console.log('in if  '+data[3]);
                                //$("#ppp").append('<label style="color:red"><input type="checkbox" >'++'</label><br>')
                                $("#ppp").append('<div class="checkbox"><label><a  value="">'+data[3]+' '+data[4]+'</a></div>')
                                break;
                               // $("#abc").load(data[4])
                                //$("ul").add('<li class="list-group-item" style="display:block"><label><input type="checkbox" value=""   >'+data[3]+'-'+data[4]+'</label></li>');
                            }else{
                                
                                console.log('nt same ');
                            }
                        }
                    },
                    error: function(e){
                        console.log(e);
                    },
                    async: false
                });

                prevFiftyBlocks.push(blockTime);
				if(typeof blk != 'undefined'){
                transData.push(blk.length);
				}
				
                
				
                
				
            }
            else if(blockNum - i == 0) //If genesis block..
            {

                let blk;

                $.ajax({
                    type: 'GET',
                    dataType : 'json',
                    contentType: 'application/json',
                    crossDomain:true,
                    url: 'https://208091445d164b3aacc4d76ee95c747a-vp0.us.blockchain.ibm.com:5002/chain/blocks/'+(blockNum-i),
                    success: function(d) {
                        blk = d.transcations;
						blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
                    },
                    error: function(e){
                        console.log(e);
                    },
                    async: false
                });

               // $('#blockScroll').prepend('<div class="singleBlockContainer"><div class="exBlock notClicked" onclick="changeShape(this)"><span>'+(blockNum-i)+'</span></div><br /><div class="triangle_down_big"></div><div class="triangle_down"></div><div class="blockData"><span class="blockHash"><b>Block Hash: </b><br />'+lastBlockHash+'</span><br /><br /><span class="blockTimeAdded"><b>Added to Chain: </b><br />'+timeConverter(blockTime)+'</span><br /><br /><span class="blocksTransactionsHdr" >Transactions:</span><br /><span class="blocksTransactions">No transactions in the Genesis block.</span></div><input type="hidden" class="height" value="'+270+'"></input></div>');
            }
            else
            {
                break;
            }
        }
    }
	});

        
   	 $('#transfer').click(function(){
		console.log('transferring property');
   
		var obj = 	{
						/*type: 'create',
						name: $('input[name="owner"]').val().replace(' ', ''),
						adhaar_no: $('select[name="acnumber"]').val(),
						survey_no: $('select[name="surveyNo"]').val(),
						location: $('select[name="loc"]').val(),
						area: $('select[name="areaDet"]').val(),
                        
                        
                        */
                        
                        type: 'transfer',
						name: "deepali",
						survey_no: "sr-111",
						new_name: "Sumanth",
                        		v:1
                        
					};
                    console.log(obj.new_name+'*'+obj.name+'*'+obj.survey_no);
		if(obj.new_name && obj.name && obj.survey_no){
			
            console.log('transferring, sending', obj);
			ws.send(JSON.stringify(obj));
		}
		else{
			alert("You haven't inserted all required data!");
		}
		return false;
	});

    $("checkbox").click(function() {
        if(this.checked) {
            alert(this.value);
        }
    });
	
=======
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
            name: n,
            survey_no: sn,
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

>>>>>>> 2c8c981b20699f3edaebfbce2d0b8468fdbe2942
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