module.exports = {
    dbops:(res,response)=>{
        if(response==='duplicate')
        {
            res.status(403).send('User already exists')
        }
        else if(response==='success')
        {
            res.send('User provisioned successfully')
        }
        else if (response==='internal error')
        {
            res.status(503).send('Database Error')
        }

    }
}