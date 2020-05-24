import { Component, OnInit } from '@angular/core';
import { StreamChat, ChannelData, Message, User } from 'stream-chat';
import axios from 'axios';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-ang';
  urlopen='url(\'';
  urlclose='\')';
  channel: ChannelData;
  selChannel: ChannelData;

  username = '';
  messages: Message[] = [];
  newMessage = '';
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;
  newChannelName;
  newChannelId;
  avatarColorArray=[];
  channelColorArray=[];

  ngOnInit(): void {
    this.selChannel=null;

    if(this.username)
      this.joinChat();
  }

  async joinChat() {
    const { username } = this;
    try {
      const response = await axios.post('http://167.99.155.7:3000/join', {
        username
      });
      const { token } = response.data;
      const apiKey = response.data.api_key;

      this.chatClient = new StreamChat(apiKey);

      this.currentUser = await this.chatClient.setUser(
        {
          id: username,
          name: username,
        },
        token
      );

      // const channel = this.chatClient.channel('team', 'demomudit2');
      // await channel.watch();
      // this.channel = channel;
            
      // this.messages = channel.state.messages;
      // this.channel.on('message.new', event => {
      //   this.messages = [...this.messages, event.message];
      // });

      const filter = {
        type: 'team',
        // members: { $in: [`${this.currentUser.me.id}`] },
      };
      const sort = { last_message_at: -1 };

      this.channelList = await this.chatClient.queryChannels(filter, sort, {
        watch: true,
        state: true,
      });
      console.log(this.channelList);

      this.setChannel(this.channelList[0].data.cid);

    } catch (err) {
        console.log(err);
        return;
    }
  }

  async setChannel(cid){
    console.log(cid);

    this.selChannel = this.channelList.find(x => x.cid == cid); 
    console.log(this.selChannel);
    
    await this.selChannel.watch();
    this.channel = this.selChannel;
    this.messages = this.selChannel.state.messages;
    
    console.log(this.messages);
    
    this.channel.on('message.new', event => {
      this.messages = [...this.messages, event.message];
    });
  }

  clog(str){
    console.log(str);    
  }

  async createChannel(){
    const newchannelName = (this.newChannelName);
    const newchannelId = (this.newChannelId);
    const username = this.username;

    console.log(newchannelName+" " + newchannelId + " " + username);
    
    const response = await axios.post('http://167.99.155.7:3000/add-channel', {
      newchannelName, newchannelId, username
    });
    console.log(response.data.msg);
    // this.ngOnInit();    
  } 

  getColor(userID){
    const colorObj = this.avatarColorArray.find(x => x.id == userID);
    if(colorObj){
      // console.log("found");
      return colorObj.color;
    } 
    else{
      const newColorObj = {
        id: userID,
        color: this.getRandomColor()
      }
      this.avatarColorArray.push(newColorObj);
      return newColorObj.color;
    }
  }
  getRandomColor(){
    const color = "hsl(" + 360 * Math.random() + ',' +
    (25 + 70 * Math.random()) + '%,' + 
    (85 + 10 * Math.random()) + '%)';

    this.avatarColorArray.forEach(element => {
      if(element.color == color){
        this.getRandomColor();
      }
    });
    return color;
      }

  // getRandomColor() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   this.avatarColorArray.forEach(element => {
  //     if(element.color == color){
  //       this.getRandomColor();
  //     }
  //   });
  //   return color;
  // }

  getColors() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  deleteChannel(){
    console.log("deleting");
    
    this.selChannel.delete();
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    try {
      await this.channel.sendMessage({
        text: this.newMessage,
      });
      this.newMessage = '';
    } catch (err) {
      console.log(err);
    }
  }
}
