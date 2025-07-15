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
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

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
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
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

export const deleteCreation = async (req, res, next) => {
  logger.info("deleteCreation controller hit.");
  try {
    const { userId } = req.auth();
    const { id } = req.params;

    if (!id) {
      throw new APIError(400, "Creation id is required.");
    }

    const creationId = parseInt(id);
    if (isNaN(creationId)) {
      throw new APIError(400, "Invalid creation id.");
    }

    const existingCreation = await sql`
      SELECT id, user_id
      FROM creations
      WHERE id = ${creationId}
    `;

    if (existingCreation.length === 0) {
      throw new APIError(404, "Creation not found.");
    }

    if (existingCreation[0].user_id !== userId) {
      throw new APIError(
        403,
        "You are not authorized to delete this creation."
      );
    }

    const result = await sql`
      DELETE FROM creations
      WHERE id = ${creationId} AND user_id = ${userId}
    `;

    if (result.count === 0) {
      throw new APIError(404, "Creation not found or could not be deleted.");
    }

    logger.info(
      `Creation ${creationId} deleted successfully by user ${userId}.`
    );

    res.status(200).json({
      success: true,
      message: "Creation deleted successfully.",
    });
  } catch (error) {
    logger.error(`Error in deleteCreation: ${error}`);
    next(error);
  }
};
