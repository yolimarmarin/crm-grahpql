const User = require('../models/users')
const bcryptjs = require('bcryptjs')

// Resolvers
const resolvers = {
  Query: {
    getCourse: () => "HI"
  },
  Mutation: {
    newUser: async (_,{input}) => {
      const {email, password} = input;
      //check if user exists
      const userExist = await User.findOne({email});

      if(userExist){
        throw new Error('User already exists')
      }

      //hash password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password,salt)

      try{
        const user =  new User(input)
        user.save();
        return user
      }catch(error){
        console.log(error)
      }

    }
  }
};

module.exports = resolvers;