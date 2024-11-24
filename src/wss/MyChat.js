import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { getRooms } from "../controllers/RoomController.js";
import { Message } from "../models/Message.js";
import { configDotenv } from "dotenv";
configDotenv();

export class MyChat extends Server {
  constructor(port) {
    super(port, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
    });
    this.rooms = {};
    this.InitSocketEvents();
  }

  InitSocketEvents() {
    this.use((socket, next) => {
      // Vérifier l'authentification en utilisant le token
      const token = socket.handshake.auth.token; // On suppose que le token est envoyé via 'handshake'

      if (!token) {
        return next(new Error("Token JWT manquant")); // Si le token est manquant, on refuse la connexion
      }

      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return next(new Error("Token invalide")); // Si le token est invalide, on refuse la connexion
        }
        // Si le token est valide, ajouter l'utilisateur aux données du socket
        socket.user = decoded.dataValues;

        try {
          const data = await getRooms(socket.user.id);
          const rooms = data.map((room) => room.dataValues);
          socket.emit("success", {
            message: "Authentification réussie",
            rooms: rooms,
          });
          next();
        } catch (e) {
          console.error(e);
          next(new Error("Erreur lors de la récupération des rooms"));
        }
      });
    });

    this.on('connection', (socket) => {
      console.log("Utilisateur connecté:", socket.user);

      // Rejoindre une room
      socket.on("joinRoom", async (roomId) => {
        if (!this.rooms[roomId]) {
          this.rooms[roomId] = { users: [] }; // Initialisation si room inexistante
        }

        // Ajouter le socket à la room interne de `socket.io`
        socket.join(roomId);

        // Gérer les données spécifiques à la room
        if (!this.rooms[roomId].users.includes(socket.user.id)){
          this.rooms[roomId].users.push(socket.user.id);
        }

        // Notifier les autres utilisateurs dans la room
        socket.to(roomId).emit("userJoined", {
          userId: socket.user,
          roomId,
        });
        const messages = await Message.findAll({
          where: { roomId },
          order: [["createdAt", "ASC"]],
        });

        socket.emit("joinedRoom", {
          messages: messages,
          roomId,
        });
      });

      // Message dans une room
      socket.on("message", async ({ roomId, message }) => {
        console.log(`Message de la room ${roomId}:`, message);
        await Message.create({
          authorID: socket.user.id,
          roomId,
          content: message,
        });
        const newMessage = await Message.findOne({
          where: { authorID: socket.user.id, roomId, content: message },
        });
        // Envoyer le message à tous les sockets de la room
        this.to(roomId).emit("message", {
          userId: socket.user.id,
          newMessage,
        });
      });

      socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        if (this.rooms[roomId]) {
          // Supprimer l'utilisateur de la liste
          this.rooms[roomId].users = this.rooms[roomId].users.filter(
            (id) => id !== socket.user.id
          );

          // Supprimer la room si elle est vide
          if (this.rooms[roomId].users.length === 0) {
            delete this.rooms[roomId];
          }
        }
        console.log(`Utilisateur ${socket.user.id} a quitté la room ${roomId}`);
      });

      socket.on("logout", () => {
        console.log("Utilisateur déconnecté:", socket.user.id);

        // Nettoyer l'utilisateur de toutes les rooms où il était présent
        for (const roomId in this.rooms) {
          this.rooms[roomId].users = this.rooms[roomId].users.filter(
            (id) => id !== socket.user.id
          );

          if (this.rooms[roomId].users.length === 0) {
            delete this.rooms[roomId];
          }
        }

        console.log("État des rooms après déconnexion:", this.rooms);
      });
    });
  }
}
