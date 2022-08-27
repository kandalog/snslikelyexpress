const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// 投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    return res.status(200).json(savePost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json("投稿の更新に成功しました！");
    } else {
      return res.status(403).json("他人の投稿は編集できません。");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿を削除しました");
    } else {
      return res.status(403).json("他人の投稿は削除できません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 特定の投稿にいいねをする
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // まだ投稿にいいねが押されていなかったら
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("いいねに成功しました");
      // 投稿に既にいいねが押されていたら
    } else {
      //いいねしているユーザーIDを取り除く
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(403).json("いいねを取り消しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// タイムラインの投稿を取得
router.get("/timeline/all", async (req, res) => {
  try {
    // 自分が投稿した内容
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });

    // フォローしているユーザーの投稿
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
