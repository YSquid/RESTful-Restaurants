const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const restaurant = STARRED_RESTAURANTS.find((restaurant) => {
    return restaurant.restaurantId === id;
  });
  if (!restaurant) {
    res.status(404).send("Restaurant not found in starred list");
  }
  const restoWithName = ALL_RESTAURANTS.filter((fullResto) => {
    return fullResto.id === restaurant.restaurantId;
  });
  const joinedResto = {
    name: restoWithName[0].name,
    restaurantId: restaurant.restaurantId,
    comment: restaurant.comment,
  };
  res.status(200).json(joinedResto);
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  const { restaurantId, comment } = req.body;

  const foundStarred = STARRED_RESTAURANTS.find((starred) => {
    return starred.restaurantId === restaurantId
  })

  if (foundStarred) {
    res.status(400).send('Already starred')
  }

  const newId = uuidv4();

  const newStarred = {
    id: newId,
    restaurantId: restaurantId,
    comment: comment,
  };

  STARRED_RESTAURANTS.push(newStarred);
  res.status(201).send(newStarred);
});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */

module.exports = router;
