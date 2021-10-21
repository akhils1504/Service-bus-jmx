const azure = require('azure');
const uuidv1 = require('uuid/v1');

//Handler to connect and send to service bus
exports.getToken = (req, res) => {

    const cardnumber = req.params.cardnum;
    console.log('cardnumber' + cardnumber);
    const RESPONSETOPIC = uuidv1();
    console.log('RESPONSETOPIC' + RESPONSETOPIC);
    //baiju
    //const connStr = process.env.CONNECTION_STRING || 'Endpoint=sb://cardservicebus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=1HNT3euOtRZyMBYn95iNU92DjbIhF4hvLFa/bf7U6JY=';
    //from Doug
     const connStr = process.env.CONNECTION_STRING || 'Endpoint=sb://retailpayments-bus-dev.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xs+ooW8ikWUwLhJRVo4ajl7RBlX+EKg3RecD33Sv21Y=';

    const serviceBusService = azure.createServiceBusService(connStr);
    //Create the Request Topic
    serviceBusService.createTopicIfNotExists('cardrequesttopic', function (error) {
        if (!error) {
            // Topic was created or exists
            console.log('topic created or exists.');
        }
    });
    //message format structure
    const message = {
        body: 'CPG-Token Request',
        customProperties: {
            messagenumber: cardnumber +' => ' + RESPONSETOPIC,
            responsetopic: RESPONSETOPIC
        }

    }
    //Send message to Request Topic

    serviceBusService.createTopicIfNotExists(message.customProperties.responsetopic, function (error) {
        if (!error) {
            // Topic was created or exists
            console.log('response topic created or exists.');
            // Create a Subscription
            serviceBusService.createSubscription(message.customProperties.responsetopic, 'AllMessages', function (error) {
                if (!error) {
                    console.log('createSubscription for response created -----.');
                }
            });
        
            console.log('===responsetopic====> ' + message.customProperties.responsetopic);
            // subscribe to response Topic just created above
    serviceBusService.sendTopicMessage('cardrequesttopic', message, function (error) {
        if (error) {
            console.log(error);
            res.send('Failed to send request to Topic');
        } else {
            //create a response Topic
           
                  //  const timeoutObj = setTimeout(() => {
                        serviceBusService.receiveSubscriptionMessage(message.customProperties.responsetopic, 'AllMessages', function (error, receivedMessage) {
                            if (!error) {
                                // response message Message received and deleted
                                console.log('Res : => ');
                                console.log(receivedMessage);
                                res.send('REST API request UUID => ' + RESPONSETOPIC + ' REST API response UUID from message => ' + receivedMessage.customProperties.messagenumber + '--'+receivedMessage.body);
                                serviceBusService.deleteTopic(message.customProperties.responsetopic, function (error) {
                                    if (error) {
                                        console.log(error);
                                    }else{
                                        console.log(message.customProperties.responsetopic + ' Deleted for the request' + receivedMessage.customProperties.messagenumber);
                                    }
                                });
                                // response message Messageends.........................

                            } else {

                                console.log(error);

                                res.send('REST API' + error);
                            }
                        });
                   // }, 1);

                    // subscribe to response   ends..
                }

            });


        }


    });





    console.log('end of Program..........................................................');

    console.log('invoked getToken ');

};
