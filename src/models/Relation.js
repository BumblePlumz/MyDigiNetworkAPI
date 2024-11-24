import { User } from "./User.js";
import { Subscription } from "./Subscription.js";
import { Comment } from "./Comment.js";
import { Article } from "./Article.js";
import { Room } from "./Room.js";
import { Message } from "./Message.js";

export const setupRelations = () => {
  User.hasMany(Subscription, { 
    foreignKey: "ownerID",
    onDelete: "CASCADE",
  });
  Subscription.belongsTo(User, {
    foreignKey: "ownerID",
  });

  User.hasMany(Subscription, { 
    foreignKey: "targetID",
    onDelete: "CASCADE",
  });
  Subscription.belongsTo(User, {
    foreignKey: "targetID",
    as: "friend",
  });

  User.hasMany(Comment, { 
    foreignKey: "authorID", 
    as: "comments",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(User, {
    foreignKey: "authorID",
    as: "author",
  });


  Article.hasMany(Comment, { 
    foreignKey: "articleID", 
    as: "comments" ,
    onDelete: "SET NULL",
  });
  Comment.belongsTo(Article, {
    foreignKey: "articleID",
  });

  User.hasMany(Article, {
    foreignKey: "authorID",
    as: "articles",
    onDelete: "SET DEFAULT",
    onUpdate: "RESTRICT",
  });
  Article.belongsTo(User, {
    foreignKey: "authorID",
    as: "author",
    defaultValue: 0,
  });

  User.hasMany(Room, { foreignKey: "ownerID" });
  Room.belongsTo(User, { foreignKey: "ownerID" });

  User.belongsToMany(Room, {
    through: "userRoom",
    foreignKey: "userID",
    as: "userRooms",
  });
  Room.belongsToMany(User, {
    through: "userRoom",
    foreignKey: "roomID",
    as: "userRooms",
  });

  User.hasMany(Message, { 
    foreignKey: "authorID", 
  });
  Message.belongsTo(User, { 
    foreignKey: "authorID" ,
  });
  Room.hasMany(Message, { 
    foreignKey: "roomID", 
    as: "messages", 
    onDelete: "CASCADE",
  });
  Message.belongsTo(Room, { 
    foreignKey: "roomID",
  });
};
