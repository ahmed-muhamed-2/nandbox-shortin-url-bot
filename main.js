"use strict";
const NandBox = require("nandbox-bot-api/src/NandBox");
const Nand = require("nandbox-bot-api/src/NandBoxClient");
const axios = require("axios");
const NandBoxClient = Nand.NandBoxClient;

const TOKEN = "90091792434069675:0:zLuBOvBQZFGIVQ7hAyxxVsq6cDPKMS";
const config = {
  URI: "wss://w1.nandbox.net:5020/nandbox/api/",
  DownloadServer: "https://w1.nandbox.net:5020/nandbox/download/",
  UploadServer: "https://w1.nandbox.net:5020/nandbox/upload/"
};

var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;

nCallBack.onConnect = _api => {
  // it will go here if the bot connected to the server successfully
  api = _api;
  console.log("Authenticated");
};

nCallBack.onReceive = incomingMsg => {
  console.log("Message Received");
  const regex = />(.*?)</g;

  if (incomingMsg.isTextMsg()) {
    let chatId = incomingMsg.chat.id; // get your chat Id
    let text = incomingMsg.text; // get your text message

    axios({
      method: "GET",
      url: "https://shorturl-sfy-cx.p.rapidapi.com/",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "shorturl-sfy-cx.p.rapidapi.com",
        "x-rapidapi-key": "97685f8527mshd8dfde93e266b21p17b71cjsn0e47c1b5fed7"
      },
      params: {
        url: text
      }
    })
      .then(response => {
        const finalUrl = response.data
          .match(regex)[0]
          .replace("<", "")
          .replace(">", "");
        api.sendText(chatId, finalUrl);
      })
      .catch(error => {
        const finalError = error.value
          .match(regex)[0]
          .replace("<", "")
          .replace(">", "");
        api.sendText(chatId, finalError);
      });
    // Sending message back as an Echo
  }
};

// implement other nandbox.Callback() as per your bot need
nCallBack.onReceiveObj = obj => console.log("received object: ", obj);
nCallBack.onClose = () => console.log("ONCLOSE");
nCallBack.onError = () => console.log("ONERROR");
nCallBack.onChatMenuCallBack = chatMenuCallback => {};
nCallBack.onInlineMessageCallback = inlineMsgCallback => {};
nCallBack.onMessagAckCallback = msgAck => {};
nCallBack.onUserJoinedBot = user => {};
nCallBack.onChatMember = chatMember => {};
nCallBack.onChatAdministrators = chatAdministrators => {};
nCallBack.userStartedBot = user => {};
nCallBack.onMyProfile = user => {};
nCallBack.onUserDetails = user => {};
nCallBack.userStoppedBot = user => {};
nCallBack.userLeftBot = user => {};
nCallBack.permanentUrl = permenantUrl => {};
nCallBack.onChatDetails = chat => {};
nCallBack.onInlineSearh = inlineSearch => {};

client.connect(TOKEN, nCallBack);
