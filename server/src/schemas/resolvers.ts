import User, { UserDocument } from "../models/User.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

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

interface BookDocument {
  book: {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
  };
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
      const token = signToken(user.username, user.email, user._id); // ! PASSWORD ! //
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
      const token = signToken(user.username, user.email, user.password); // ! PASSWORD ! //
      return { token, user };
    },
    saveBook: async (
      _parent: any,
      { book }: BookDocument,
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        console.log(context);
        return await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
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
      { bookId }: { bookId: string },
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { books: bookId } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
