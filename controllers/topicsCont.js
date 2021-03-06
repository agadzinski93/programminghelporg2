const AppError = require("../utilities/AppError");
const { escapeHTML } = require("../utilities/helpers/sanitizers");
const {
  topicExists,
  insertTopic,
  updateTopic,
  removeTopic,
} = require("../utilities/helpers/topicHelpers");

module.exports = {
  createTopic: async (req, res, next) => {
    const topicName = escapeHTML(req.body.topic.name);
    const topicDifficulty = req.body.topic.difficulty;
    const topicDescription = escapeHTML(req.body.topic.description);

    const exists = await topicExists(topicName);
    if (exists instanceof AppError) return next(exists);
    else if (exists !== 0) {
      req.flash("error", "Topic Already Exists");
      res.redirect(`/user/${req.user.username}/dashboard`);
    } else {
      const error = await insertTopic(
        topicName,
        topicDifficulty,
        topicDescription,
        req.user.username
      );
      if (error instanceof AppError) return next(error);
      req.flash("success", "Topic Created");
      res.redirect(`/user/${req.user.username}/dashboard`);
    }
  },
  editTopic: async (req, res, next) => {
    const originalTopicName = escapeHTML(req.params.topic);
    const topicName = escapeHTML(req.body.topic.name);
    const topicDifficulty = req.body.topic.difficulty;
    const topicDescription = escapeHTML(req.body.topic.description);

    const result = await updateTopic(
      topicName,
      topicDifficulty,
      topicDescription,
      originalTopicName
    );
    if (result instanceof AppError) return next(result);
    else {
      req.flash("success", "Topic Updated");
      res.redirect(`/user/${req.user.username}/dashboard`);
    }
  },
  deleteTopic: async (req, res, next) => {
    const topicName = escapeHTML(req.params.topic);
    const result = await removeTopic(topicName);
    if (result instanceof AppError) return next(result);
    else {
      req.flash("success", "Topic Deleted");
      res.redirect(`/user/${req.user.username}/dashboard`);
    }
  },
};
