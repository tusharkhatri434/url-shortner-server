const Url = require("../models/Url");

//   createShortUrl,
//   getUserUrls,
//   deleteUrl,
//   updateUrl,
//   redirectToOriginalUrl


function generateShortCode(originalUrl){
    return Date.now().toString();
}

// @route   POST /api/urls
const createShortUrl = async (req,res)=>{
    const userId = req.user._id;
    const {originalUrl} = req.body;
     
    // - ! Develop a nique shortcode generate function-
    const shortCode = generateShortCode(originalUrl);
    const shortUrl = `${process.env.SHORT_URL_URI}/${shortCode}`;
     
    try{
        const url = await Url.create({userId,originalUrl,shortCode,shortUrl});
        if(url){
            const {_id,shortUrl,originalUrl,createdAt,clickCount,isActive} = url;
            res.status(201).json({
                _id,
                originalUrl,
                shortUrl,
                createdAt,
                clickCount,
                isActive
        });
        }
    }catch(error){
      res.status(500).json({ message: 'Server error', error: err.message });
    }

}


// @route POST /api/urls
const getUserUrls = async (req,res)=>{
    const userId = req.user._id;
    try {
        const urls = await Url.find({userId},{__v: 0 ,updatedAt:0,userId:0,shortCode:0}).sort({ createdAt: -1 }).lean();
        res.status(200).json({
            allUrls:urls
        })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// @route POST /api/urls/:id
const deleteUrl = async (req,res)=>{
    const userId = req.user._id;
    const _id = req.params.id;
    if(!_id){
       return res.status(400).json({
         msg:"Api parmas not found",
         success:false
       })
    }
    try {
        const deletedDoc = await Url.findOneAndDelete({_id,userId});

        
        if (!deletedDoc) {
          return res.status(404).json({ message: 'Document not found or unauthorized' });
        }

        if(deletedDoc){
            res.status(200).json({
                success:true,
                msg:"Successfully deleted",
                success:"true",
                data:deletedDoc
            });
        }

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: err.message });       
    }
}

// @route PUT /api/urls/:id
const updateUrl = async (req,res)=>{

    const {newUrl} = req.body;
    const _id = req.params.id;
    const userId = req.user._id;
    console.log(newUrl,_id,userId);
    try {
        const result = await Url.findById(_id);
        if(result.userId.toString()!==userId.toString()){
              return res.status(403).json({ message: 'Unauthorized to modify this document' });
        }
        result.originalUrl = newUrl;
        await result.save();

        return res.status(400).json({
            msg:"success fully updated",
            success:"true"
        })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: err.message });               
    }
}


// const redirectToOriginalUrl = async ()=>{}

module.exports = {
    createShortUrl,
    getUserUrls,
    deleteUrl,
    updateUrl,
}
