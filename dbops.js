module.exports = {
    insertUser:async (db,user)=>{
        
        //validations
        if(user.email ==='' || user.password==='')
        {
            return 'invalid'
        }

        //check duplicates
        const existingEmails = await db.collection('users').find({email:user.email}).count();
        const existingUsernames = await db.collection('users').find({username:user.username}).count();
        
        if(existingEmails || (user.username!=='' && existingUsernames))
        {
            return "duplicate"
        }
        else
        {
            try {
                const dbResponse = await db.collection('users').insertOne(user);
                return "success"
            }
            catch(err){
                return "internal error"
            }
        }
    }
}