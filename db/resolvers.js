const User = require("../models/users");
const Product = require("../models/products");
const Client = require("../models/clients");
const Order = require("../models/orders");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const createToken = (user, secret, expiresIn) => {
  const { id, email, name, lastName } = user;
  return jwt.sign({ id, email, name, lastName }, secret, { expiresIn });
};

// Resolvers
const resolvers = {
  Query: {
    getUser: async (_, {}, ctx) => {
      return ctx.user;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProductById: async (_, { id }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Product does not exists");
      }
      return product;
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClientsBySalesman: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({ salesman: ctx.user.id.toString() });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClientById: async (_, { id }, ctx) => {
      const client = await Client.findById(id);
      if (!client) {
        throw Error("Client does not exist");
      } else if (client.salesman.toString() !== ctx.user.id) {
        throw Error("Salesman does not have access to this client");
      }

      return client;
    },
    getOrders: async () => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrdersBySalesman: async (_, {}, ctx) => {
      try {
        const orders = await Order.find({ salesman: ctx.user.id.toString() });
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrderById: async (_, { id }, ctx) => {
      const order = await Order.findById(id);
      if (!order) {
        throw Error("Order does not exist");
      } else if (order.salesman.toString() !== ctx.user.id) {
        throw Error("Salesman does not have access to this order");
      }
      return order;
    },
    getOrdersByState: async (_, { state }, ctx) => {
      const orders = await Order.find({
        salesman: ctx.user.id.toString(),
        state,
      });
      return orders;
    },
    getTopClients: async () => {
      const clients = await Order.aggregate([
        { $match: { state: "completed" } },
        {
          $group: {
            _id: "$client",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "_id",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $limit:3,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return clients;
    },
    getTopSalesmen: async () => {
      const salesmen = await Order.aggregate([
        { $match: { state: "completed" } },
        {
          $group: {
            _id: "$salesman",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "salesman",
          },
        },
        {
          $limit: 3,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return salesmen;
    },
    searchProductByName: async (_,{text})=>{
      const product = await  Product.find({$text: {$search: text}})
      return product
    }
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;
      //check if user exists
      const userExist = await User.findOne({ email });

      if (userExist) {
        throw new Error("User already exists");
      }

      //hash password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        const user = new User(input);
        const res = await user.save();
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input;
      //check if user exists
      const userExist = await User.findOne({ email });

      if (!userExist) {
        throw new Error("User does not exists");
      }

      const correctPassword = await bcryptjs.compare(
        password,
        userExist.password
      );

      if (!correctPassword) {
        throw new Error("Incorrect password");
      }

      return {
        token: createToken(userExist, process.env.SECRET, "24h"),
      };
    },

    newProduct: async (_, { input }) => {
      try {
        const product = new Product(input);
        const res = await product.save();
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    updateProductById: async (_, { id, input }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Product does not exists");
      }

      const updateProduct = await Product.findByIdAndUpdate(
        { _id: id },
        input,
        { new: true }
      );

      return updateProduct;
    },

    deleteProductById: async (_, { id }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Product does not exists");
      }

      await Product.findOneAndDelete({ _id: id });
      return "Product remove succesfully";
    },

    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      const client = await Client.findOne({ email });

      if (client) {
        throw Error("Client already exist");
      }

      const newClient = new Client(input);
      newClient.salesman = ctx.user.id;

      try {
        const res = await newClient.save();
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    updateClientById: async (_, { id, input }, ctx) => {
      const client = await Client.findById(id);
      if (!client) {
        throw new Error("Client does not exists");
      } else if (client.salesman.toString() !== ctx.user.id) {
        throw Error("Salesman does not have access to this client");
      }

      const updateClient = await Client.findByIdAndUpdate(id, input, {
        new: true,
      });

      return updateClient;
    },

    deleteClientById: async (_, { id }, ctx) => {
      const client = await Client.findById(id);
      if (!client) {
        throw new Error("Client does not exists");
      } else if (client.salesman.toString() !== ctx.user.id) {
        throw Error("Salesman does not have access to this client");
      }

      await Client.findOneAndDelete({ _id: id });
      return "Client removed succesfully";
    },

    newOrder: async (_, { input }, ctx) => {
      const { client } = input;
      //verify if client exist and belongs to the salesman
      const client_ = await Client.findById(client);
      if (!client_) {
        throw Error("Client does not exist");
      } else if (client_.salesman.toString() !== ctx.user.id) {
        throw Error("Salesman does not have access to this client");
      }

      //verify if products exist and the quantity is aviable

      for await (const order of input.order) {
        const { id } = order;
        const product = await Product.findById(id);

        if (!product) {
          throw new Error("Product does not exist");
        } else if (product.exist < order.quantity) {
          throw new Error(
            `the product ${product.name} exceds the aviable quantity`
          );
        } else {
          product.exist = product.exist - order.quantity;

          await product.save();
        }
      }

      //create order

      const newOrder = new Order(input);
      newOrder.salesman = ctx.user.id;

      try {
        const res = await newOrder.save();
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    updateOrderById: async (_, { id, input }, ctx) => {
      const { client } = input;
      const order = await Order.findById(id);

      if (!order) {
        throw new Error("Order does not exists");
      } else if (order.salesman.toString() !== ctx.user.id) {
        throw Error("Salesman does not have access to this order");
      }

      if (input.order) {
        for await (const order of input.order) {
          const { id } = order;
          const product = await Product.findById(id);

          if (!product) {
            throw new Error("Product does not exist");
          } else if (product.exist < order.quantity) {
            throw new Error(
              `the product ${product.name} exceds the aviable quantity`
            );
          } else {
            product.exist = product.exist - order.quantity;

            await product.save();
          }
        }
      }

      const updateOrder = await Order.findByIdAndUpdate(id, input, {
        new: true,
      });

      return updateOrder;
    },
    deleteOrderById: async (_, { id }, ctx) => {
      const order = await Order.findById(id);

      if (!order) {
        throw new Error("Order does not exists");
      } else if (order.salesman.toString() !== ctx.user.id) {
        throw Error("Salesman does not have access to this order");
      }

      await Order.findOneAndDelete({ _id: id });
      return "Order removed succesfully";
    },
  },
};

module.exports = resolvers;
