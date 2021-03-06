require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { StreamChat } = require('stream-chat');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);



app.post('/add-channel', async (req, res) => {
    const { newchannelName, newchannelId, username } = req.body;
    console.log(req.body);    
    console.log(newchannelName +" "+ newchannelId + " " +username);
    
    // const token = serverSideClient.createToken(username);
    // try {
    //   await serverSideClient.updateUser(
    //     {
    //       id: username,
    //       name: username,
    //     },
    //     token
    //   );
    // } catch (err) {
    //   // console.log(err);
    // }
  
    const admin = { id: 'admin' };
    const channel = serverSideClient.channel('team', newchannelId, {
      name: newchannelName,
      created_by: admin,
    });
  
    try {
      await channel.create();
      await channel.addMembers([username, 'admin']);
    } catch (err) {
      console.log(err);
    }
  
    return res
      .status(200)
      .json({msg: "lol "})
    //   .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
  });
app.post('/join', async (req, res) => {
  const { username } = req.body;
  const token = serverSideClient.createToken(username);
  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username,
      },
      token
    );
  } catch (err) {
    // console.log(err);
  }

  const admin = { id: 'admin' };
  const channel = serverSideClient.channel('team', 'recentlydiagnosed', {
    name: 'Recently Diagnosed',
    created_by: admin,
  });

  try {
    await channel.create();
    await channel.addMembers([username, 'admin']);
  } catch (err) {
    console.log(err);
  }

  return res
    .status(200)
    .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
});

app.use(express.static(__dirname + '/build'));

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});


const server = app.listen(process.env.PORT || 3000, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});