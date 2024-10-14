import User, { UserDocument } from "../models/User";
import { signToken, AuthenticationError } from "../utils/auth";

interface UserArgs {
  userId: string;
}

interface CreateUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface SaveBookArgs {
  userId: string;
  book: string;
}

interface DeleteBookArgs {
  userId: string;
  book: string;
}

interface Context {
  user?: UserDocument;
}

const resolvers = {
  Query: {
    users: async (): Promise<UserDocument[] | null> => {
      return User.find({});
    },
    user: async (
      _parent: any,
      { userId }: UserArgs
    ): Promise<UserDocument | null> => {
      return await User.findOne({ _id: userId });
    },
    me: async (
      _parent: any,
      _args: any,
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    createUser: async (
      _parent: any,
      { input }: CreateUserArgs
    ): Promise<{ token: string; user: UserDocument }> => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; user: UserDocument }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw AuthenticationError;
      }
      const token = signToken(user.username, user.email, user.password);
      return { token, user };
    },
    saveBook: async (
      _parent: any,
      { userId, book }: SaveBookArgs,
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { books: book } },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    deleteBook: async (
      _parent: any,
      { userId, book }: DeleteBookArgs,
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { books: book } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
