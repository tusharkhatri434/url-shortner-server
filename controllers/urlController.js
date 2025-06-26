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
            res.status(201).json({
                shortUrl,
                success:true
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
        const urls = await Url.find({userId});
        res.status(200).json({
            allUrls:urls
        })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// @route POST /api/urls/:id
const deleteUrl = async (req,res)=>{
    const _id = req.params.id;
    if(!_id){
       return res.status(400).json({
         msg:"Api parmas not found",
         success:false
       })
    }
    try {
        const result = await Url.findByIdAndDelete({_id});
        if(result){
            res.status(200).json({
                success:true,
                msg:"Successfully deleted",
                success:"true"
            });
        }

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: err.message });       
    }
}

// @route POST /api/urls/:id
const updateUrl = async (req,res)=>{

    const {newUrl} = req.body;
    const _id = req.params.id;

    try {
        const result = await Url.findById(_id);
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
