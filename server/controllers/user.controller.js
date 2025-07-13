import sql from "../config/db.js";
import APIError from "../utils/APIError.js";
import logger from "../utils/logger.js";

export const getUserCreations = async (req, res, next) => {
  logger.info("getUserCreations controller hit.");
  try {
    const { userId } = req.auth();

    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

    if (!creations || creations.length === 0) {
      throw new APIError(404, "No creations found for this user.");
    }

    res.status(200).json({ success: true, creations });
  } catch (error) {
    logger.error(`Error in getUserCreations: ${error}`);
    next(error);
  }
};

export const getPublishedCreations = async (req, res, next) => {
  logger.info("publishCreations controller hit.");
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE published = true ORDER BY created_at DESC`;

    if (!creations || creations.length === 0) {
      throw new APIError(404, "No creations found.");
    }

    res.status(200).json({ success: true, creations });
  } catch (error) {
    logger.error(`Error in getPublishedCreations: ${error}`);
    next(error);
  }
};

export const toggleLikeCreation = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      throw new APIError(404, "Creation not found.");
    }

    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filteR((like) => user !== userIdStr);
      message = "Creation unliked.";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked.";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray} WHERE id = ${id}`;

    res.status(200).json({ success: true, message });
  } catch (error) {
    logger.error(`Error in toggleLikeCreation: ${error}`);
    next(error);
  }
};
