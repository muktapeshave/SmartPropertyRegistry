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

let ownerName;
let senderName;
let buyerName;


let allBlock=[];
let propBlocks=[];
let abCounter=0;
let pbCounter=0;
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
        console.log(data);
        var obj = {
            type: 'create',
            name: ownerName,
            adhaar_no: $("#acnumber").val(),
            survey_no: data[0].value,
            location: data[1].value,
            area: data[2].value,
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
        location.reload();
        return false;
    });
   
    $('#own').change(function (e) {
        //alert('hi');
       ownerName= this.options[ this.selectedIndex ].innerText;
    });
   
    $('#ow').change(function (e) {
    
        senderName=this.options[ this.selectedIndex ].innerText;
            console.log(senderName);
        
       $("#ppp").find("div").remove();
           var temp=""; 
        console.log('ANCHOR');
        var name= senderName;
         $.ajax({
                 
        
        type: 'GET',
        dataType : 'json',
        contentType: 'application/json',
        crossDomain:true,
        url: 'https://36c9afcef54f4bb3be0c76904961fa87-vp0.us.blockchain.ibm.com:5002/chain',
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
        async: false
    });
	
        for(let i = 0; i < chainHeight; i++){
		
            if(blockNum - i > 0)
            {
                
				
                $.ajax({
                    
                    beforeSend: function(){
                    $("#r1").css('display', 'none');
                    $("#ldr").css('display', 'block');
                    console.log('before send');
        
                    },
                   
                    complete: function(){
                        //$("#ppp").append(temp);
                             
                        
                                    $("#ldr").css('display', 'none');
                        $("#r1").css('display', 'block');
                    },
                    
                    
                    
                    
                    type: 'GET',
                    dataType : 'json',
                    contentType: 'application/json',
                    crossDomain:true,
                    url: 'https://36c9afcef54f4bb3be0c76904961fa87-vp0.us.blockchain.ibm.com:5002/chain/blocks/'+(blockNum-i),
                    success: function(d) {
						
                        blk = d.transactions[0];
						
						if(typeof blk != 'undefined'){
                            console.log(d);
                            console.log('Sumanth'+blk);
                            blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
                            payload=blk.payload;
                            payload=window.atob(payload);   
                            data=payload;
                            
                            allBlock[abCounter++]=data;   
                       
                        
                        }
                    },
                    error: function(e){
                        console.log(e);
                    },
                    async: true
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
                    url: 'https://36c9afcef54f4bb3be0c76904961fa87-vp0.us.blockchain.ibm.com:5002/chain/blocks/'+(blockNum-i),
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
        console.log('calling myFunction()');        
        myFunction();
        
   
      
    
	});
    
    $('#buyer').change(function (e) {
        buyerName=this.options[ this.selectedIndex ].innerText;
        if(buyerName!="Buyer Name")
            $("#transfer").prop('disabled', false);
    });

/* 
    $(":checkbox").change(function() {
        
        

    }); */
    $('#ppp').on('change', '.radio', function() {
    // do something
    
        if(!this.checked) {
                        console.log('oprion');
                        
                        $("#buyer").css('display', 'block');
        }else{
            alert('else');
        }
    });

    $('#transfer').click(function() {
        
        
        var sn = $('input[name=propertyr]:checked').val();
        console.log(sn);
        //console.log('transferring property '+sn+' from '+senderName+' to '+buyerName);
        
        var obj = {
            type: 'transfer',
            survey_no: sn,
            name: senderName,
            new_name: buyerName,
            v: 1

        };
        //console.log(obj.name + '*' + obj.survey_no + '*' + obj.new_name);
        if (obj.new_name && obj.name && obj.survey_no) {
           var r=confirm("Confirm to transfer property "+sn+" from "+senderName+" to "+buyerName);
            if(r==true){
                    console.log('transferring, sending', obj);
                    ws.send(JSON.stringify(obj));
                    alert("Property Transferred Sucessfully!!!")
            }
            
        } else {
            alert("You haven't inserted all required data!");
        }
        location.reload();
        return false;
    });

});


function myFunction() {
     // alert("HEllo"+allBlock.length);
     var noProp= true;
   
    var result=[];

    var k=0;
    for(var i=allBlock.length-1; i>=0;i--){
        var flag=0;
       var data1= allBlock[i].split("\n");
       var curname, sn;
       //console.log(data1[2]);
       if(data1[2].localeCompare("transfer")==0){
           console.log(data1[3]+' '+data1[5]);
           
           curname=data1[5];
           sn=data1[4];
           
           //alert("transfer"+ data1[2]);
         //  console.log(curname.toLowerCase().trim() +'--'+senderName.toLowerCase().trim());

           if(((curname.toLowerCase().trim()).localeCompare(senderName.toLowerCase().trim())==0)){
                    
               for(var j=0; j<i; j++){
                   //console.log((allBlock[j].toLowerCase()).includes(sn.toLowerCase()));
                   if(allBlock[j].indexOf(sn)!=-1){
                      // console.log("in indexOF");
                        flag=1;
                        break;
                   }
                   
                   if((allBlock[j].toLowerCase()).includes(sn.toLowerCase())){
                    //    alert("in transfer if");
                        
                        flag=1;
                        break;
                   }
               }
               if(flag==0){
                  // alert(data1[4]+'   in trnfewer '+data1[5]+' '+data1[4]);
                  noProp=false;
                 $("#ppp").append('<div class="radio"><label style="font-size:150%"><input name="propertyr" type="radio" value="'+data1[3]+'">'+data1[6]+' '+data1[4]+'</label></div>');  
               }
           }
       }else if(data1[2].localeCompare("register")==0){
           //console.log(" in register if"+data1[3]+' '+data1[5]+' '+senderName);     
              // alert("regi");
               curname=data1[3];
               sn=data1[5];
             /*   console.log(curname.localeCompare(senderName)==0);
               console.log("flag value:======== "+flag);
               console.log(curname.toLowerCase().trim() +'--'+senderName.toLowerCase().trim()); */
               
               if(((curname.toLowerCase().trim()).localeCompare(senderName.toLowerCase().trim())==0)){
                //console.log("localeCompare executed successfully returned 0");
               for(var j=0; j<i; j++){
                  // console.log("allBlock[j]"+allBlock[j]);
                   
                   if(allBlock[j].indexOf(sn)!=-1){
                       console.log("in indexOF");
                        flag=1;
                        break;
                   }
                   
                   
                   if(allBlock[j].includes(sn)){
                        console.log("flag   changes to 1 ");
                        flag=1;
                        break;
                   }
               }
               if(flag==0){
                   //alert(data1[5]+'">'+data1[3]+' '+data1[5]);
                   noProp=false;
                 $("#ppp").append('<div class="radio"><label style="font-size:150%"><input name="propertyr" type="radio" value="'+data1[5]+'">'+data1[3]+' '+data1[5]+'</label></div>');
               }
           }
           
       }
        
    }
    
    
   // alert("done");
     
                        //$("#ppp").append(temp);
           
        if(noProp){
            alert("No Properties registered on this user");
        }
     
}

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


