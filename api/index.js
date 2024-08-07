const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const Place = require('./models/Place');

const fs = require('fs')
const CookieParser = require('cookie-parser');

const jwtSecret  = 'faefdhrhtjfsfhd43563jtrtsbnvcbnrtadg'
//h30bnxmd2dnQTFD8
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
  

mongoose.connect(process.env.MONGO_UR)
const conn = mongoose.connection

conn.once('open' , () => {
  console.log('successfully database connected');
})


app.use(express.json());
app.use(CookieParser());
app.use('/uploads' , express.static(__dirname+'/uploads'));

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:5175',
  }));

// Handle CORS options requests
app.options('*', cors());

app.get('/' , (req,res) => {
   res.json('test ok');
});

app.post('/register' , async (req,res) => {
  const {name,email,password} = req.body;
  try{
  const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
  res.json( userDoc );
} catch(e) {
  res.status(422).json(e);
}
});

app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id,
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token ,{ httpOnly: true, sameSite: 'none' , secure:'true'}).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

 app.get('/profile',(req,res)=>{
  const {token} = req.cookies;
  if(token) {
    jwt.verify(token,jwtSecret,{}, async  (err,userData) => {
      if(err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  }
  else{
    res.json(null);
  }
 })

 app.post('/logout' , (req,res) => {
   res.cookie('token' , '',{ httpOnly: true, sameSite: 'none' , secure:'true'}).json(true);
 });

app.post('/upload-by-link' , async (req,res) =>{
  const {link} = req.body;
  let newName = 'photo' +  Date.now() + '.jpg';
  const imagePath = __dirname + '/uploads/' + newName;
  await imageDownloader.image({
    url: link,
    dest: imagePath, 
    
  });

  res.json(newName);
});
const photosMiddleware = multer({dest:'uploads/'})
app.post('/upload' , photosMiddleware.array('photos' , 100),(req,res) => {
  const uploadedFiles = [];
  for(let i = 0 ; i <  req.files.length; i++){
    const {path,originalname} = req.files[i];
     const parts = originalname.split('.');
     const ext = parts[parts.length - 1];
     const newPath = 'uploads/' + Date.now() + '-' + originalname;
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath.replace('uploads/' , ''));
  }
  res.json(uploadedFiles);

})

app.post('/places' , (req,res) =>{
  const {token} = req.cookies;
  const {title,address,addedPhotos,description,
    perks,extraInfo,
    checkIn,checkOut,maxGuests,price} = req.body;
    jwt.verify(token,jwtSecret,{}, async  (err,userData) => {
      if(err) throw err;
   const placeDoc = await Place.create({
    owner:userData.id,
    title,address,photos:addedPhotos,description,
            perks,extraInfo,
            checkIn,checkOut,maxGuests,price,
   })
   res.json(placeDoc);
});
});


app.get('/user-places' , (req,res) =>{
 const {token} = req.cookies;
 jwt.verify(token,jwtSecret,{}, async  (err,userData) => {
  const {id} = userData;
  res.json( await Place.find({owner:id}));
 });
});

app.get('/places/:id' , async (req,res) =>{
   const {id} = req.params;
   res.json(await Place.findById(id))
})

// app.put('/places',async(req,res) =>{
//   const {token} = req.cookies;
//   const { id, title,address,addedPhotos,description,
//     perks,extraInfo,
//     checkIn,checkOut,maxGuests} = req.body;
   
   

//     jwt.verify(token,jwtSecret,{}, async  (err,userData) => {
//       const placeDoc =  await Place.findById(id);
//       if(userData.id === placeDoc.owner.toString())
//       {
//         placeDoc.set({id,
//           title,address,addedPhotos,description,
//                   perks,extraInfo,
//                   checkIn,checkOut,maxGuests
//         });
//         placeDoc.save();
//       }

//     })
// });
app.put('/places', async (req,res) => {
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places' , async (req,res) =>{
  res.json(await Place.find());
})

app.post('/booking',(req,res) => {
  const {place,checkIn,checkOut,numberOfGuests,name,phone} = req.body;
})

app.get('/' , (req,res) => {
  res.json("hello console")
})
 //this is  listening on port
app.listen(3000 , () =>{
  console.log('successfully listening on port 3000');
});
