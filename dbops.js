module.exports = {
    insertUser:async (db,user)=>{

        //check duplicates
        let existingEmails = await db.collection('users').find({email:user.email}).count();
        let existingUsernames = await db.collection('users').find({username:user.username}).count();
        
        if(existingEmails ||(user.username!=='' && existingUsernames))
        {
            return "duplicate"
        }
        
        await db.collection('users').insertOne(user,(err,result)=>{
            if(!err)
            {
                return 'success'
            }
            else
            {
                return 'internal error'
            }
            
        })
    }
}