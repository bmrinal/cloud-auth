const logger = require('./utils/logger');
module.exports = {
    insertUser:async (db,user)=>{
        
        //validations
        if(user.email ==='' || user.password==='')
        {
            logger.db.error('Invalid/Blank email and/or password supplied')
            return 'invalid'
        }

        //check duplicates
        const existingEmails = await db.collection('users').find({email:user.email}).count();
        const existingUsernames = await db.collection('users').find({username:user.username}).count();
        
        if(existingEmails || (user.username!=='' && existingUsernames))
        {
            logger.db.error(`User already exists -  ${user.email}`);
            return "duplicate"
        }
        else
        {
            try {
                const dbResponse = await db.collection('users').insertOne(user);
                logger.db.info(`User successfully Provisioned -  ${user.email}`);
                return "success"
            }
            catch(err){
                logger.db.error(err);
                return "internal error";
            }
        }
    }
}